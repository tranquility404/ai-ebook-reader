// context/AuthContext.tsx
import apiClient from "@/utils/apiClient";
import { AxiosResponse } from "axios";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  password: string;
}

interface AuthContextType {
  isServerDown: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsServerDown: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  login: (userData: User) => Promise<AxiosResponse<any, any>>;
  register: (userData: User) => Promise<AxiosResponse<any, any>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isServerDown, setIsServerDown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      // Simulate fetching user data based on the token
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const register = (userData: User) => {
    return authenticate("/auth/register", userData)
  };

  const login = (userData: User) => {
    return authenticate("/auth/login", userData)
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
    <AuthContext.Provider value={{ isServerDown, isLoading, isAuthenticated, setIsServerDown, setIsLoading, login, register, logout }}>
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
