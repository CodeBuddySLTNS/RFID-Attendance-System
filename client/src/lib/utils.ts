import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Axios from "axios";
import config from "../../system.config.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const axiosInstance = Axios.create({
  baseURL: config.isProduction
    ? config.prodServer + "/api"
    : config.devServer + "/api",
});

axiosInstance.interceptors.request.use(
  (reqConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const res = await Axios.post(
            (config.isProduction ? config.prodServer : config.devServer) + "/api/auth/refresh",
            { refreshToken }
          );
          const { token } = res.data;
          localStorage.setItem("token", token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("faculty");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const coleAPI =
  (endpoint: string, method?: string) => async (data: object) => {
    const token = localStorage.getItem("token");
    let response;

    switch (method?.toUpperCase()) {
      case "POST":
        response = await axiosInstance.post(endpoint, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;

      case "PATCH":
        response = await axiosInstance.patch(endpoint, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;

      case "DELETE":
        response = await axiosInstance.delete(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: data,
        });
        return response.data;

      default:
        response = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
    }
  };
