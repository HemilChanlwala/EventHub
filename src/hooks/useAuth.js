import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session on page load
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setLoading(false);
    };

    getUser();

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
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
  const register = async (email, password) => {
    return await supabase.auth.signUp({
      email,
      password,
    });
  };

  // Email Login
  const login = async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
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
  };

  return {
    user,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
  };
}