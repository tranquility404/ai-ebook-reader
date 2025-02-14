import apiClient from "@/utils/apiClient";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface User {
  email: string;
  password: string;
}

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsLoading: (value: boolean) => void;
  login: (userData: User) => void;
  register: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const register = async (userData: User) => {
    return await authenticate("/auth/register", userData)
  };

  const login = async (userData: User) => {
    return await authenticate("/auth/login", userData)
  };

  const authenticate = async (url: string, userData: User) => {
    const res = await apiClient.post(url, userData);
    localStorage.setItem("auth-token", res.data); // Store token
    setIsAuthenticated(true);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("auth-token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated, setIsLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
