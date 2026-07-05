"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";

const AuthModal = dynamic(() => import("@/components/auth/AuthModal"), { ssr: false });

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  provider?: string;
  plan?: string | null;
}

type Mode = "login" | "signup";

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  openAuth: (mode?: Mode) => void;
  closeAuth: () => void;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("login");

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const json = await res.json();
      setUser(json.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openAuth = (m: Mode = "login") => {
    setMode(m);
    setOpen(true);
  };
  const closeAuth = () => setOpen(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, loading, refresh, openAuth, closeAuth, logout }}>
      {children}
      {open && (
        <AuthModal
          initialMode={mode}
          onClose={closeAuth}
          onSuccess={async () => {
            await refresh();
            setOpen(false);
          }}
        />
      )}
    </Ctx.Provider>
  );
}
