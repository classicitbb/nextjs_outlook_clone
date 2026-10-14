"use client";

import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

// Create a provider component
const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getAccount = async () => {
      try {
        setUser(await account.get());
      } catch (error) {
        setUser(null);
      }
    };
    getAccount();
  }, []);

  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context
const useAccount = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAccount must be used within a Use AuthProvider");
  }
  return context;
};

export { AuthProvider, useAccount };
