"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import type { Session, User } from "@auth/core/types";
import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
  session?: Session | null;
};
export type AuthContextValue = {
  update: (data: Partial<User>) => void;
  user: User | null;
};
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children, session }: Props) => {
  const [user, setUser] = useState<User | null>(session?.user || null);
  const update = (data: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };



  return (
    <SessionProvider session={session}>
      <AuthContext.Provider value={{ user, update }}>
        {children}
      </AuthContext.Provider>
    </SessionProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
