"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/validations/auth.schema";
import { AuthService } from "@/services/auth.service";
import type { RegisterFormData, AuthState } from "@/types/auth";

export function useRegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryRole = searchParams.get("role");

  const [authState, setAuthState] = React.useState<AuthState>({
    isLoading: false,
    isSuccess: false,
    error: null,
  });

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "customer",
      acceptTerms: false,
    },
    mode: "onTouched",
  });

  React.useEffect(() => {
    if (queryRole === "provider" || queryRole === "customer") {
      form.setValue("role", queryRole);
    }
  }, [queryRole, form]);

  const onSubmit = async (data: RegisterFormData) => {
    setAuthState({ isLoading: true, isSuccess: false, error: null });

    try {
      const result = await AuthService.register(data);

      setAuthState({ isLoading: false, isSuccess: true, error: null });

      if (result.emailConfirmationSent) {
        // Email verification required before login is possible
        router.push("/verify-email");
      } else {
        // Auto-confirmed (e.g. Supabase email confirmation disabled in dev)
        if (data.role === "provider") {
          router.push("/provider/dashboard");
        } else {
          router.push("/customer/dashboard");
        }
      }
    } catch (error) {
      setAuthState({
        isLoading: false,
        isSuccess: false,
        error: error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
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
