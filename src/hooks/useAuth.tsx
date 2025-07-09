"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { signOut, signIn, useSession } from "next-auth/react";

interface User {
  id: string;
  email: string;
  username: string;
  name: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => false,
  loginWithGoogle: async () => { },
  logout: () => { },
  isLoading: true,
  isAuthenticated: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Use Next Auth session
  const { data: session, status } = useSession();

  // Load user from NextAuth session or localStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log('Auth loading state:', { status, session: !!session });

        // First check if we have a NextAuth session
        if (session && session.user) {
          console.log('NextAuth session found:', session.user.email);

          const nextAuthUser = {
            id: session.user.id || session.user.email!.split("@")[0],
            email: session.user.email!,
            username: session.user.username || session.user.email!.split('@')[0],
            name: session.user.name || null,
            firstName: session.user.firstName || null,
            lastName: session.user.lastName || null,
            image: session.user.image || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setUser(nextAuthUser);

          // For simplified version, we won't use custom tokens
          console.log('NextAuth user loaded successfully');
          setIsLoading(false);
          return;
        }

        // Fall back to localStorage if no NextAuth session
        if (typeof window !== 'undefined') {
          const savedToken = localStorage.getItem("auth_token");
          const savedUser = localStorage.getItem("auth_user");

          if (savedToken && savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setToken(savedToken);
            setUser(parsedUser);
            console.log('User loaded from localStorage');
          }
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
        // Clear corrupted data
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      } finally {
        setIsLoading(false);
      }
    };

    if (status !== 'loading') {
      loadUserData();
    }
  }, [session, status]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_user", JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      // NextAuth will handle the redirect
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const logout = () => {
    // Clear local state
    setUser(null);
    setToken(null);

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }

    // Sign out from NextAuth
    signOut({ callbackUrl: '/login' });
  };

  const contextValue: AuthContextType = {
    user,
    token,
    login,
    loginWithGoogle,
    logout,
    isLoading: isLoading || status === 'loading',
    isAuthenticated: Boolean(user && (token || session)),
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  return context;
}