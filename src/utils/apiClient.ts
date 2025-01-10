// utils/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // Use an environment variable for the backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor (e.g., for attaching tokens)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token"); // Replace with your preferred storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor (e.g., for handling errors globally)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login"; // Redirect to login on 401
    }
    return Promise.reject(error);
  }
);

// import axiosRetry from "axios-retry";

// axiosRetry(apiClient, {
//   retries: 3, // Retry up to 3 times
//   retryCondition: (error) => error.response?.status >= 500, // Retry on server errors
// });


export default apiClient;