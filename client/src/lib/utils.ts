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
        // GET request
        response = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
    }
  };
