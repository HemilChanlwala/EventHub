import { useEffect, useState } from "react";
import { clearSessionStoragePreference, setSessionStoragePreference, supabase } from "../lib/supabase";

const buildProfileFromUser = (authUser, fallbackProfile = null) => {
  const metadata = authUser?.user_metadata || {};

  return {
    id: authUser?.id || fallbackProfile?.id || null,
    full_name: fallbackProfile?.full_name || metadata.full_name || metadata.name || metadata.fullName || null,
    email: fallbackProfile?.email || authUser?.email || metadata.email || null,
    phone: fallbackProfile?.phone || metadata.phone || null,
    role: fallbackProfile?.role || metadata.role || "attendee",
  };
};

const fetchProfile = async (authUser) => {
  if (!authUser?.id) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    if (!error && data) {
      return buildProfileFromUser(authUser, data);
    }
  } catch (err) {
    console.warn("Unable to load profile from Supabase", err);
  }

  return buildProfileFromUser(authUser);
};

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const syncAuthState = async (authUser, nextSession, shouldStopLoading = true) => {
    setUser(authUser ?? null);
    setSession(nextSession ?? null);
    setIsAuthenticated(Boolean(authUser));

    if (authUser?.id) {
      const profileData = await fetchProfile(authUser);
      setProfile(profileData);
    } else {
      setProfile(null);
    }

    if (shouldStopLoading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (currentSession?.user) {
          if (!isMounted) return;
          await syncAuthState(currentSession.user, currentSession, false);
          setLoading(false);
          return;
        }

        const response = await supabase.auth.getUser();
        const nextUser = response?.data?.user ?? null;
        const error = response?.error ?? null;

        if (!isMounted) return;

        if (!error && nextUser) {
          console.log(nextUser.email);
          await syncAuthState(nextUser, null, false);
        } else {
          setUser(null);
          setSession(null);
          setProfile(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.warn('Unable to initialize auth session', err);
        if (isMounted) {
          setUser(null);
          setSession(null);
          setProfile(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      if (!isMounted) return;

      const authUser = nextSession?.user ?? null;
      if (authUser) {
        await syncAuthState(authUser, nextSession, false);
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
        setIsAuthenticated(false);
      }

      setLoading(false);

      if (
        event === 'SIGNED_IN' &&
        (window.location.search || window.location.hash)
      ) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const register = async ({ fullName, email, phone, password, role, rememberMe = true }) => {
    setSessionStoragePreference(rememberMe);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role: role || 'user',
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data?.user?.id) {
      const nextProfile = buildProfileFromUser(data.user, {
        id: data.user.id,
        full_name: fullName,
        email,
        phone,
        role: role || 'user',
      });
      setUser(data.user);
      setProfile(nextProfile);
      setIsAuthenticated(Boolean(data.user));
    }

    return { success: true };
  };

  const login = async (email, password, options = {}) => {
    const { rememberMe = true } = options;
    setSessionStoragePreference(rememberMe);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (data?.session) {
      console.log(data.session);
    }

    const authUser = data?.user ?? null;
    let profileData = null;
    let role = 'attendee';

    if (authUser?.id) {
      profileData = await fetchProfile(authUser);

      if (profileData?.role) {
        role = profileData.role;
      } else {
        role = 'user';
      }
    }

    await syncAuthState(authUser, data?.session ?? null, true);

    return {
      success: true,
      user: authUser,
      role,
      profile: profileData,
    };
  };

  const loginWithGoogle = async (options = {}) => {
    const { rememberMe = true } = options;
    setSessionStoragePreference(rememberMe);

    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    clearSessionStoragePreference();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    session,
    profile,
    loading,
    isAuthenticated,
    register,
    login,
    loginWithGoogle,
    logout,
  };
}