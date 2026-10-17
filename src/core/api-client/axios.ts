import axios from "axios";
import { appConfig } from "../config/app-config";

export const axiosInstance = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: appConfig.requestTimeout,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
