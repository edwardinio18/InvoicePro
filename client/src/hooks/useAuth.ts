import { useMutation } from "@tanstack/react-query";
import { LoginInput, RegisterInput } from "@/api/auth";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      await login(credentials.email, credentials.password);
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
};

export const useRegister = () => {
  const { register } = useAuth();

  return useMutation({
    mutationFn: async (userData: RegisterInput) => {
      const { ...userDataToSend } = userData;
      await register(
        userDataToSend.name,
        userDataToSend.email,
        userDataToSend.password,
      );
    },
    onSuccess: () => {
      toast.success("Account created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
};
