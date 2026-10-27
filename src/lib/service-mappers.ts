import { FEATURED_PROVIDERS } from "@/constants";
import type { Service } from "@/types";

/** A service row as the backend API returns it. */
export interface RawService {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  providerId: string;
  isAvailable: boolean;
}

export const capitalize = (value: string) => value.charAt(0) + value.slice(1).toLowerCase();

export const findProvider = (providerId: string) =>
  FEATURED_PROVIDERS.find((p) => p.id === providerId);

/** Converts a backend service row into the app's Service shape. */
export const mapService = (item: RawService): Service => {
  const matchedProv = findProvider(item.providerId);
  const slug = item.category.toLowerCase();
  return {
    id: item.id,
    providerId: item.providerId,
    provider: {
      id: item.providerId,
      businessName: matchedProv?.businessName || "ProTech UAE Provider",
      avatarUrl: matchedProv?.avatarUrl || null,
      rating: matchedProv?.rating || 4.9,
      reviewCount: matchedProv?.reviewCount || 18,
      isVerified: matchedProv?.isVerified ?? true,
      location: matchedProv?.location || "Dubai Marina, Dubai",
    } as Service["provider"],
    categoryId: slug,
    category: { id: slug, name: capitalize(item.category), slug },
    title: item.title,
    description: item.description,
    imageUrl: null,
    priceFrom: item.price,
    priceTo: null,
    pricingType: "fixed" as const,
    currency: "AED",
    duration: "1-2 hours",
    isActive: item.isAvailable,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 15,
    createdAt: new Date().toISOString(),
  };
};
