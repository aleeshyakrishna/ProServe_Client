"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Briefcase,
  Clock,
  BadgeCheck,
  MapPin,
  ChevronRight,
  Sparkles,
  Wrench,
  Zap,
  Wind,
  Paintbrush,
  Hammer,
  Heart,
  Leaf,
  Scissors,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/common/rating";
import { FEATURED_PROVIDERS, CATEGORIES } from "@/constants";
import type { Category, Provider } from "@/types";
import api from "@/lib/axios";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EmptyState, ErrorState } from "@/components/common/empty-state";
import { buttonVariants } from "@/components/ui/button";

// ------ Seeded database fallback profiles -------------------

const SEEDED_PROVIDERS: Record<string, Provider> = {
  prov_1: {
    id: "prov_1",
    userId: "user_prov_1",
    businessName: "Plumbing Expert Services",
    tagline: "Your local master plumber for residential repairs",
    bio: "Over 8 years of plumbing expertise serving Dubai and Sharjah. Specializing in leak detection, bathroom fixtures, and emergency repairs. We pride ourselves on clean, efficient work and upfront pricing.",
    avatarUrl: null,
    rating: 4.8,
    reviewCount: 12,
    completedJobs: 145,
    responseTime: "< 45 mins",
    isVerified: true,
    isFeatured: true,
    categories: [
      { id: "cat-2", name: "Plumbing", slug: "plumbing", description: "", iconName: "wrench", serviceCount: 0, imageUrl: null }
    ],
    location: "Al Barsha, Dubai",
    joinedAt: "2023-05-10T00:00:00Z"
  },
  prov_2: {
    id: "prov_2",
    userId: "user_prov_2",
    businessName: "Electrical Master UAE",
    tagline: "Certified electricians for home and office installation",
    bio: "DEWA-approved master electrician. Specializing in ceiling fan installations, safety audits, panel board changes, and smart home wiring. We guarantee fast response times and 100% compliant work.",
    avatarUrl: null,
    rating: 4.9,
    reviewCount: 15,
    completedJobs: 218,
    responseTime: "< 30 mins",
    isVerified: true,
    isFeatured: true,
    categories: [
      { id: "cat-3", name: "Electrical", slug: "electrical", description: "", iconName: "zap", serviceCount: 0, imageUrl: null }
    ],
    location: "Jumeirah, Dubai",
    joinedAt: "2022-11-20T00:00:00Z"
  }
};

const LOCATIONS = [
  { value: "all", label: "All Cities / Areas" },
  { value: "dubai marina", label: "Dubai Marina" },
  { value: "business bay", label: "Business Bay" },
  { value: "jumeirah", label: "Jumeirah" },
  { value: "downtown dubai", label: "Downtown Dubai" },
  { value: "al barsha", label: "Al Barsha" }
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

function CategoryIcon({ name, className, size = 16 }: { name: string; className?: string; size?: number }) {
  const Icon = ICON_MAP[name.toLowerCase()] ?? Wrench;
  return <Icon size={size} className={className} />;
}

// ------ Shimmer Skeleton Card ------------------------------

function ProviderCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-2xl bg-[var(--bg-secondary)] shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-[var(--bg-secondary)] rounded w-3/4" />
          <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/2" />
        </div>
      </div>
      <div className="h-12 bg-[var(--bg-secondary)] rounded-xl" />
      <div className="flex gap-2">
        <div className="h-6 bg-[var(--bg-secondary)] rounded w-1/4" />
        <div className="h-6 bg-[var(--bg-secondary)] rounded w-1/4" />
      </div>
      <div className="h-10 bg-[var(--bg-secondary)] rounded-xl" />
    </div>
  );
}

// ------ Main Component -------------------------------------

export default function ProvidersListPage() {
  // Data State
  const [providers, setProviders] = React.useState<Provider[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);

  // Filter & Search Interaction State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedLocation, setSelectedLocation] = React.useState("all");
  const [minRating, setMinRating] = React.useState<number>(0);
  const [sortBy, setSortBy] = React.useState("rating");

  // Fetch Categories & Providers
  const loadData = React.useCallback(async (active: boolean) => {
    try {
      // 1. Fetch categories
      const catRes = await api.get("/api/categories");
      const rawCats = catRes.data.data;
      let finalCats: Category[] = [];

      if (Array.isArray(rawCats) && rawCats.length > 0) {
        finalCats = rawCats.map((item: { id: string; name: string; slug: string; description?: string; iconName?: string; imageUrl?: string }) => ({
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

      // 2. Fetch all services to inspect dynamically registered providers
      const svcRes = await api.get("/api/services");
      const rawServices = svcRes.data.data;
      const discoveredProviders: Record<string, Provider> = {};

      if (Array.isArray(rawServices) && rawServices.length > 0) {
        rawServices.forEach((item: { providerId: string; provider: { businessName: string; rating?: number; reviewCount?: number; isVerified?: boolean }; category: string }) => {
          const pid = item.providerId;
          if (!discoveredProviders[pid]) {
            // Check if seeded metadata is available
            const seeded = SEEDED_PROVIDERS[pid] || FEATURED_PROVIDERS.find(p => p.id === pid);
            discoveredProviders[pid] = {
              id: pid,
              userId: pid,
              businessName: seeded?.businessName || item.provider.businessName || "ProTech Provider",
              tagline: seeded?.tagline || "Verified ProServe Professional",
              bio: seeded?.bio || "This service provider has registered with ProServe to offer high-quality services in the UAE.",
              avatarUrl: null,
              rating: seeded?.rating || item.provider.rating || 4.8,
              reviewCount: seeded?.reviewCount || item.provider.reviewCount || 1,
              completedJobs: seeded?.completedJobs || 12,
              responseTime: seeded?.responseTime || "< 45 mins",
              isVerified: seeded?.isVerified || item.provider.isVerified || false,
              isFeatured: seeded?.isFeatured || false,
              categories: seeded?.categories || [
                finalCats.find(c => c.slug === item.category.toLowerCase()) || 
                { id: item.category.toLowerCase(), name: item.category.charAt(0) + item.category.slice(1).toLowerCase(), slug: item.category.toLowerCase(), description: "", iconName: "wrench", serviceCount: 0, imageUrl: null }
              ],
              location: seeded?.location || "Dubai, UAE",
              joinedAt: seeded?.joinedAt || new Date().toISOString()
            };
          }
        });
      }

      // 3. Build unified provider list
      const providerMap = { ...discoveredProviders };
      
      // Seed featured providers if not already discovered
      FEATURED_PROVIDERS.forEach(prov => {
        if (!providerMap[prov.id]) {
          providerMap[prov.id] = prov;
        }
      });

      // Seed database seeded fallback profiles if not already discovered
      Object.values(SEEDED_PROVIDERS).forEach(prov => {
        if (!providerMap[prov.id]) {
          providerMap[prov.id] = prov;
        }
      });

      const finalProvidersList = Object.values(providerMap);

      if (active) {
        setCategories(finalCats);
        setProviders(finalProvidersList);
        setIsError(false);
      }
    } catch (err) {
      console.error("Failed to load providers list:", err);
      if (active) {
        setCategories(CATEGORIES);
        setProviders(FEATURED_PROVIDERS);
        // We only set error if we couldn't load static mock fallbacks either
        if (FEATURED_PROVIDERS.length === 0) {
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

    // Load data asynchronously to avoid synchronous updates inside React render loop
    Promise.resolve().then(() => {
      if (active) {
        loadData(active);
      }
    });

    return () => {
      active = false;
    };
  }, [loadData]);

  // Filters & Search & Sort logic
  const filteredProviders = React.useMemo(() => {
    let result = [...providers];

    // Filter by name search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (prov) =>
          prov.businessName.toLowerCase().includes(query) ||
          prov.tagline.toLowerCase().includes(query) ||
          prov.bio.toLowerCase().includes(query)
      );
    }

    // Filter by Category
    if (selectedCategory !== "all") {
      result = result.filter((prov) =>
        prov.categories.some((c) => c.slug === selectedCategory)
      );
    }

    // Filter by Location
    if (selectedLocation !== "all") {
      const queryLoc = selectedLocation.toLowerCase();
      result = result.filter((prov) =>
        prov.location.toLowerCase().includes(queryLoc)
      );
    }

    // Filter by Minimum Rating
    if (minRating > 0) {
      result = result.filter((prov) => prov.rating >= minRating);
    }

    // Sorting
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "experience") {
      result.sort((a, b) => b.completedJobs - a.completedJobs);
    } else if (sortBy === "alpha") {
      result.sort((a, b) => a.businessName.localeCompare(b.businessName));
    } else if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
    }

    return result;
  }, [providers, searchQuery, selectedCategory, selectedLocation, minRating, sortBy]);

  return (
    <>
      <Navbar />

      <main id="main-content" className="flex-grow pt-16 lg:pt-18 bg-[var(--bg-primary)]">
        {/* ==========================================
            1. HERO SECTION
            ========================================== */}
        <section
          className="relative py-16 lg:py-24 overflow-hidden gradient-hero text-center"
          aria-labelledby="hero-title"
        >
          <div className="container-section flex flex-col items-center max-w-4xl relative z-10 gap-6">
            <Badge variant="secondary" className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 select-none">
              Background-Checked & Insured
            </Badge>

            <h1
              id="hero-title"
              className="text-display font-extrabold text-[var(--text-primary)] tracking-tight leading-none text-balance"
            >
              Verified Service Providers, <br />
              <span className="text-emerald-600">At Your Service.</span>
            </h1>

            <p className="text-[var(--text-secondary)] text-base lg:text-lg max-w-2xl text-balance">
              Connect with top-rated cleaners, electricians, plumbers, and home specialists in Dubai, Abu Dhabi, and Sharjah.
            </p>

            {/* Main Search Bar */}
            <div className="w-full max-w-xl relative mt-4">
              <label htmlFor="search-providers-input" className="sr-only">
                Search providers by name or bio keyword
              </label>
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--text-tertiary)]">
                <Search size={20} />
              </div>
              <input
                id="search-providers-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by provider name or keyword..."
                className={cn(
                  "w-full h-14 pl-12 pr-4 rounded-2xl bg-white shadow-md border border-[var(--border-subtle)]",
                  "text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)]",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                  "transition-all duration-200"
                )}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 inset-y-0 text-xs font-semibold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ==========================================
            2. PROVIDERS LISTINGS GRID & FILTERS
            ========================================== */}
        <section className="section-padding bg-white" aria-label="Providers directory listings">
          <div className="container-section">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Sidebar Filters */}
              <aside className="w-full lg:w-64 lg:min-w-[256px] lg:max-w-[256px] shrink-0 flex flex-col gap-6" aria-label="Filters">
                
                {/* Active filters check block */}
                {(selectedCategory !== "all" || selectedLocation !== "all" || minRating > 0 || searchQuery) && (
                  <div className="p-4 rounded-xl bg-navy-50/50 border border-navy-100 flex items-center justify-between">
                    <span className="text-xs text-navy-800 font-medium">Active filters</span>
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedLocation("all");
                        setMinRating(0);
                        setSearchQuery("");
                      }}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                )}

                {/* Categories filter Card */}
                <div className="rounded-2xl border border-[var(--border-subtle)] p-5 space-y-4">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <SlidersHorizontal size={16} />
                    Category
                  </h3>
                  <div className="flex flex-col gap-1.5" role="tablist">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer",
                        selectedCategory === "all"
                          ? "bg-navy-900 text-white font-semibold"
                          : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                      )}
                      role="tab"
                      aria-selected={selectedCategory === "all"}
                    >
                      <span>All Specialties</span>
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full", selectedCategory === "all" ? "bg-navy-800 text-white" : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]")}>
                        {providers.length}
                      </span>
                    </button>

                    {categories.map((cat) => {
                      const count = providers.filter((p) => p.categories.some((c) => c.slug === cat.slug)).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.slug)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer",
                            selectedCategory === cat.slug
                              ? "bg-navy-900 text-white font-semibold"
                              : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                          )}
                          role="tab"
                          aria-selected={selectedCategory === cat.slug}
                        >
                          <div className="flex items-center gap-2">
                            <CategoryIcon name={cat.iconName} size={14} className={selectedCategory === cat.slug ? "text-emerald-400" : "text-[var(--text-tertiary)]"} />
                            <span>{cat.name}</span>
                          </div>
                          <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full", selectedCategory === cat.slug ? "bg-navy-800 text-white" : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]")}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Location Filter Card */}
                <div className="rounded-2xl border border-[var(--border-subtle)] p-5 space-y-4">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">Location</h3>
                  <div className="relative">
                    <label htmlFor="location-select" className="sr-only">
                      Filter providers by location
                    </label>
                    <select
                      id="location-select"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full bg-white border border-[var(--border-subtle)] rounded-xl px-3 h-10 text-xs font-semibold text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      {LOCATIONS.map((loc) => (
                        <option key={loc.value} value={loc.value}>
                          {loc.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rating Filter Card */}
                <div className="rounded-2xl border border-[var(--border-subtle)] p-5 space-y-4">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">Minimum Rating</h3>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: 0, label: "Any Rating" },
                      { value: 4.8, label: "4.8 ★ & above" },
                      { value: 4.9, label: "4.9 ★ & above" }
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)] cursor-pointer">
                        <input
                          type="radio"
                          name="minRating"
                          value={opt.value}
                          checked={minRating === opt.value}
                          onChange={() => setMinRating(opt.value)}
                          className="h-4 w-4 border-[var(--border-default)] text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main Panel Listings */}
              <div className="flex-1 min-w-0 flex flex-col gap-6">
                
                {/* Result header count & Sorting */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">
                      Available Professionals
                    </h2>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Found {filteredProviders.length} {filteredProviders.length === 1 ? "provider" : "providers"} matching search criteria
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor="sorting-select" className="sr-only">
                      Sort providers list
                    </label>
                    <select
                      id="sorting-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="rating">Highest Rated</option>
                      <option value="experience">Most Experienced</option>
                      <option value="alpha">Alphabetical (A-Z)</option>
                      <option value="recent">Recently Added</option>
                    </select>
                  </div>
                </div>

                {/* Listing grid states */}
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <ProviderCardSkeleton key={i} />
                    ))}
                  </div>
                ) : isError ? (
                  <ErrorState
                    title="Could not load providers"
                    description="Our server encountered an issue loading registered service providers. Please retry."
                    onRetry={() => {
                      setIsLoading(true);
                      loadData(true);
                    }}
                  />
                ) : filteredProviders.length === 0 ? (
                  <EmptyState
                    title="No matching providers found"
                    description="We couldn't find any professionals matching your search queries or active filters."
                    action={{
                      label: "Reset All Filters",
                      onClick: () => {
                        setSelectedCategory("all");
                        setSelectedLocation("all");
                        setMinRating(0);
                        setSearchQuery("");
                      },
                    }}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {filteredProviders.map((prov) => (
                      <article
                        key={prov.id}
                        className={cn(
                          "group flex flex-col",
                          "rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)]",
                          "p-6 gap-5",
                          "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                          "hover:shadow-xl hover:-translate-y-1 hover:border-emerald-100"
                        )}
                      >
                        {/* Header: Avatar + Business Name */}
                        <div className="flex items-start gap-4">
                          <div className="relative shrink-0 select-none">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center text-white text-xl font-bold shadow-md">
                              {prov.businessName[0]}
                            </div>
                            {prov.isVerified && (
                              <div
                                className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-sm"
                                title="Verified Professional"
                              >
                                <BadgeCheck size={12} className="text-white" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <Link
                                  href={`/providers/${prov.id}`}
                                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                                >
                                  <h3 className="font-bold text-[var(--text-primary)] leading-tight hover:text-emerald-600 transition-colors truncate">
                                    {prov.businessName}
                                  </h3>
                                </Link>
                                <p className="text-xs text-[var(--text-tertiary)] mt-0.5 truncate">
                                  {prov.tagline}
                                </p>
                              </div>
                              {prov.isFeatured && (
                                <Badge variant="accent" className="shrink-0 select-none font-semibold">
                                  Featured
                                </Badge>
                              )}
                            </div>

                            <div className="mt-2">
                              <Rating value={prov.rating} showValue reviewCount={prov.reviewCount} size="sm" />
                            </div>
                          </div>
                        </div>

                        {/* Bio paragraph description */}
                        <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed h-8">
                          {prov.bio}
                        </p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                            <Briefcase size={13} className="text-navy-600 shrink-0" />
                            <div>
                              <p className="font-extrabold text-navy-950 leading-none">{prov.completedJobs}+</p>
                              <p className="text-[9px] text-[var(--text-tertiary)] mt-0.5 font-semibold">Jobs Done</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                            <Clock size={13} className="text-emerald-600 shrink-0" />
                            <div>
                              <p className="font-extrabold text-navy-950 leading-none">{prov.responseTime}</p>
                              <p className="text-[9px] text-[var(--text-tertiary)] mt-0.5 font-semibold">Response</p>
                            </div>
                          </div>
                        </div>

                        {/* Location and Category badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-3.5 mt-auto">
                          <span className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)] font-bold">
                            <MapPin size={12} className="text-[var(--text-secondary)] shrink-0" />
                            {prov.location.split(",")[0]}
                          </span>

                          <div className="flex flex-wrap gap-1">
                            {prov.categories.map((c) => (
                              <Badge key={c.id} variant="emerald" className="text-[9px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none select-none">
                                {c.name}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* View profile CTA */}
                        <Link
                          href={`/providers/${prov.id}`}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "md" }),
                            "w-full font-bold text-xs"
                          )}
                        >
                          View Profile
                          <ChevronRight size={14} className="ml-1" />
                        </Link>
                      </article>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
