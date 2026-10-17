import { axiosInstance } from "./axios";

export const ApiClient = {
  async get<T>(url: string, params?: unknown): Promise<T> {
    const { data } = await axiosInstance.get<T>(url, {
      params,
    });

    return data;
  },

  async post<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await axiosInstance.post<T>(url, body);

    return data;
  },

  async put<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await axiosInstance.put<T>(url, body);

    return data;
  },

  async patch<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await axiosInstance.patch<T>(url, body);

    return data;
  },

  async delete<T>(url: string): Promise<T> {
    const { data } = await axiosInstance.delete<T>(url);

    return data;
  },
};
