import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

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
      return data;
    }
  } catch (err) {
    console.warn("Unable to load profile from Supabase", err);
  }

  return buildProfileFromUser(authUser);
};

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session and authenticated user on page load
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const authUser = session.user;
        setUser(authUser);

        const profileData = await fetchProfile(authUser);
        setProfile(profileData);
        setLoading(false);
        return;
      }

      const response = await supabase.auth.getUser();
      const user = response?.data?.user ?? null;
      const error = response?.error ?? null;

      if (!error && user) {
        console.log(user.email);
        setUser(user);

        const profileData = await fetchProfile(user);
        setProfile(profileData);
      } else {
        setUser(null);
        setProfile(null);
      }

      setLoading(false);
    };

    getUser();

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);

      if (authUser) {
        const profileData = await fetchProfile(authUser);
        setProfile(profileData);
      } else {
        setProfile(null);
      }

      setLoading(false);

      // Remove OAuth query parameters after successful login
      if (
        event === "SIGNED_IN" &&
        (window.location.search || window.location.hash)
      ) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Email Registration
  const register = async ({ fullName, email, phone, password, role }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role: role || "user",
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
        role: role || "user",
      });
      setProfile(nextProfile);
    }

    return { success: true };
  };

  // Email Login
  const login = async (email, password) => {
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
    let role = "attendee";

    if (authUser?.id) {
      profileData = await fetchProfile(authUser);

      if (profileData?.role) {
        role = profileData.role;
      } else {
        role = "user";
      }
    }

    setUser(authUser);
    setProfile(profileData);

    return {
      success: true,
      user: authUser,
      role,
      profile: profileData,
    };
  };

  // Google Login
  const loginWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return {
    user,
    profile,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
  };
}