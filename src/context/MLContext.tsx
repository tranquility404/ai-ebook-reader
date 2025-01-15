import { ErrorMessage } from "@/types/error-message";
import apiClient from "@/utils/apiClient";
import { createContext, ReactNode, useContext, useState } from "react";

interface MLContextType {
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
    checkServer: () => Promise<void>;
}

const MLContext = createContext<MLContextType | undefined>(undefined);

export const MLProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const checkServer = async () => {
        try {
          await apiClient.get("/ml/health-check");
          setIsLoading(false);
        } catch (error) {
          console.error('Error:', (error as ErrorMessage)?.response?.message || "An unknown error occurred")
        } finally {
          setIsLoading(false);
        }
      }
    

    return (
        <MLContext.Provider value={{isLoading, setIsLoading, checkServer }}>
            {children}
        </MLContext.Provider>
    );
};

export const useMLServer = (): MLContextType => {
    const context = useContext(MLContext);
    if (!context) {
        throw new Error("useMLServer must be used within a MLProvider");
    }
    return context;
};
