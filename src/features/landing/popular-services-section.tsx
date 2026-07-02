"use client";

import Link from "next/link";
import { MapPin, Clock, Star, ShieldCheck, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/common/rating";
import { formatCurrency } from "@/lib/utils";
import { POPULAR_SERVICES } from "@/constants";
import type { Service } from "@/types";
import * as React from "react";
import api from "@/lib/axios";

// ------ Service Card ----------------------------------------

function ServiceCard({ service }: { service: Service }) {
  const priceDisplay =
    service.pricingType === "quoted"
      ? "Custom Quote"
      : service.priceTo
      ? `${formatCurrency(service.priceFrom)} – ${formatCurrency(service.priceTo)}`
      : `From ${formatCurrency(service.priceFrom)}`;

  return (
    <article
      className={cn(
        "group flex flex-col",
        "rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)]",
        "overflow-hidden",
        "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:shadow-xl hover:-translate-y-1",
      )}
    >
      {/* Image placeholder (real image served via Next/Image in production) */}
      <div
        className={cn(
          "h-48 w-full relative overflow-hidden bg-gradient-to-br",
          "from-navy-100 to-emerald-50",
          "shrink-0",
        )}
        aria-hidden="true"
      >
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" size="sm">
            {service.category.name}
          </Badge>
        </div>

        {/* Featured badge */}
        {service.isFeatured && (
          <div className="absolute top-3 right-3">
            <Badge variant="accent" size="sm">Featured</Badge>
          </div>
        )}

        {/* Decorative icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-20 w-20 rounded-3xl bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-sm">
            <span className="text-3xl font-bold text-navy-200">
              {service.title[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title & Provider */}
        <div>
          <Link
            href={`/services/${service.id}`}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 rounded"
          >
            <h3
              className={cn(
                "font-semibold text-[var(--text-primary)] leading-snug mb-1",
                "group-hover:text-navy-700 transition-colors",
              )}
            >
              {service.title}
            </h3>
          </Link>
          <p className="text-xs text-[var(--text-tertiary)] line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
          {service.duration && (
            <span className="flex items-center gap-1">
              <Clock size={12} aria-hidden="true" />
              {service.duration}
            </span>
          )}
        </div>

        {/* Rating */}
        <Rating
          value={service.rating}
          showValue
          reviewCount={service.reviewCount}
          size="sm"
        />

        {/* Divider */}
        <div className="border-t border-[var(--border-subtle)]" />

        {/* Provider & Price */}
        <div className="flex items-center justify-between gap-2">
          {/* Provider */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-full bg-navy-800 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-white">
                {service.provider.businessName[0]}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                {service.provider.businessName}
              </p>
              {service.provider.isVerified && (
                <div className="flex items-center gap-0.5">
                  <ShieldCheck size={10} className="text-emerald-500" aria-label="Verified" />
                  <span className="text-[10px] text-emerald-600">Verified</span>
                </div>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-navy-900">{priceDisplay}</p>
            {service.pricingType !== "quoted" && (
              <p className="text-[10px] text-[var(--text-disabled)]">per service</p>
            )}
          </div>
        </div>

        {/* Book CTA */}
        <Link
          href={`/services/${service.id}`}
          className={cn(
            "mt-1 flex items-center justify-center w-full",
            "h-10 rounded-xl",
            "bg-navy-50 text-navy-800 text-sm font-semibold",
            "border border-navy-100",
            "hover:bg-navy-900 hover:text-white hover:border-navy-900",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700",
          )}
        >
          Book Now
        </Link>
      </div>
    </article>
  );
}

// ------ Section ---------------------------------------------

export function PopularServicesSection() {
  const [servicesList, setServicesList] = React.useState<Service[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadServices() {
      try {
        const response = await api.get("/api/services");
        const rawServices = response.data.data;

        if (Array.isArray(rawServices) && rawServices.length > 0) {
          const normalized: Service[] = rawServices.map((item: any) => ({
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
          setServicesList(normalized);
        } else {
          // Fallback to static mock data if DB has no services
          setServicesList(POPULAR_SERVICES);
        }
      } catch (err) {
        console.error("Failed to load home page services:", err);
        setServicesList(POPULAR_SERVICES);
      } finally {
        setIsLoading(false);
      }
    }

    loadServices();
  }, []);

  return (
    <section
      className="section-padding"
      aria-labelledby="popular-services-heading"
    >
      <div className="container-section">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 gap-4">
          <div className="space-y-2 max-w-xl">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">
              Most Booked
            </p>
            <h2 id="popular-services-heading" className="text-[var(--text-primary)]">
              Popular Services
            </h2>
            <p className="text-[var(--text-secondary)] text-base">
              Handpicked by our UAE customers. Every service comes with a satisfaction guarantee.
            </p>
          </div>

          <Link
            href="/services"
            className={cn(
              "hidden sm:flex items-center gap-1.5 shrink-0",
              "text-sm font-semibold text-emerald-600 hover:text-emerald-700",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded",
            )}
          >
            Browse all services
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          aria-label="Popular services"
        >
          {servicesList.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
