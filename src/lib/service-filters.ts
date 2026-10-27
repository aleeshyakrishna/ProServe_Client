import type { Service } from "@/types";

export type SortOption = "popular" | "price_asc" | "price_desc" | "rating";

export interface ServiceFilterValues {
  query: string;
  category: string;
  location: string;
  sortBy: string;
}

export interface LocationOption {
  value: string;
  label: string;
}

export const ALL = "all";

const DEFAULT_LOCATIONS = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Dubai Marina",
  "Business Bay",
  "Jumeirah",
  "Al Barsha",
];

const getProviderLocation = (service: Service): string | undefined =>
  (service.provider as { location?: string } | undefined)?.location;

/** Pure filter + sort used by the services page (easy to unit test). */
export function filterServices(services: Service[], filters: ServiceFilterValues): Service[] {
  const { query, category, location, sortBy } = filters;
  let result = [...services];

  if (category !== ALL) {
    const cat = category.toLowerCase();
    result = result.filter(
      (service) =>
        service.category.slug.toLowerCase() === cat || service.categoryId.toLowerCase() === cat
    );
  }

  if (location !== ALL) {
    const loc = location.toLowerCase();
    result = result.filter((service) => {
      const titleMatch = service.title.toLowerCase().includes(loc);
      const descMatch = service.description.toLowerCase().includes(loc);
      const busMatch = service.provider?.businessName?.toLowerCase().includes(loc);
      const providerLocMatch = getProviderLocation(service)?.toLowerCase().includes(loc) ?? false;
      return titleMatch || descMatch || busMatch || providerLocMatch;
    });
  }

  const q = query.toLowerCase().trim();
  if (q) {
    result = result.filter(
      (service) =>
        service.title.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q) ||
        service.category.name.toLowerCase().includes(q) ||
        service.category.slug.toLowerCase().includes(q)
    );
  }

  if (sortBy === "price_asc") {
    result.sort((a, b) => a.priceFrom - b.priceFrom);
  } else if (sortBy === "price_desc") {
    result.sort((a, b) => b.priceFrom - a.priceFrom);
  } else if (sortBy === "rating") {
    result.sort((a, b) => b.rating - a.rating);
  }

  return result;
}

/** Unique city/area list from provider locations, plus the default UAE areas. */
export function getAvailableLocations(services: Service[]): LocationOption[] {
  const locSet = new Set<string>();

  services.forEach((service) => {
    const loc = getProviderLocation(service);
    if (!loc) return;
    loc
      .split(",")
      .map((part) => part.trim())
      .forEach((part) => {
        if (part && part.toUpperCase() !== "UAE") locSet.add(part);
      });
  });

  DEFAULT_LOCATIONS.forEach((d) => locSet.add(d));

  return [
    { value: ALL, label: "All Cities / Areas" },
    ...Array.from(locSet).map((loc) => ({ value: loc, label: loc })),
  ];
}
