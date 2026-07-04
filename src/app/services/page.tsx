"use client";

import * as React from "react";
import Link from "next/link";
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
  ThumbsUp,
  Lock,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/common/rating";
import { formatCurrency } from "@/lib/utils";
import { POPULAR_SERVICES, CATEGORIES } from "@/constants";
import type { Service, Category } from "@/types";
import api from "@/lib/axios";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EmptyState, ErrorState } from "@/components/common/empty-state";
import { FAQSection } from "@/components/common/FAQSection";

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

// ------ Main Component -------------------------------------

export default function ServicesPage() {
  // Data State
  const [services, setServices] = React.useState<Service[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);

  // Interaction State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<string>("popular");

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
        finalServices = rawServices.map((item: RawService) => ({
          id: item.id,
          providerId: item.providerId,
          provider: {
            id: item.providerId,
            businessName: "ProTech UAE Provider",
            avatarUrl: null,
            rating: 4.9,
            reviewCount: 18,
            isVerified: true,
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
          pricingType: "fixed",
          currency: "AED",
          duration: "1-2 hours",
          isActive: item.isAvailable,
          isFeatured: true,
          rating: 4.8,
          reviewCount: 15,
          createdAt: new Date().toISOString(),
        }));
      } else {
        finalServices = POPULAR_SERVICES;
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
        setServices(POPULAR_SERVICES);
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

    // Load data asynchronously to avoid synchronous setState inside render/mount context
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
        (service) => service.category.slug === selectedCategory
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.category.name.toLowerCase().includes(query)
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
  }, [services, selectedCategory, searchQuery, sortBy]);

  return (
    <>
      <Navbar />

      <main id="main-content" className="flex-1 pt-16 lg:pt-18 bg-[var(--bg-primary)]">
        {/* ==========================================
            1. HERO SECTION
            ========================================== */}
        <section
          className="relative py-16 lg:py-24 overflow-hidden gradient-hero text-center"
          aria-labelledby="hero-title"
        >
          <div className="container-section flex flex-col items-center max-w-4xl relative z-10 gap-6">
            <Badge variant="secondary" className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 animate-fade-in">
              Verified & Safe UAE Home Services
            </Badge>

            <h1
              id="hero-title"
              className="text-display font-extrabold text-[var(--text-primary)] tracking-tight leading-none text-balance"
            >
              Professional Home Services, <br />
              <span className="text-emerald-600">On-Demand.</span>
            </h1>

            <p className="text-[var(--text-secondary)] text-base lg:text-lg max-w-2xl text-balance">
              Book certified plumbers, electricians, cleaners, and wellness specialists in Dubai, Abu Dhabi, and Sharjah instantly.
            </p>

            {/* Search Bar Input */}
            <div className="w-full max-w-xl relative mt-4">
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
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search home cleaning, AC repair, plumbing..."
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
                  className="absolute right-4 inset-y-0 text-xs font-semibold text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap justify-center items-center gap-2 mt-2 text-xs">
              <span className="text-[var(--text-tertiary)] font-medium">Popular:</span>
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-full border text-[var(--text-secondary)] hover:text-navy-900 hover:border-navy-200 transition-colors",
                    selectedCategory === cat.slug ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-[var(--border-subtle)]"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            2. SERVICES FILTER & LISTING SECTION
            ========================================== */}
        <section className="section-padding bg-white" aria-label="Services listing">
          <div className="container-section">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="w-full lg:w-64 lg:min-w-[256px] lg:max-w-[256px] shrink-0 flex flex-col gap-6" aria-label="Filters">
                {/* Search query tag indicator if active */}
                {(selectedCategory !== "all" || searchQuery) && (
                  <div className="p-4 rounded-xl bg-navy-50/50 border border-navy-100 flex items-center justify-between">
                    <span className="text-xs text-navy-800 font-medium">Active filters</span>
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSearchQuery("");
                      }}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
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
                      onClick={() => setSelectedCategory("all")}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left",
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
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left",
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
                {/* Result header count & mobile filters toggle */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">
                      {selectedCategory === "all" ? "All Offerings" : categories.find(c => c.slug === selectedCategory)?.name}
                    </h2>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Showing {filteredServices.length} {filteredServices.length === 1 ? "service" : "services"} in the UAE
                    </p>
                  </div>

                  {/* Dropdown sort for quick/mobile layout */}
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
                    description="We couldn't find any services matching your search or filters. Try adjusting your query."
                    action={{
                      label: "Reset All Filters",
                      onClick: () => {
                        setSelectedCategory("all");
                        setSearchQuery("");
                        setSortBy("popular");
                      },
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
                            {/* Category Label badge */}
                            <div className="absolute top-3 left-3">
                              <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-navy-900 border-none font-semibold">
                                {service.category.name}
                              </Badge>
                            </div>

                            {/* Featured Label badge */}
                            {service.isFeatured && (
                              <div className="absolute top-3 right-3">
                                <Badge variant="accent" className="font-semibold">Featured</Badge>
                              </div>
                            )}

                            {/* Center Logo/Icon */}
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

                            {/* Rating and Duration */}
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

                            {/* Divider line */}
                            <div className="border-t border-[var(--border-subtle)]" />

                            {/* Provider credentials */}
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

                            {/* CTA Action button */}
                            <Link
                              href={`/services/${service.id}`}
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

        {/* ==========================================
            3. WHY CHOOSE US
            ========================================== */}
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
                  color: "bg-emerald-50 text-emerald-600"
                },
                {
                  icon: ThumbsUp,
                  title: "Satisfaction Guarantee",
                  desc: "Your happiness is our priority. If you're not satisfied with the quality of execution, we'll send another professional to make it right.",
                  color: "bg-gold-50 text-gold-600"
                },
                {
                  icon: Lock,
                  title: "Secure Cashless Payments",
                  desc: "Your card is charged only after the service is fully completed and signed off. Enjoy zero hidden fees and clear upfront pricing.",
                  color: "bg-navy-50 text-navy-800"
                }
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

        {/* ==========================================
            4. HOW IT WORKS
            ========================================== */}
        <section className="section-padding bg-white" aria-labelledby="how-it-works-title">
          <div className="container-section text-center max-w-5xl space-y-12">
            <div className="space-y-3 max-w-xl mx-auto">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Workflow</p>
              <h2 id="how-it-works-title" className="text-[var(--text-primary)]">How Easy is Booking?</h2>
              <p className="text-[var(--text-secondary)] text-sm">Secure a service provider at your doorstep in under three minutes.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {[
                { step: "01", title: "Select Service", desc: "Choose from cleaning, plumbing, AC repair, and more." },
                { step: "02", title: "Schedule Date", desc: "Pick a date and convenient time window that suits you." },
                { step: "03", title: "Match Provider", desc: "We link you with a highly-rated professional nearby." },
                { step: "04", title: "Job Completed", desc: "The job is completed, you approve, and payment is processed." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] relative gap-4">
                  <div className="absolute top-4 right-4 text-xs font-extrabold text-navy-200">{item.step}</div>
                  <div className="h-10 w-10 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold text-xs">
                    {i + 1}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-[var(--text-primary)]">{item.title}</h3>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            5. INTERACTIVE FAQ SECTION
            ========================================== */}
        <FAQSection
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about ProServe services."
          categoryLabel="Help Desk"
          items={FAQS}
          bgClassName="bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]"
        />

        {/* ==========================================
            6. CALL TO ACTION (CTA)
            ========================================== */}
        <section className="section-padding bg-white" aria-label="Get started">
          <div className="container-section">
            <div className="rounded-3xl gradient-navy text-white p-8 md:p-12 lg:p-16 text-center max-w-4xl mx-auto relative overflow-hidden shadow-2xl flex flex-col items-center gap-6">
              {/* Background accents */}
              <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 h-40 w-40 bg-gold-500/10 rounded-full blur-3xl" />

              <h2 className="text-display font-extrabold text-white text-balance leading-tight">
                Ready to book your next home service?
              </h2>

              <p className="text-navy-100 text-sm lg:text-base max-w-xl mx-auto text-balance">
                Join thousands of satisfied UAE households. Sign up today and get 15% off your first booking.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <Link
                  href="/register"
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold text-xs bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-lg",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  )}
                >
                  Create Free Account
                </Link>
                <Link
                  href="/login"
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold text-xs bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/25",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  )}
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
