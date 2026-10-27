"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Service } from "@/types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ALL, filterServices, getAvailableLocations } from "@/lib/service-filters";

const SEARCH_DEBOUNCE_MS = 300;

const readQuery = (params: URLSearchParams) => params.get("search") || params.get("query") || "";

/**
 * Search, category, location and sort state for the services page.
 *
 * - The URL is the source of truth, so filtered results are shareable and
 *   survive refresh / back navigation.
 * - Category and location update the URL immediately.
 * - Search updates the URL only after the user stops typing, to avoid a
 *   router request (and _rsc fetch) on every keystroke.
 */
export function useServiceFilters(services: Service[]) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = React.useState(() => readQuery(searchParams));
  const [selectedCategory, setSelectedCategory] = React.useState<string>(
    () => searchParams.get("category") || ALL
  );
  const [selectedLocation, setSelectedLocation] = React.useState<string>(
    () => searchParams.get("location") || ALL
  );
  const [sortBy, setSortBy] = React.useState<string>("popular");

  const debouncedQuery = useDebouncedValue(searchQuery, SEARCH_DEBOUNCE_MS);

  // Keep state in sync when the URL changes from outside (links, back button).
  // Adjusting state during render (instead of in an effect) avoids an extra render pass.
  const [prevSearchParams, setPrevSearchParams] = React.useState(searchParams);
  if (searchParams !== prevSearchParams) {
    setPrevSearchParams(searchParams);
    // Only copy the search text when the change came from outside. If the URL just
    // matches what we wrote (or what is already typed), keep the input as is, so
    // letters typed during the round trip and trailing spaces are not lost.
    const urlQuery = readQuery(searchParams).trim();
    const isOwnWrite = urlQuery === debouncedQuery.trim() || urlQuery === searchQuery.trim();
    if (!isOwnWrite) setSearchQuery(urlQuery);
    setSelectedCategory(searchParams.get("category") || ALL);
    setSelectedLocation(searchParams.get("location") || ALL);
  }

  const updateUrlParams = React.useCallback(
    (query: string, category: string, location: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set("search", query.trim());
      } else {
        params.delete("search");
        params.delete("query");
      }
      if (category && category !== ALL) params.set("category", category);
      else params.delete("category");
      if (location && location !== ALL) params.set("location", location);
      else params.delete("location");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // Push the search text to the URL once typing has settled
  React.useEffect(() => {
    // Still typing (or the URL just changed externally): wait for the debounce to catch up
    if (debouncedQuery !== searchQuery) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery.trim() === readQuery(params).trim()) return;

    if (debouncedQuery.trim()) {
      params.set("search", debouncedQuery.trim());
    } else {
      params.delete("search");
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, searchQuery, searchParams, pathname, router]);

  const handleQueryChange = (value: string) => setSearchQuery(value);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateUrlParams(searchQuery, category, selectedLocation);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    updateUrlParams(searchQuery, selectedCategory, location);
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory(ALL);
    setSelectedLocation(ALL);
    updateUrlParams("", ALL, ALL);
  };

  const filteredServices = React.useMemo(
    () =>
      filterServices(services, {
        query: searchQuery,
        category: selectedCategory,
        location: selectedLocation,
        sortBy,
      }),
    [services, searchQuery, selectedCategory, selectedLocation, sortBy]
  );

  const availableLocations = React.useMemo(() => getAvailableLocations(services), [services]);

  return {
    searchQuery,
    selectedCategory,
    selectedLocation,
    sortBy,
    setSortBy,
    handleQueryChange,
    handleCategoryChange,
    handleLocationChange,
    handleClearAllFilters,
    filteredServices,
    availableLocations,
  };
}
