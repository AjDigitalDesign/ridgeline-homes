"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role?: string;
  tenantId?: string | null;
};

type Session = {
  id: string;
  token: string;
  expiresAt: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => void;
  refreshAuth: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  signOut: () => {},
  refreshAuth: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAuth = useCallback(() => {
    const storedAuth = localStorage.getItem("auth_session");
    if (storedAuth) {
      try {
        const { session: storedSession, user: storedUser } = JSON.parse(storedAuth);

        // Check if session is expired
        if (storedSession?.expiresAt && new Date(storedSession.expiresAt) > new Date()) {
          setSession(storedSession);
          setUser(storedUser);
        } else {
          // Session expired, clear storage
          localStorage.removeItem("auth_session");
          localStorage.removeItem("session_token");
          setSession(null);
          setUser(null);
        }
      } catch (e) {
        console.error("Failed to parse stored auth:", e);
        localStorage.removeItem("auth_session");
        localStorage.removeItem("session_token");
      }
    } else {
      setSession(null);
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Load session from localStorage on mount
    loadAuth();

    // Listen for auth changes (from other tabs or callback page)
    const handleAuthChange = () => {
      loadAuth();
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [loadAuth]);

  const signOut = useCallback(async () => {
    // Call backend signout if we have a session
    const sessionToken = localStorage.getItem("session_token");
    if (sessionToken) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-out`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        });
      } catch (e) {
        console.error("Failed to sign out from backend:", e);
      }
    }

    // Clear local storage
    localStorage.removeItem("auth_session");
    localStorage.removeItem("session_token");
    setUser(null);
    setSession(null);

    // Trigger event for other components
    window.dispatchEvent(new Event("auth-change"));
  }, []);

  const refreshAuth = useCallback(() => {
    loadAuth();
  }, [loadAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user && !!session,
        signOut,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
