import { z } from "zod";

export const CATEGORY_OPTIONS = [
  "PLUMBING",
  "ELECTRICAL",
  "CLEANING",
  "SALON",
  "CONSULTATION",
] as const;

export type ServiceCategoryType = typeof CATEGORY_OPTIONS[number];

export const CreateServiceFormSchema = z.object({
  title: z
    .string()
    .min(1, "Service title is required")
    .max(100, "Title must be under 100 characters"),
  description: z
    .string()
    .min(5, "Please provide a detailed description (min 5 characters)"),
  category: z.enum(CATEGORY_OPTIONS),
  price: z
    .string()
    .min(1, "Base price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number",
    }),
  isAvailable: z.boolean(),
});

export type CreateServiceFormData = z.infer<typeof CreateServiceFormSchema>;
