"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Search,
  Wrench,
  Sparkles,
  Zap,
  Wind,
  Paintbrush,
  Hammer,
  Heart,
  Leaf,
  Scissors,
  FileText,
  Clock,
  ShieldCheck,
  SlidersHorizontal,
  MapPin,
  ThumbsUp,
  Lock,
  UserCheck,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/common/rating";
import { POPULAR_SERVICES, CATEGORIES, FEATURED_PROVIDERS } from "@/constants";
import type { Service, Category } from "@/types";
import api from "@/lib/axios";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EmptyState, ErrorState } from "@/components/common/empty-state";
import { FAQSection } from "@/components/common/FAQSection";

// ------ Location List ----------------------------------------

const LOCATIONS = [
  { value: "all", label: "All Cities / Areas" },
  { value: "Dubai", label: "Dubai" },
  { value: "Abu Dhabi", label: "Abu Dhabi" },
  { value: "Sharjah", label: "Sharjah" },
  { value: "Dubai Marina", label: "Dubai Marina" },
  { value: "Business Bay", label: "Business Bay" },
  { value: "Jumeirah", label: "Jumeirah" },
  { value: "Al Barsha", label: "Al Barsha" },
];

// ------ Icon Map -------------------------------------------

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  sparkles: Sparkles,
  wrench: Wrench,
  zap: Zap,
  wind: Wind,
  paintbrush: Paintbrush,
  hammer: Hammer,
  heart: Heart,
  leaf: Leaf,
  scissors: Scissors,
  filetext: FileText,
};

function CategoryIcon({ name, className, size = 20 }: { name: string; className?: string; size?: number }) {
  const Icon = ICON_MAP[name.toLowerCase()] ?? Wrench;
  return <Icon size={size} className={className} />;
}

// ------ FAQ Interface --------------------------------------

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How do I book a service?",
    answer: "Browse our list of available services, select the one you need, and click 'Book Now'. You'll be prompted to select a date, time, and address. Once confirmed, a verified professional will be matched with your job.",
  },
  {
    question: "Are your service providers verified?",
    answer: "Yes, every professional on ProServe undergoes a strict background check, license verification (where applicable), and face-to-face onboarding. We also continuously monitor performance through ratings and reviews.",
  },
  {
    question: "What if I need to cancel my booking?",
    answer: "You can cancel or reschedule your booking free of charge up to 24 hours before the scheduled time. Cancellations within 24 hours may incur a small fee to compensate the provider.",
  },
  {
    question: "How and when do I pay?",
    answer: "You pay securely through the platform using credit or debit cards after the booking is completed. We hold the payment securely and release it to the service provider only after your job is completed successfully.",
  },
];

// ------ Shimmer Skeleton Card ------------------------------

function ServiceCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] overflow-hidden h-[420px]">
      <div className="h-48 w-full skeleton shrink-0" />
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div className="space-y-2">
          <div className="h-5 w-3/4 skeleton rounded" />
          <div className="h-4 w-full skeleton rounded" />
          <div className="h-4 w-5/6 skeleton rounded" />
        </div>
        <div className="h-4 w-1/3 skeleton rounded" />
        <div className="border-t border-[var(--border-subtle)] pt-4 mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full skeleton shrink-0" />
            <div className="space-y-1">
              <div className="h-3 w-16 skeleton rounded" />
              <div className="h-2 w-10 skeleton rounded" />
            </div>
          </div>
          <div className="h-5 w-16 skeleton rounded" />
        </div>
      </div>
    </div>
  );
}

interface RawCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  iconName?: string | null;
  imageUrl?: string | null;
}

interface RawService {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  providerId: string;
  isAvailable: boolean;
}

// ------ Inner Content Component (Consumes useSearchParams) --

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Data State
  const [services, setServices] = React.useState<Service[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);

  // Read initial interaction states from URL parameters
  const initialQuery = searchParams.get("search") || searchParams.get("query") || "";
  const initialCat = searchParams.get("category") || "all";
  const initialLoc = searchParams.get("location") || "all";

  const [searchQuery, setSearchQuery] = React.useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = React.useState<string>(initialCat);
  const [selectedLocation, setSelectedLocation] = React.useState<string>(initialLoc);
  const [sortBy, setSortBy] = React.useState<string>("popular");

  // Keep state synced when searchParams change from external router pushes
  React.useEffect(() => {
    const urlQuery = searchParams.get("search") || searchParams.get("query") || "";
    const urlCat = searchParams.get("category") || "all";
    const urlLoc = searchParams.get("location") || "all";
    setSearchQuery(urlQuery);
    setSelectedCategory(urlCat);
    setSelectedLocation(urlLoc);
  }, [searchParams]);

  // Update URL search parameters
  const updateUrlParams = (newQuery: string, newCat: string, newLoc: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newQuery.trim()) {
      params.set("search", newQuery.trim());
    } else {
      params.delete("search");
      params.delete("query");
    }
    if (newCat && newCat !== "all") {
      params.set("category", newCat);
    } else {
      params.delete("category");
    }
    if (newLoc && newLoc !== "all") {
      params.set("location", newLoc);
    } else {
      params.delete("location");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Debounced URL synchronization for search input typing to avoid _rsc request spam
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const currentUrlQuery = params.get("search") || params.get("query") || "";
      if (searchQuery.trim() !== currentUrlQuery.trim()) {
        if (searchQuery.trim()) {
          params.set("search", searchQuery.trim());
        } else {
          params.delete("search");
          params.delete("query");
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchParams, pathname, router]);

  const handleQueryChange = (val: string) => {
    setSearchQuery(val);
  };

  const handleCategoryChange = (catSlug: string) => {
    setSelectedCategory(catSlug);
    updateUrlParams(searchQuery, catSlug, selectedLocation);
  };

  const handleLocationChange = (loc: string) => {
    setSelectedLocation(loc);
    updateUrlParams(searchQuery, selectedCategory, loc);
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLocation("all");
    updateUrlParams("", "all", "all");
  };

  // Fetch Services & Categories
  const loadData = React.useCallback(async (active = true) => {
    setIsLoading(true);
    setIsError(false);
    try {
      // 1. Fetch categories
      const catRes = await api.get("/api/categories");
      const rawCats = catRes.data.data;
      let finalCats: Category[] = [];

      if (Array.isArray(rawCats) && rawCats.length > 0) {
        finalCats = rawCats.map((item: RawCategory) => ({
          id: item.id,
          name: item.name.charAt(0) + item.name.slice(1).toLowerCase(),
          slug: item.slug,
          description: item.description || "",
          iconName: item.iconName ? item.iconName.toLowerCase() : "wrench",
          serviceCount: 0,
          imageUrl: item.imageUrl || null,
        }));
      } else {
        finalCats = CATEGORIES;
      }

      // 2. Fetch services
      const svcRes = await api.get("/api/services");
      const rawServices = svcRes.data.data;
      let finalServices: Service[] = [];

      if (Array.isArray(rawServices) && rawServices.length > 0) {
        finalServices = rawServices.map((item: RawService) => {
          const matchedProv = FEATURED_PROVIDERS.find((p) => p.id === item.providerId);
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
            },
            categoryId: item.category.toLowerCase(),
            category: {
              id: item.category.toLowerCase(),
              name: item.category.charAt(0) + item.category.slice(1).toLowerCase(),
              slug: item.category.toLowerCase(),
            },
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
        });
      } else {
        finalServices = POPULAR_SERVICES.map((svc) => {
          const matchedProv = FEATURED_PROVIDERS.find((p) => p.id === svc.providerId);
          return {
            ...svc,
            provider: {
              ...svc.provider,
              location: matchedProv?.location || "Dubai Marina, Dubai",
            },
          };
        });
      }

      // 3. Map dynamic service counts to categories
      finalCats = finalCats.map((cat) => {
        const count = finalServices.filter((s) => s.category.slug === cat.slug).length;
        return { ...cat, serviceCount: count || cat.serviceCount };
      });

      if (active) {
        setCategories(finalCats);
        setServices(finalServices);
        setIsError(false);
      }
    } catch (err) {
      console.error("Failed to load services data:", err);
      if (active) {
        setCategories(CATEGORIES);
        setServices(
          POPULAR_SERVICES.map((svc) => {
            const matchedProv = FEATURED_PROVIDERS.find((p) => p.id === svc.providerId);
            return {
              ...svc,
              provider: {
                ...svc.provider,
                location: matchedProv?.location || "Dubai Marina, Dubai",
              },
            };
          })
        );
        if (POPULAR_SERVICES.length === 0) {
          setIsError(true);
        }
      }
    } finally {
      if (active) {
        setIsLoading(false);
      }
    }
  }, []);

  React.useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        loadData(active);
      }
    });
    return () => {
      active = false;
    };
  }, [loadData]);

  // Filter & Sort Logic
  const filteredServices = React.useMemo(() => {
    let result = [...services];

    // Filter by Category Tab
    if (selectedCategory !== "all") {
      result = result.filter(
        (service) =>
          service.category.slug.toLowerCase() === selectedCategory.toLowerCase() ||
          service.categoryId.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Location
    if (selectedLocation !== "all") {
      const loc = selectedLocation.toLowerCase();
      result = result.filter((service) => {
        const titleMatch = service.title.toLowerCase().includes(loc);
        const descMatch = service.description.toLowerCase().includes(loc);
        const busMatch = service.provider?.businessName?.toLowerCase().includes(loc);
        const providerLocMatch = (service.provider as { location?: string }).location
          ? (service.provider as { location?: string }).location!.toLowerCase().includes(loc)
          : false;
        return titleMatch || descMatch || busMatch || providerLocMatch;
      });
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.category.name.toLowerCase().includes(query) ||
          service.category.slug.toLowerCase().includes(query)
      );
    }

    // Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.priceFrom - b.priceFrom);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.priceFrom - a.priceFrom);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [services, selectedCategory, selectedLocation, searchQuery, sortBy]);

  // Dynamically compute available locations list from fetched services data
  const availableLocations = React.useMemo(() => {
    const locSet = new Set<string>();
    services.forEach((s) => {
      const loc = (s.provider as { location?: string }).location;
      if (loc) {
        const parts = loc.split(",").map((p) => p.trim());
        parts.forEach((p) => {
          if (p && p.toUpperCase() !== "UAE") locSet.add(p);
        });
      }
    });

    const defaults = ["Dubai", "Abu Dhabi", "Sharjah", "Dubai Marina", "Business Bay", "Jumeirah", "Al Barsha"];
    defaults.forEach((d) => locSet.add(d));

    const list = Array.from(locSet).map((loc) => ({
      value: loc,
      label: loc,
    }));
    return [{ value: "all", label: "All Cities / Areas" }, ...list];
  }, [services]);

  return (
    <>
      <Navbar />

      <main id="main-content" className="flex-1 pt-16 lg:pt-18 bg-[var(--bg-primary)]">
        {/* Clean Compact Top Search Bar */}
        <div className="!pt-24 pb-6 bg-white border-b border-[var(--border-subtle)]">
          <div className="container-section max-w-4xl space-y-4">
            <div className="w-full relative">
              <label htmlFor="search-services-input" className="sr-only">
                Search for any service
              </label>
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--text-tertiary)]">
                <Search size={20} />
              </div>
              <input
                id="search-services-input"
                type="text"
                value={searchQuery}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search home cleaning, AC repair, plumbing..."
                className={cn(
                  "w-full h-12 pl-12 pr-16 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]",
                  "text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)]",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                  "transition-all duration-200"
                )}
              />
              {searchQuery && (
                <button
                  onClick={() => handleQueryChange("")}
                  className="absolute right-4 inset-y-0 text-xs font-semibold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Popular Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[var(--text-tertiary)] font-semibold">Popular:</span>
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={cn(
                    "px-3 py-1 rounded-full border text-xs font-medium transition-all cursor-pointer",
                    selectedCategory === cat.slug
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold"
                      : "bg-white border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-navy-200"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ==========================================
            SERVICES FILTER & LISTING SECTION
            ========================================== */}
        <section className="section-padding bg-white" aria-label="Services listing">
          <div className="container-section">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="w-full lg:w-64 lg:min-w-[256px] lg:max-w-[256px] shrink-0 flex flex-col gap-6" aria-label="Filters">
                {/* Active filters tag indicator if active */}
                {(selectedCategory !== "all" || selectedLocation !== "all" || searchQuery) && (
                  <div className="p-4 rounded-xl bg-navy-50/50 border border-navy-100 flex items-center justify-between">
                    <span className="text-xs text-navy-800 font-medium">Active filters</span>
                    <button
                      onClick={handleClearAllFilters}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                )}

                {/* Categories Accordion Card */}
                <div className="rounded-2xl border border-[var(--border-subtle)] p-5 space-y-4">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <SlidersHorizontal size={16} />
                    Categories
                  </h3>
                  <div className="flex flex-col gap-1.5" role="tablist">
                    <button
                      onClick={() => handleCategoryChange("all")}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer",
                        selectedCategory === "all"
                          ? "bg-navy-900 text-white font-semibold"
                          : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                      )}
                      role="tab"
                      aria-selected={selectedCategory === "all"}
                    >
                      <span>All Services</span>
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full", selectedCategory === "all" ? "bg-navy-800 text-white" : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]")}>
                        {services.length}
                      </span>
                    </button>

                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer",
                          selectedCategory === cat.slug
                            ? "bg-navy-900 text-white font-semibold"
                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                        )}
                        role="tab"
                        aria-selected={selectedCategory === cat.slug}
                      >
                        <div className="flex items-center gap-2">
                          <CategoryIcon name={cat.iconName} size={14} className={selectedCategory === cat.slug ? "text-emerald-400" : "text-[var(--text-tertiary)]"} />
                          <span>{cat.name}</span>
                        </div>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full", selectedCategory === cat.slug ? "bg-navy-800 text-white" : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]")}>
                          {cat.serviceCount}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Filter Card */}
                <div className="rounded-2xl border border-[var(--border-subtle)] p-5 space-y-4">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <MapPin size={16} className="text-emerald-600" />
                    Location
                  </h3>
                  <div className="relative">
                    <label htmlFor="services-location-select" className="sr-only">
                      Filter services by location
                    </label>
                    <select
                      id="services-location-select"
                      value={selectedLocation}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      className="w-full bg-white border border-[var(--border-subtle)] rounded-xl px-3 h-10 text-xs font-semibold text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      {availableLocations.map((loc) => (
                        <option key={loc.value} value={loc.value}>
                          {loc.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sort Panel */}
                <div className="rounded-2xl border border-[var(--border-subtle)] p-5 space-y-4">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">Sort By</h3>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: "popular", label: "Recommended" },
                      { value: "price_asc", label: "Price: Low to High" },
                      { value: "price_desc", label: "Price: High to Low" },
                      { value: "rating", label: "Highest Rated" },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)] cursor-pointer">
                        <input
                          type="radio"
                          name="sortBy"
                          value={opt.value}
                          checked={sortBy === opt.value}
                          onChange={() => setSortBy(opt.value)}
                          className="h-4 w-4 border-[var(--border-default)] text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main Services Listings Panel */}
              <div className="flex-1 min-w-0 flex flex-col gap-6">
                {/* Result header count */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">
                      {selectedCategory === "all" ? "All Offerings" : categories.find((c) => c.slug === selectedCategory)?.name}
                    </h2>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Showing {filteredServices.length} {filteredServices.length === 1 ? "service" : "services"} in the UAE
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor="mobile-sort-select" className="sr-only">
                      Sort services
                    </label>
                    <select
                      id="mobile-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="popular">Recommended</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>

                {/* Listing grid / states */}
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <ServiceCardSkeleton key={i} />
                    ))}
                  </div>
                ) : isError ? (
                  <ErrorState
                    title="Could not load services"
                    description="Our server encountered an issue fetching active services. Please try again."
                    onRetry={loadData}
                  />
                ) : filteredServices.length === 0 ? (
                  <EmptyState
                    title="No matching services found"
                    description="We couldn't find any services matching your search or active filters. Try adjusting your query."
                    action={{
                      label: "Reset All Filters",
                      onClick: handleClearAllFilters,
                    }}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {filteredServices.map((service) => {
                      const priceDisplay =
                        service.pricingType === "quoted"
                          ? "Custom Quote"
                          : service.priceTo
                            ? `${formatCurrency(service.priceFrom)} – ${formatCurrency(service.priceTo)}`
                            : `From ${formatCurrency(service.priceFrom)}`;

                      return (
                        <article
                          key={service.id}
                          className={cn(
                            "group flex flex-col",
                            "rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)]",
                            "overflow-hidden",
                            "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                            "hover:shadow-xl hover:-translate-y-1 hover:border-emerald-100"
                          )}
                        >
                          {/* Top Visual Container */}
                          <div
                            className={cn(
                              "h-44 w-full relative overflow-hidden bg-gradient-to-br",
                              "from-navy-100 to-emerald-50",
                              "shrink-0"
                            )}
                            aria-hidden="true"
                          >
                            <div className="absolute top-3 left-3">
                              <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-navy-900 border-none font-semibold">
                                {service.category.name}
                              </Badge>
                            </div>

                            {service.isFeatured && (
                              <div className="absolute top-3 right-3">
                                <Badge variant="accent" className="font-semibold">Featured</Badge>
                              </div>
                            )}

                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-16 w-16 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110">
                                <span className="text-xl font-bold text-navy-800">
                                  {service.title[0]}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Content Container */}
                          <div className="flex flex-col flex-1 p-5 gap-3.5">
                            <div className="space-y-1">
                              <Link
                                href={`/services/${service.id}`}
                                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                              >
                                <h3
                                  className={cn(
                                    "font-bold text-[var(--text-primary)] text-base leading-snug truncate",
                                    "group-hover:text-emerald-600 transition-colors"
                                  )}
                                >
                                  {service.title}
                                </h3>
                              </Link>
                              <p className="text-xs text-[var(--text-tertiary)] line-clamp-2 leading-relaxed h-8">
                                {service.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] pt-1">
                              <Rating
                                value={service.rating}
                                showValue
                                reviewCount={service.reviewCount}
                                size="sm"
                              />

                              {service.duration && (
                                <span className="flex items-center gap-1 font-medium bg-[var(--bg-secondary)] px-2 py-1 rounded-md text-[10px]">
                                  <Clock size={11} aria-hidden="true" />
                                  {service.duration}
                                </span>
                              )}
                            </div>

                            <div className="border-t border-[var(--border-subtle)]" />

                            <div className="flex items-center justify-between gap-2 mt-auto">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="h-7 w-7 rounded-full bg-navy-900 flex items-center justify-center text-white shrink-0">
                                  <span className="text-[10px] font-bold">
                                    {service.provider.businessName[0]}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[11px] font-semibold text-[var(--text-primary)] truncate">
                                    {service.provider.businessName}
                                  </p>
                                  {service.provider.isVerified && (
                                    <div className="flex items-center gap-0.5">
                                      <ShieldCheck size={11} className="text-emerald-500" />
                                      <span className="text-[9px] text-emerald-600 font-medium">Verified</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <p className="text-sm font-extrabold text-navy-950">{priceDisplay}</p>
                                {service.pricingType !== "quoted" && (
                                  <p className="text-[9px] text-[var(--text-disabled)] font-medium">per job</p>
                                )}
                              </div>
                            </div>

                            <Link
                              href={`/booking?serviceId=${service.id}&providerId=${service.providerId}`}
                              className={cn(
                                "mt-1 flex items-center justify-center w-full h-10 rounded-xl font-bold text-xs transition-all duration-200",
                                "bg-navy-50 text-navy-900 border border-navy-100",
                                "group-hover:bg-navy-900 group-hover:text-white group-hover:border-navy-900",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700"
                              )}
                            >
                              Book Now
                            </Link>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="section-padding bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)]" aria-labelledby="why-choose-us-title">
          <div className="container-section text-center max-w-5xl space-y-12">
            <div className="space-y-3 max-w-xl mx-auto">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Our Guarantees</p>
              <h2 id="why-choose-us-title" className="text-[var(--text-primary)]">Why Book Services on ProServe?</h2>
              <p className="text-[var(--text-secondary)] text-sm">We provide the highest quality domestic and commercial service experience in the United Arab Emirates.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: UserCheck,
                  title: "100% Vetted Pros",
                  desc: "Every provider undergoes rigorous background screening, certification reviews, and identity verification before their listing is approved.",
                  color: "bg-emerald-50 text-emerald-600",
                },
                {
                  icon: ThumbsUp,
                  title: "Satisfaction Guarantee",
                  desc: "Your happiness is our priority. If you're not satisfied with the quality of execution, we'll send another professional to make it right.",
                  color: "bg-gold-50 text-gold-600",
                },
                {
                  icon: Lock,
                  title: "Secure Cashless Payments",
                  desc: "Your card is charged only after the service is fully completed and signed off. Enjoy zero hidden fees and clear upfront pricing.",
                  color: "bg-navy-50 text-navy-800",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex flex-col items-center p-6 bg-white rounded-2xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-shadow gap-4">
                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center", item.color)}>
                      <Icon size={26} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">{item.title}</h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <FAQSection
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about booking home services with ProServe."
          categoryLabel="Help Desk"
          items={FAQS}
          bgClassName="bg-white"
        />
      </main>

      <Footer />
    </>
  );
}

export default function ServicesPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-xs">Loading services directory...</div>}>
      <ServicesContent />
    </React.Suspense>
  );
}
