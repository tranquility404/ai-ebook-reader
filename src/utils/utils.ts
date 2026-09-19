import { NavigateFunction } from "react-router-dom";

export const handleError = (message: any, status: number = 500, navigate: NavigateFunction) => {
    console.error("Global Error:", message);
    if (typeof message !== "string") {
        message = message.response.data.message || "Something went wrong";
        status = message.response.status || 500
    }
    navigate?.("/error", { state: { message, status } });
};