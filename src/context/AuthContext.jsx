import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { resolveAdminLoginEmail } from "../data/config";
import { getSupabase, isSupabaseConfigured } from "../lib/supabase";

const AuthContext = createContext(null);

async function readAdminMembership(client) {
  const { data, error } = await client.rpc("is_store_admin");
  if (error) throw new Error(`Admin huquqini tekshirish xatosi: ${error.message}`);
  return Boolean(data);
}

const getRecoveryRedirectUrl = () => {
  const configuredSite = import.meta.env.VITE_SITE_URL?.trim();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const base = (configuredSite || origin).replace(/\/+$/, "");
  return `${base}/admin/reset-password`;
};

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
        if (!admin) setError("Bu hisob store_admins jadvalida yo'q. Admin huquqi berilmagan.");
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
          if (!admin) setError("Bu hisob store_admins jadvalida yo'q. Admin huquqi berilmagan.");
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

  const signIn = useCallback(async (identifier, password) => {
    const client = await getSupabase();
    if (!client) throw new Error("Supabase sozlanmagan");

    setLoading(true);
    setError("");
    try {
      const { error: signInError } = await client.auth.signInWithPassword({
        email: resolveAdminLoginEmail(identifier),
        password,
      });
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

  const requestPasswordReset = useCallback(async (email) => {
    const client = await getSupabase();
    if (!client) throw new Error("Supabase sozlanmagan");

    const value = String(email ?? "").trim();
    if (!value) throw new Error("Email manzilini kiriting.");

    setError("");
    const { error: resetError } = await client.auth.resetPasswordForEmail(value, {
      redirectTo: getRecoveryRedirectUrl(),
    });
    if (resetError) {
      setError(resetError.message);
      throw resetError;
    }
  }, []);

  const updatePassword = useCallback(async (newPassword) => {
    const client = await getSupabase();
    if (!client) throw new Error("Supabase sozlanmagan");

    if (!newPassword || newPassword.length < 6) {
      throw new Error("Yangi parol kamida 6 belgidan iborat bo'lishi kerak.");
    }

    setError("");
    const { error: updateError } = await client.auth.updateUser({ password: newPassword });
    if (updateError) {
      setError(updateError.message);
      throw updateError;
    }
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
      requestPasswordReset,
      updatePassword,
      clearError: () => setError(""),
    }),
    [error, isAdmin, loading, session, signIn, signOut, requestPasswordReset, updatePassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
