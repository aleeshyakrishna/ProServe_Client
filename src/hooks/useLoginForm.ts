"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/validations/auth.schema";
import { AuthService } from "@/services/auth.service";
import type { LoginFormData, AuthState } from "@/types/auth";

export function useLoginForm() {
  const router = useRouter();
  const [authState, setAuthState] = React.useState<AuthState>({
    isLoading: false,
    isSuccess: false,
    error: null,
  });

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthState({ isLoading: true, isSuccess: false, error: null });

    try {
      const result = await AuthService.login(data);

      setAuthState({ isLoading: false, isSuccess: true, error: null });

      // Redirect based on role returned by the backend
      const primaryRole = result.roles[0]?.toUpperCase();
      if (primaryRole === "SERVICE_PROVIDER" || primaryRole === "PROVIDER") {
        router.push("/provider/dashboard");
      } else {
        router.push("/customer/dashboard");
      }
    } catch (error) {
      setAuthState({
        isLoading: false,
        isSuccess: false,
        error: error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: authState.isLoading,
    isSuccess: authState.isSuccess,
    submitError: authState.error,
  };
}
