import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || error.message || "An error occurred";

      if (status === 401) {
        localStorage.removeItem("authToken");
      }

      return Promise.reject(new Error(`${status}: ${message}`));
    }

    if (error.request) {
      return Promise.reject(new Error("Network error: No response received"));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
