import axiosInstance from "./axios";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export interface AuthResponse {
  user: {
    id: string | number;
    name: string;
    email: string;
  };
  access_token: string;
}

export const authApi = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login",
      data,
    );

    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }

    return response.data;
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/register",
      data,
    );

    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }

    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem("token");
  },

  getCurrentUser: async (): Promise<AuthResponse["user"]> => {
    const response = await axiosInstance.get<AuthResponse["user"]>("/auth/me");
    return response.data;
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem("token") !== null;
  },
};
