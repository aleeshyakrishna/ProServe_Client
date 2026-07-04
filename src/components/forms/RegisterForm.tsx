"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { User, Mail, Phone, Lock, AlertCircle, Briefcase, UserCheck } from "lucide-react";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const { form, onSubmit, isLoading, isSuccess, submitError } = useRegisterForm();
  const { register, control, formState: { errors }, watch } = form;

  // Watch values for showing conditional strength checklist
  const watchedPassword = watch("password") || "";

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <AuthHeader
        title="Create Your Account"
        subtitle="Join 50,000+ customers booking verified pros across the UAE. It only takes a minute — no card required."
      />

      {/* 2. Google SSO */}
      <SocialLoginButton text="Sign up with Google" isLoading={isLoading} />

      {/* 3. Form */}
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {/* Error box */}
        {submitError && (
          <div
            className="p-3.5 rounded-xl bg-error-50 border border-error-100 flex items-start gap-2.5 text-xs text-error-500 font-medium animate-fade-in"
            role="alert"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Full Name */}
        <Input
          {...register("fullName")}
          label="Full Name"
          placeholder="e.g. Fatima Al Mansoori"
          disabled={isLoading || isSuccess}
          errorText={errors.fullName?.message}
          leftIcon={<User size={16} />}
          autoComplete="name"
        />

        {/* Email Address */}
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

        {/* Phone Number */}
        <Input
          {...register("phone")}
          label="Mobile Number (UAE)"
          placeholder="e.g. 050 123 4567"
          disabled={isLoading || isSuccess}
          errorText={errors.phone?.message}
          leftIcon={<Phone size={16} />}
          autoComplete="tel"
        />

        {/* Role Selection Grid */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-[var(--text-primary)] block">
            I want to join as a
          </span>
          <Controller
            control={control}
            name="role"
            render={({ field: { value, onChange } }) => (
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Select role profile">
                {/* Option 1: Customer */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={value === "customer"}
                  disabled={isLoading || isSuccess}
                  onClick={() => onChange("customer")}
                  className={cn(
                    "flex flex-col items-center justify-center p-3.5 rounded-xl border text-center gap-2",
                    "transition-all duration-200 cursor-pointer select-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20",
                    value === "customer"
                      ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50/20 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-tertiary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <UserCheck size={18} aria-hidden="true" />
                  <span className="text-xs leading-none">Customer</span>
                </button>

                {/* Option 2: Provider */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={value === "provider"}
                  disabled={isLoading || isSuccess}
                  onClick={() => onChange("provider")}
                  className={cn(
                    "flex flex-col items-center justify-center p-3.5 rounded-xl border text-center gap-2",
                    "transition-all duration-200 cursor-pointer select-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20",
                    value === "provider"
                      ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50/20 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-tertiary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <Briefcase size={18} aria-hidden="true" />
                  <span className="text-xs leading-none">Service Provider</span>
                </button>
              </div>
            )}
          />
          {errors.role?.message && (
            <p className="text-xs text-error-500 leading-none">{errors.role.message}</p>
          )}
        </div>

        {/* Password field */}
        <div className="space-y-1.5">
          <label
            htmlFor="password-register"
            className="text-sm font-medium text-[var(--text-primary)] leading-none"
          >
            Create Password
          </label>
          <PasswordInput
            id="password-register"
            {...register("password")}
            placeholder="••••••••"
            disabled={isLoading || isSuccess}
            errorText={errors.password?.message}
            leftIcon={<Lock size={16} />}
            showStrengthMeter
            showChecklist
            autoComplete="new-password"
          />
        </div>

        {/* Confirm Password field */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword-register"
            className="text-sm font-medium text-[var(--text-primary)] leading-none"
          >
            Confirm Password
          </label>
          <PasswordInput
            id="confirmPassword-register"
            {...register("confirmPassword")}
            placeholder="••••••••"
            disabled={isLoading || isSuccess}
            errorText={errors.confirmPassword?.message}
            leftIcon={<Lock size={16} />}
            autoComplete="new-password"
          />
        </div>

        {/* Terms acceptance checkbox */}
        <div className="space-y-1">
          <div className="flex items-start gap-2 py-1">
            <input
              id="acceptTerms"
              type="checkbox"
              {...register("acceptTerms")}
              disabled={isLoading || isSuccess}
              className={cn(
                "h-4.5 w-4.5 mt-0.5 rounded border-[var(--border-default)] text-emerald-600 bg-[var(--surface-card)]",
                "focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-emerald-500/20",
                "cursor-pointer disabled:opacity-50"
              )}
            />
            <label
              htmlFor="acceptTerms"
              className="text-xs text-[var(--text-tertiary)] font-medium select-none cursor-pointer leading-normal"
            >
              I agree to the{" "}
              <a href="/legal/terms" className="text-emerald-600 font-semibold hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/legal/privacy" className="text-emerald-600 font-semibold hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.acceptTerms?.message && (
            <p className="text-xs text-error-500 leading-none">{errors.acceptTerms.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full rounded-xl mt-2 font-semibold text-sm transition-all duration-150 active:scale-[0.99]"
        >
          Create Account
        </Button>
      </form>

      {/* Footer link to Login */}
      <AuthFooter
        promptText="Already have an account?"
        linkText="Sign in"
        linkHref="/login"
      />
    </div>
  );
}
