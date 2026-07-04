"use client";

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  Clock,
  ShieldCheck,
  BadgeCheck,
  MapPin,
  Mail,
  Phone,
  Globe,
  Award,
  ArrowLeft,
  ChevronRight,
  Clock3,
  ThumbsUp,
  Bookmark,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/common/rating";
import { formatCurrency } from "@/lib/utils";
import { FEATURED_PROVIDERS, TESTIMONIALS, POPULAR_SERVICES } from "@/constants";
import type { Service, Provider, Review } from "@/types";
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

const WORKING_HOURS = [
  { day: "Monday", hours: "8:00 AM - 6:00 PM" },
  { day: "Tuesday", hours: "8:00 AM - 6:00 PM" },
  { day: "Wednesday", hours: "8:00 AM - 6:00 PM" },
  { day: "Thursday", hours: "8:00 AM - 6:00 PM" },
  { day: "Friday", hours: "8:00 AM - 6:00 PM" },
  { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
  { day: "Sunday", hours: "Closed" }
];

const CERTIFICATIONS = [
  { name: "Dubai Municipality Approved", authority: "Dubai Government" },
  { name: "Certified Service Provider License", authority: "DED UAE" },
  { name: "Public Liability Insurance Cover", authority: "AXA Gulf" }
];

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60"
];

const getMockReviewsForProvider = (providerId: string): Review[] => {
  const matching = TESTIMONIALS.filter(t => t.providerId === providerId);
  if (matching.length > 0) return matching;

  if (providerId === "prov_1") {
    return [
      {
        id: "mrev-1",
        bookingId: "mbook-1",
        customerId: "cust-10",
        customer: { id: "cust-10", fullName: "Yousef Al Hashemi", avatarUrl: null },
        providerId: "prov_1",
        serviceId: "srv_1",
        rating: 5,
        title: "Fast leak repair",
        body: "The plumber arrived within 40 minutes and fixed our water pipe leak under the kitchen sink. Very efficient work.",
        createdAt: "2026-06-15T09:00:00Z"
      },
      {
        id: "mrev-2",
        bookingId: "mbook-2",
        customerId: "cust-11",
        customer: { id: "cust-11", fullName: "Elena Rostova", avatarUrl: null },
        providerId: "prov_1",
        serviceId: "srv_2",
        rating: 4,
        title: "Clean drain unclogging",
        body: "Cleared a severe clog in the bathroom drain. No mess left behind, polite service.",
        createdAt: "2026-06-20T14:30:00Z"
      }
    ];
  }

  if (providerId === "prov_2") {
    return [
      {
        id: "mrev-3",
        bookingId: "mbook-3",
        customerId: "cust-12",
        customer: { id: "cust-12", fullName: "Michael Chen", avatarUrl: null },
        providerId: "prov_2",
        serviceId: "srv_3",
        rating: 5,
        title: "Perfect ceiling fan mounting",
        body: "Quick installation of two ceiling fans. Checked for stability and cleaned up everything after wiring.",
        createdAt: "2026-06-25T11:15:00Z"
      }
    ];
  }

  return [];
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProviderProfilePage({ params }: PageProps) {
  const { id } = React.use(params);

  // States
  const [provider, setProvider] = React.useState<Provider | null>(null);
  const [services, setServices] = React.useState<Service[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [lightboxImage, setLightboxImage] = React.useState<string | null>(null);

  // Fetch Services & Provider Profile Details
  const loadData = React.useCallback(async (active: boolean) => {
    try {
      // 1. Resolve Provider general profile data
      let providerData: Provider | null = null;
      const staticProv = FEATURED_PROVIDERS.find((p) => p.id === id);

      if (staticProv) {
        providerData = staticProv;
      } else {
        const seededProv = SEEDED_PROVIDERS[id];
        if (seededProv) {
          providerData = seededProv;
        }
      }

      // 2. Fetch services for this provider from database
      const res = await api.get(`/api/services?providerId=${id}`);
      const rawServices = res.data.data;
      let finalServices: Service[] = [];

      if (Array.isArray(rawServices) && rawServices.length > 0) {
        finalServices = rawServices.map((item: { id: string; title: string; description: string; category: string; price: number; providerId: string; isAvailable: boolean }) => ({
          id: item.id,
          providerId: item.providerId,
          provider: {
            id: item.providerId,
            businessName: providerData?.businessName || "ProTech UAE Provider",
            avatarUrl: null,
            rating: providerData?.rating || 4.8,
            reviewCount: providerData?.reviewCount || 1,
            isVerified: providerData?.isVerified ?? true,
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
          reviewCount: 2,
          createdAt: new Date().toISOString(),
        }));
      } else if (staticProv) {
        // Fallback to static services mapping
        finalServices = POPULAR_SERVICES.filter((s) => s.providerId === id);
      }

      // 3. Handle dynamic newly created database provider metadata if provider is not mocked yet
      if (!providerData && finalServices.length > 0) {
        const firstSvc = finalServices[0];
        providerData = {
          id: id,
          userId: firstSvc.providerId,
          businessName: firstSvc.provider.businessName,
          tagline: "Verified ProServe Professional",
          bio: "This service provider has registered with ProServe to offer high-quality services in the UAE.",
          avatarUrl: null,
          rating: firstSvc.provider.rating,
          reviewCount: firstSvc.provider.reviewCount,
          completedJobs: 18,
          responseTime: "< 1 hour",
          isVerified: firstSvc.provider.isVerified,
          isFeatured: false,
          categories: [],
          location: "Dubai, UAE",
          joinedAt: new Date().toISOString(),
        };
      }

      if (active) {
        if (providerData) {
          setProvider(providerData);
          setServices(finalServices);
          setIsError(false);
        } else {
          setIsError(true);
        }
      }
    } catch (err) {
      console.error("Failed to load provider profile:", err);
      // Try static featured details only as fallback
      const staticProv = FEATURED_PROVIDERS.find((p) => p.id === id);
      if (active) {
        if (staticProv) {
          setProvider(staticProv);
          setServices(POPULAR_SERVICES.filter((s) => s.providerId === id));
          setIsError(false);
        } else {
          setIsError(true);
        }
      }
    } finally {
      if (active) {
        setIsLoading(false);
      }
    }
  }, [id]);

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

  // Compute related/similar providers
  const relatedProviders = React.useMemo(() => {
    if (!provider) return [];
    return FEATURED_PROVIDERS.filter(
      (p) =>
        p.id !== provider.id &&
        p.categories.some((c) => provider.categories.some((pc) => pc.slug === c.slug))
    ).slice(0, 3);
  }, [provider]);

  // Compute average metrics
  const reviews = React.useMemo(() => {
    return getMockReviewsForProvider(id);
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-24 pb-16 bg-[var(--bg-primary)]">
          <div className="container-section space-y-8">
            {/* Header Skeleton */}
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-8 flex flex-col md:flex-row gap-6 animate-pulse">
              <div className="h-20 w-20 rounded-2xl bg-[var(--bg-secondary)] shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-[var(--bg-secondary)] rounded w-1/3" />
                <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/2" />
                <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/4" />
              </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6 animate-pulse">
                <div className="h-40 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-3">
                  <div className="h-5 bg-[var(--bg-secondary)] rounded w-1/4" />
                  <div className="h-4 bg-[var(--bg-secondary)] rounded w-full" />
                  <div className="h-4 bg-[var(--bg-secondary)] rounded w-5/6" />
                </div>
                <div className="h-80 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6" />
              </div>
              <div className="space-y-6 animate-pulse">
                <div className="h-60 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6" />
                <div className="h-60 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (isError || !provider) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-24 pb-16 bg-[var(--bg-primary)]">
          <div className="container-section max-w-xl py-12">
            <ErrorState
              title="Provider profile not found"
              description="We couldn't retrieve details for this specific service provider. They might have updated their registry or the ID is incorrect."
              onRetry={() => {
                setIsLoading(true);
                loadData(true);
              }}
            />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main id="main-content" className="flex-1 pt-24 pb-16 bg-[var(--bg-primary)]">
        <div className="container-section space-y-8">
          {/* Back button header navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-navy-900 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Services
            </Link>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all duration-200 cursor-pointer",
                isBookmarked
                  ? "bg-gold-50 border-gold-200 text-gold-700"
                  : "bg-white border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              <Bookmark size={13} className={cn(isBookmarked && "fill-gold-600")} />
              {isBookmarked ? "Saved" : "Save Provider"}
            </button>
          </div>

          {/* ==========================================
              1. PROVIDER HEADER CARD
              ========================================== */}
          <section
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative shadow-sm"
            aria-labelledby="provider-name"
          >
            <div className="flex items-start md:items-center gap-5">
              {/* Avatar Bubble */}
              <div className="relative shrink-0">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center text-white text-3xl font-extrabold shadow-md select-none">
                  {provider.businessName[0]}
                </div>
                {provider.isVerified && (
                  <div
                    className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-sm"
                    title="Verified Professional"
                  >
                    <BadgeCheck size={14} className="text-white" />
                  </div>
                )}
              </div>

              {/* Title & Badge Credentials */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 id="provider-name" className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight truncate">
                    {provider.businessName}
                  </h1>
                  {provider.isFeatured && (
                    <Badge variant="accent" className="font-semibold select-none">
                      Featured
                    </Badge>
                  )}
                  <Badge variant="emerald" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none font-semibold select-none">
                    Available Now
                  </Badge>
                </div>

                <p className="text-sm text-[var(--text-secondary)] font-medium leading-none">
                  {provider.tagline}
                </p>

                {/* Ratings & Completed Jobs row */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[var(--text-tertiary)]">
                  <Rating value={provider.rating} showValue reviewCount={provider.reviewCount} size="sm" />
                  <span className="h-3 w-px bg-[var(--border-subtle)]" aria-hidden="true" />
                  <span className="flex items-center gap-1 font-medium">
                    <Briefcase size={13} className="text-[var(--text-secondary)]" />
                    {provider.completedJobs}+ Jobs Done
                  </span>
                  <span className="h-3 w-px bg-[var(--border-subtle)]" aria-hidden="true" />
                  <span className="flex items-center gap-1 font-medium">
                    <Clock size={13} className="text-[var(--text-secondary)]" />
                    Responds {provider.responseTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Booking CTA */}
            <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row gap-3 pt-2 md:pt-0">
              <a
                href="#services-section"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "w-full md:w-auto font-bold text-xs"
                )}
              >
                Book Appointment
              </a>
              <a
                href="#contact-section"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full md:w-auto font-bold text-xs"
                )}
              >
                Contact Info
              </a>
            </div>
          </section>

          {/* ==========================================
              2. DETAILED SECTIONS GRID
              ========================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: ABOUT, SERVICES, GALLERY & REVIEWS */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* 2.1 ABOUT BIOGRAPHY */}
              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-4" aria-labelledby="about-title">
                <h2 id="about-title" className="text-base font-extrabold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3">
                  About Provider
                </h2>
                <p className="text-xs lg:text-sm text-[var(--text-secondary)] leading-relaxed text-balance">
                  {provider.bio}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-secondary)]">
                    <Award size={18} className="text-navy-600" />
                    <div>
                      <p className="text-[10px] text-[var(--text-tertiary)] leading-none">Experience</p>
                      <p className="text-xs font-bold text-[var(--text-primary)] mt-1">8+ Years Professional</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-secondary)]">
                    <Globe size={18} className="text-emerald-600" />
                    <div>
                      <p className="text-[10px] text-[var(--text-tertiary)] leading-none">Languages</p>
                      <p className="text-xs font-bold text-[var(--text-primary)] mt-1">English, Arabic, Hindi</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2.2 SERVICES OFFERED */}
              <section id="services-section" className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-4" aria-labelledby="services-title">
                <div className="border-b border-[var(--border-subtle)] pb-3 flex items-center justify-between">
                  <h2 id="services-title" className="text-base font-extrabold text-[var(--text-primary)]">
                    Services Offered
                  </h2>
                  <Badge variant="secondary" className="font-semibold select-none">
                    {services.length} {services.length === 1 ? "Offer" : "Offers"}
                  </Badge>
                </div>

                {services.length === 0 ? (
                  <div className="py-6">
                    <EmptyState
                      title="No services registered"
                      description="This provider does not have any active service offerings published at the moment."
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {services.map((svc) => (
                      <div
                        key={svc.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-[var(--border-subtle)] hover:border-emerald-100 bg-white transition-all gap-4"
                      >
                        <div className="space-y-1">
                          <h3 className="text-xs lg:text-sm font-bold text-[var(--text-primary)]">
                            {svc.title}
                          </h3>
                          <p className="text-[11px] text-[var(--text-tertiary)] leading-relaxed max-w-lg">
                            {svc.description}
                          </p>
                          <div className="flex items-center gap-3 pt-1 text-[10px] text-[var(--text-disabled)] font-medium">
                            <span className="flex items-center gap-1">
                              <Clock3 size={11} />
                              {svc.duration || "1-2 hours"}
                            </span>
                            <span className="h-2 w-px bg-[var(--border-subtle)]" />
                            <span>Fixed pricing structure</span>
                          </div>
                        </div>

                        <div className="w-full sm:w-auto shrink-0 flex items-center justify-between sm:justify-end gap-4 border-t sm:border-none pt-3 sm:pt-0">
                          <div className="text-left sm:text-right">
                            <p className="text-xs text-[var(--text-tertiary)]">Est. Price</p>
                            <p className="text-sm font-extrabold text-navy-950">
                              {formatCurrency(svc.priceFrom)}
                            </p>
                          </div>
                          <Link
                            href={`/services/${svc.id}`}
                            className={cn(
                              buttonVariants({ variant: "outline", size: "sm" }),
                              "font-bold text-[10px]"
                            )}
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* 2.3 GALLERY PORTFOLIO */}
              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-4" aria-labelledby="gallery-title">
                <h2 id="gallery-title" className="text-base font-extrabold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3">
                  Work Gallery
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {GALLERY_IMAGES.map((imgUrl, i) => (
                    <div
                      key={i}
                      onClick={() => setLightboxImage(imgUrl)}
                      className="group aspect-video rounded-xl overflow-hidden border border-[var(--border-subtle)] cursor-zoom-in relative bg-[var(--bg-secondary)]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={`Work portfolio screenshot ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                        Enlarge
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 2.4 REVIEWS LIST */}
              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-5" aria-labelledby="reviews-title">
                <h2 id="reviews-title" className="text-base font-extrabold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3">
                  Customer Reviews
                </h2>

                {/* Rating Overview Banner */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                  <div className="text-center shrink-0">
                    <p className="text-3xl font-extrabold text-navy-950">{provider.rating}</p>
                    <div className="flex justify-center mt-1">
                      <Rating value={provider.rating} size="sm" />
                    </div>
                    <p className="text-[10px] text-[var(--text-tertiary)] mt-1.5 font-semibold">
                      Based on {provider.reviewCount} total jobs
                    </p>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    {[
                      { stars: 5, pct: "85%" },
                      { stars: 4, pct: "10%" },
                      { stars: 3, pct: "5%" },
                      { stars: 2, pct: "0%" },
                      { stars: 1, pct: "0%" }
                    ].map((row) => (
                      <div key={row.stars} className="flex items-center gap-3 text-xs">
                        <span className="w-8 text-[var(--text-secondary)] font-medium text-right shrink-0">{row.stars} ★</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: row.pct }} />
                        </div>
                        <span className="w-8 text-[var(--text-tertiary)] text-right shrink-0 font-medium">{row.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review cards */}
                {reviews.length === 0 ? (
                  <div className="py-4">
                    <EmptyState
                      title="No reviews yet"
                      description="This service provider has not received any reviews yet. Check back once their first jobs are completed."
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {reviews.map((rev) => (
                      <article
                        key={rev.id}
                        className="p-5 rounded-xl border border-[var(--border-subtle)] bg-white flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-navy-100 flex items-center justify-center text-navy-800 text-[11px] font-bold shrink-0 select-none">
                              {rev.customer.fullName[0]}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[var(--text-primary)]">
                                {rev.customer.fullName}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <Rating value={rev.rating} size="sm" />
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[9px] text-emerald-600 font-semibold">Verified Hire</span>
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] text-[var(--text-disabled)] font-medium">
                            {new Date(rev.createdAt).toLocaleDateString("en-AE", { year: "numeric", month: "short", day: "numeric" })}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-[var(--text-primary)]">
                            &ldquo;{rev.title}&rdquo;
                          </h4>
                          <p className="text-[11px] lg:text-xs text-[var(--text-secondary)] leading-relaxed">
                            {rev.body}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-[10px] text-[var(--text-tertiary)] pt-1 border-t border-[var(--border-subtle)]">
                          <button className="flex items-center gap-1 font-bold hover:text-navy-900 cursor-pointer">
                            <ThumbsUp size={11} />
                            Helpful (2)
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

            </div>

            {/* RIGHT COLUMN: CONTACT, AVAILABILITY & VERIFICATION */}
            <div className="space-y-8">
              
              {/* 2.5 CONTACT INFO */}
              <section id="contact-section" className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-4" aria-labelledby="contact-title">
                <h2 id="contact-title" className="text-base font-extrabold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3">
                  Contact Information
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-[var(--text-tertiary)] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-[var(--text-tertiary)] font-medium leading-none">Location</p>
                      <p className="text-xs font-bold text-[var(--text-primary)] mt-1.5">{provider.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-[var(--text-tertiary)] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-[var(--text-tertiary)] font-medium leading-none">Email Address</p>
                      <a href={`mailto:info@${provider.id}.ae`} className="text-xs font-bold text-navy-700 hover:text-navy-900 transition-colors mt-1.5 block">
                        info@{provider.id}.ae
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-[var(--text-tertiary)] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-[var(--text-tertiary)] font-medium leading-none">Phone Number</p>
                      <a href="tel:+97141234567" className="text-xs font-bold text-navy-700 hover:text-navy-900 transition-colors mt-1.5 block">
                        +971 4 123 4567
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe size={16} className="text-[var(--text-tertiary)] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-[var(--text-tertiary)] font-medium leading-none">Website</p>
                      <a href="https://proserve.ae" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-navy-700 hover:text-navy-900 transition-colors mt-1.5 flex items-center gap-1">
                        www.proserve.ae
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2.6 WORKING HOURS */}
              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-4" aria-labelledby="hours-title">
                <h2 id="hours-title" className="text-base font-extrabold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3">
                  Working Hours
                </h2>
                <div className="flex flex-col gap-2.5">
                  {WORKING_HOURS.map((dayRow) => (
                    <div
                      key={dayRow.day}
                      className={cn(
                        "flex items-center justify-between text-xs py-1.5 border-b border-[var(--border-subtle)] last:border-none",
                        dayRow.hours === "Closed" ? "text-[var(--text-disabled)]" : "text-[var(--text-secondary)]"
                      )}
                    >
                      <span className="font-semibold">{dayRow.day}</span>
                      <span className={cn(dayRow.hours === "Closed" ? "font-semibold text-red-500" : "font-medium")}>
                        {dayRow.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 2.7 CERTIFICATIONS */}
              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-4" aria-labelledby="certifications-title">
                <h2 id="certifications-title" className="text-base font-extrabold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3">
                  Certifications & Licenses
                </h2>
                <div className="flex flex-col gap-3">
                  {CERTIFICATIONS.map((cert, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border-subtle)] bg-white">
                      <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-[var(--text-primary)]">
                          {cert.name}
                        </p>
                        <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
                          Issued by {cert.authority}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>

          </div>

          {/* ==========================================
              3. RELATED PROVIDERS FOOTER ROW
              ========================================== */}
          {relatedProviders.length > 0 && (
            <section className="space-y-6 pt-6" aria-labelledby="related-title">
              <div className="flex items-end justify-between border-b border-[var(--border-subtle)] pb-3">
                <h2 id="related-title" className="text-lg font-extrabold text-[var(--text-primary)]">
                  Similar Service Providers
                </h2>
                <Link href="/services" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                  View All Providers
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProviders.map((rel) => (
                  <article
                    key={rel.id}
                    className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 hover:border-emerald-100 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center text-white font-extrabold text-base shrink-0">
                        {rel.businessName[0]}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/providers/${rel.id}`}>
                          <h3 className="text-xs lg:text-sm font-bold text-[var(--text-primary)] group-hover:text-emerald-600 transition-colors truncate">
                            {rel.businessName}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Rating value={rel.rating} size="sm" />
                          <span className="text-[9px] text-[var(--text-tertiary)]">({rel.reviewCount})</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed h-8">
                      {rel.bio}
                    </p>

                    <div className="border-t border-[var(--border-subtle)] pt-3 mt-auto flex items-center justify-between text-[10px] text-[var(--text-tertiary)] font-semibold">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {rel.location.split(",")[0]}
                      </span>
                      <Link
                        href={`/providers/${rel.id}`}
                        className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        Profile
                        <ChevronRight size={12} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* Lightbox Backdrop Overlay */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImage}
              alt="Work portfolio detail zoom-in"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-fade-in"
            />
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 font-bold text-xl cursor-pointer bg-navy-950/50 p-2 rounded-full h-10 w-10 flex items-center justify-center"
              onClick={() => setLightboxImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
