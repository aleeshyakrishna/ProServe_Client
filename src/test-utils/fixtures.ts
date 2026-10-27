import type { Service } from "@/types";
import { POPULAR_SERVICES } from "@/constants";

type ServiceOverrides = Partial<Omit<Service, "provider">> & { location?: string; slug?: string };

export const makeService = ({ location, slug, ...overrides }: ServiceOverrides = {}): Service => {
  const base = POPULAR_SERVICES[0];
  const categorySlug = slug ?? base.category.slug;
  return {
    ...base,
    ...overrides,
    categoryId: categorySlug,
    category: { ...base.category, slug: categorySlug, name: categorySlug },
    provider: { ...base.provider, location: location ?? "Dubai Marina, Dubai" } as Service["provider"],
  };
};
