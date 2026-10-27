"use client";

import * as React from "react";
import api from "@/lib/axios";
import { POPULAR_SERVICES, CATEGORIES } from "@/constants";
import type { Service, Category } from "@/types";
import { capitalize, findProvider, mapService } from "@/lib/service-mappers";

interface RawCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  iconName?: string | null;
  imageUrl?: string | null;
}

const mapCategory = (item: RawCategory): Category => ({
  id: item.id,
  name: capitalize(item.name),
  slug: item.slug,
  description: item.description || "",
  iconName: item.iconName ? item.iconName.toLowerCase() : "wrench",
  serviceCount: 0,
  imageUrl: item.imageUrl || null,
});

const fallbackServices = (): Service[] =>
  POPULAR_SERVICES.map((svc) => ({
    ...svc,
    provider: {
      ...svc.provider,
      location: findProvider(svc.providerId)?.location || "Dubai Marina, Dubai",
    },
  }));

/**
 * Loads categories and services for the services page.
 * Falls back to the bundled demo data when the API is empty or fails,
 * and cancels in-flight requests on unmount so no state is set afterwards.
 */
export function useServicesData() {
  const [services, setServices] = React.useState<Service[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const controllerRef = React.useRef<AbortController | null>(null);

  const loadData = React.useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const { signal } = controller;

    setIsLoading(true);
    setIsError(false);
    try {
      // Both requests are independent, so run them in parallel
      const [catRes, svcRes] = await Promise.all([
        api.get("/api/categories", { signal }),
        api.get("/api/services", { signal }),
      ]);

      const rawCats = catRes.data.data;
      let finalCats: Category[] =
        Array.isArray(rawCats) && rawCats.length > 0 ? rawCats.map(mapCategory) : CATEGORIES;

      const rawServices = svcRes.data.data;
      const finalServices: Service[] =
        Array.isArray(rawServices) && rawServices.length > 0
          ? rawServices.map(mapService)
          : fallbackServices();

      finalCats = finalCats.map((cat) => {
        const count = finalServices.filter((s) => s.category.slug === cat.slug).length;
        return { ...cat, serviceCount: count || cat.serviceCount };
      });

      if (signal.aborted) return;
      setCategories(finalCats);
      setServices(finalServices);
      setIsError(false);
    } catch (err) {
      if (signal.aborted) return;
      console.error("Failed to load services data:", err);
      setCategories(CATEGORIES);
      setServices(fallbackServices());
      if (POPULAR_SERVICES.length === 0) setIsError(true);
    } finally {
      if (!signal.aborted) setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // Defer the first load out of the effect body (keeps setState out of the synchronous effect)
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) loadData();
    });
    return () => {
      cancelled = true;
      controllerRef.current?.abort();
    };
  }, [loadData]);

  return { services, categories, isLoading, isError, reload: loadData };
}
