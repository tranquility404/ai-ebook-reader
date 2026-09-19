import axios from "axios";

export const apiPublicClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiAuthClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// for attaching tokens
apiAuthClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// for handling errors globally
apiAuthClient.interceptors.response.use(
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


export default apiAuthClient;