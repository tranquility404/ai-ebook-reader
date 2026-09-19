import { create } from "zustand";

// create state shape
interface AuthStatusState {
    authStatus: 'checking' | 'authenticated' | 'unauthenticated';
    setAuthStatus: (authStatus: AuthStatusState['authStatus']) => void;
}

// Create the store
export const useAuthStatusStore = create<AuthStatusState>((set) => ({
    authStatus: 'checking',
    setAuthStatus: (authStatus) => set({ authStatus }),
}));


interface LoadingState {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
    isLoading: true,
    setIsLoading: (loadingStatus) => set({ isLoading: loadingStatus }),
}));

interface HealthState {
    isHealthy: boolean;
    setIsHealthy: (isHealthy: boolean) => void;
}

export const useHealthStore = create<HealthState>((set) => ({
    isHealthy: false,
    setIsHealthy: (healthStatus) => set({ isHealthy: healthStatus }),
}));