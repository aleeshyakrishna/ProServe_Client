"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateServiceFormSchema,
  type CreateServiceFormData,
  CATEGORY_OPTIONS,
} from "@/validations/service.schema";
import { DashboardServiceApi } from "@/services/dashboard.service";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useProviderDataStore } from "../store/useProviderDataStore";
import { useDashboardStore } from "../store/useDashboardStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Sparkles, DollarSign } from "lucide-react";

export function CreateServiceForm() {
  const { user } = useAuthStore();
  const { fetchData } = useProviderDataStore();
  const { setActiveTab } = useDashboardStore();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateServiceFormData>({
    resolver: zodResolver(CreateServiceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "CLEANING",
      price: "",
      isAvailable: true,
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: CreateServiceFormData) => {
    if (!user?.id) {
      setSubmitError("Unauthorized. Please log in again.");
      return;
    }

    setSubmitError(null);
    try {
      await DashboardServiceApi.createService({
        title: data.title,
        description: data.description,
        category: data.category,
        price: Number(data.price),
        providerId: user.id,
        isAvailable: data.isAvailable,
      });

      // Refresh provider data store
      await fetchData(user.id);
      
      // Redirect back to overview tab on success
      setActiveTab("overview");
      reset();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to register service");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in text-left">
      {/* Back button */}
      <button
        onClick={() => setActiveTab("overview")}
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-semibold cursor-pointer"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </button>

      <Card>
        <CardHeader className="pb-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <Sparkles size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Service Registry
            </span>
          </div>
          <CardTitle className="text-xl font-bold">List New Service Offering</CardTitle>
          <CardDescription className="text-xs">
            Add a new professional service to your ProServe provider profile.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {submitError && (
              <div className="p-3.5 rounded-xl bg-error-50 border border-error-100 text-error-500 text-xs font-medium">
                {submitError}
              </div>
            )}

            {/* Title */}
            <Input
              label="Service Title"
              placeholder="e.g. AC Filter Deep Cleaning & Disinfection"
              errorText={errors.title?.message}
              disabled={isSubmitting}
              {...register("title")}
            />

            {/* Category and Price Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-[var(--text-primary)] leading-none">
                  Service Category
                </label>
                <select
                  disabled={isSubmitting}
                  className="w-full h-10 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] text-sm text-[var(--text-primary)] px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700/20 focus-visible:border-navy-700 transition-colors"
                  {...register("category")}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0) + opt.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-error-500" role="alert">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <Input
                label="Base Price (AED)"
                type="number"
                step="0.01"
                placeholder="250.00"
                leftIcon={<DollarSign size={16} />}
                errorText={errors.price?.message}
                disabled={isSubmitting}
                {...register("price")}
              />
            </div>

            {/* Description */}
            <Textarea
              label="Service Description"
              placeholder="Describe the scope of work, duration, and inclusions (e.g. includes cleaning of filters, evaporator coil flush, drain line check...)"
              errorText={errors.description?.message}
              disabled={isSubmitting}
              {...register("description")}
            />

            {/* Availability status */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
              <input
                id="isAvailable"
                type="checkbox"
                disabled={isSubmitting}
                className="h-4.5 w-4.5 rounded border-[var(--border-default)] text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                {...register("isAvailable")}
              />
              <div className="flex flex-col text-left">
                <label
                  htmlFor="isAvailable"
                  className="text-xs font-bold text-[var(--text-primary)] cursor-pointer select-none"
                >
                  Mark as Available
                </label>
                <span className="text-[10px] text-[var(--text-tertiary)] leading-none mt-0.5">
                  Customers can immediately view and book this service offering online.
                </span>
              </div>
            </div>

            {/* Actions Grid */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setActiveTab("overview")}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
              >
                Create Service
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
