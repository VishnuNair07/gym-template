import { axiosInstance } from "./axios";
import { AuthService } from "./auth";

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },

  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    switch (error.response?.status) {
      case 401:
        AuthService.redirectToLogin();
        break;

      case 403:
        break;

      case 500:
        break;

      default:
        break;
    }

    return Promise.reject(error);
  },
);
