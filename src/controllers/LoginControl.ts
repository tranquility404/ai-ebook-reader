import { login, register } from "@/api/ApiRequests";
import { useAuthStatusStore } from "@/store/globalStates";

export const useAuthHelper = () => {
    const { authStatus, setAuthStatus } = useAuthStatusStore();

    const initiateRegistration = async (firstName: string, lastName: string, email: string, password: string, navigate: any) => {
        const res = await register({ firstName, lastName, email, password });

        if (res.status == 200) {
            localStorage.setItem("auth-token", res.data); // Store token
            setAuthStatus("authenticated");
            navigate("/");
            console.log("register success");
        }

        console.log(res.data);
    };

    const initiateLogin = async (email: string, password: string, navigate: any) => {
        const res = await login({ email, password });

        if (res.status == 200) {
            localStorage.setItem("auth-token", res.data); // Store token
            setAuthStatus("authenticated");
            navigate("/");
            console.log("login success");
        }

        console.log(res.data);
    };

    const logout = () => {
        localStorage.removeItem("auth-token");
        setAuthStatus("unauthenticated");
    };

    return {
        isAuthenticated: authStatus === "authenticated",
        initiateLogin,
        initiateRegistration,
        logout
    };
};