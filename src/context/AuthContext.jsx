import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "../lib/supabase";

const AuthContext = createContext(null);

async function readAdminMembership(client) {
  const { data, error } = await client.rpc("is_store_admin");
  if (error) throw new Error(`Admin huquqini tekshirish xatosi: ${error.message}`);
  return Boolean(data);
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    let client = null;

    const verifySession = async (nextSession) => {
      if (!active) return;
      setSession(nextSession);

      if (!nextSession) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const admin = await readAdminMembership(client);
        if (!active) return;
        setIsAdmin(admin);
        if (!admin) setError("Bu email store_admins jadvalida yo'q. Admin huquqi berilmagan.");
      } catch (verifyError) {
        if (!active) return;
        setIsAdmin(false);
        setError(verifyError.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    getSupabase()
      .then(async (supabase) => {
        if (!active || !supabase) {
          setLoading(false);
          return;
        }
        client = supabase;
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (!active) return;
        if (sessionError) setError(sessionError.message);
        await verifySession(data.session);
      })
      .catch((authError) => {
        if (!active) return;
        setError(authError.message || "Auth holatini olib bo'lmadi");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    let unsubscribe = null;

    getSupabase().then((client) => {
      if (!active || !client) return;
      const { data } = client.auth.onAuthStateChange(async (_event, nextSession) => {
        if (!active) return;
        setSession(nextSession);
        setError("");
        if (!nextSession) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        setLoading(true);
        try {
          const admin = await readAdminMembership(client);
          if (!active) return;
          setIsAdmin(admin);
          if (!admin) setError("Bu email store_admins jadvalida yo'q. Admin huquqi berilmagan.");
        } catch (verifyError) {
          if (!active) return;
          setIsAdmin(false);
          setError(verifyError.message);
        } finally {
          if (active) setLoading(false);
        }
      });
      unsubscribe = () => data.subscription.unsubscribe();
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const client = await getSupabase();
    if (!client) throw new Error("Supabase sozlanmagan");

    setLoading(true);
    setError("");
    try {
      const { error: signInError } = await client.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
    } catch (signInError) {
      setLoading(false);
      setError(signInError.message);
      throw signInError;
    }
  }, []);

  const signOut = useCallback(async () => {
    const client = await getSupabase();
    await client?.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    setError("");
  }, []);

  const value = useMemo(
    () => ({
      configured: isSupabaseConfigured,
      session,
      user: session?.user ?? null,
      isAdmin,
      loading,
      error,
      signIn,
      signOut,
      clearError: () => setError(""),
    }),
    [error, isAdmin, loading, session, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
