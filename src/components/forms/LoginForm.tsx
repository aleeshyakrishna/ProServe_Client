"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { useLoginForm } from "@/hooks/useLoginForm";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const { form, onSubmit, isLoading, isSuccess, submitError } = useLoginForm();
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      {/* 1. Header (Welcome back) */}
      <AuthHeader
        title="Welcome Back"
        subtitle="Your trusted UAE professionals are one tap away. Sign in to manage your bookings, wallet, and more."
      />

      {/* 2. Social Login (SSO) */}
      <SocialLoginButton isLoading={isLoading} />

      {/* 3. Form fields */}
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {/* API / Custom Error Callout */}
        {submitError && (
          <div
            className="p-3.5 rounded-xl bg-error-50 border border-error-100 flex items-start gap-2.5 text-xs text-error-500 font-medium animate-fade-in"
            role="alert"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Email field */}
        <Input
          {...register("email")}
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          disabled={isLoading || isSuccess}
          errorText={errors.email?.message}
          leftIcon={<Mail size={16} />}
          autoComplete="email"
        />

        {/* Password field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password-login"
              className="text-sm font-medium text-[var(--text-primary)] leading-none"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className={cn(
                "text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded px-1"
              )}
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password-login"
            {...register("password")}
            placeholder="••••••••"
            disabled={isLoading || isSuccess}
            errorText={errors.password?.message}
            leftIcon={<Lock size={16} />}
            autoComplete="current-password"
          />
        </div>

        {/* Remember me option */}
        <div className="flex items-center gap-2 py-1">
          <input
            id="rememberMe"
            type="checkbox"
            {...register("rememberMe")}
            disabled={isLoading || isSuccess}
            className={cn(
              "h-4.5 w-4.5 rounded border-[var(--border-default)] text-emerald-600 bg-[var(--surface-card)]",
              "focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-emerald-500/20",
              "cursor-pointer disabled:opacity-50"
            )}
          />
          <label
            htmlFor="rememberMe"
            className="text-xs text-[var(--text-tertiary)] font-medium select-none cursor-pointer"
          >
            Remember me on this device
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full rounded-xl mt-2 font-semibold text-sm transition-all duration-150 active:scale-[0.99]"
        >
          Sign In
        </Button>
      </form>

      {/* 4. Footer link to Register */}
      <AuthFooter
        promptText="Don't have an account?"
        linkText="Create one free"
        linkHref="/register"
      />
    </div>
  );
}
