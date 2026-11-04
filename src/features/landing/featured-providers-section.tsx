"use client";

import { useI18n } from "@/i18n/I18nProvider";
import Link from "next/link";
import { ShieldCheck, Clock, ChevronRight, BadgeCheck, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/common/rating";
import { FEATURED_PROVIDERS } from "@/constants";
import type { Provider } from "@/types";

// ------ Provider Card ---------------------------------------

function ProviderCard({ provider }: { provider: Provider }) {
  const { t } = useI18n();
  return (
    <article
      className={cn(
        "group flex flex-col",
        "rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)]",
        "p-6 gap-5",
        "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:shadow-xl hover:-translate-y-1 hover:border-[var(--border-default)]",
      )}
    >
      {/* Header: Avatar + Name + Verified */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={cn(
              "h-14 w-14 rounded-2xl",
              "bg-gradient-to-br from-navy-700 to-navy-900",
              "flex items-center justify-center",
              "text-white text-xl font-bold",
              "shadow-md",
            )}
            aria-hidden="true"
          >
            {provider.businessName[0]}
          </div>
          {provider.isVerified && (
            <div
              className={cn(
                "absolute -bottom-1 -right-1",
                "h-5 w-5 rounded-full",
                "bg-emerald-500 border-2 border-[var(--surface-card)]",
                "flex items-center justify-center",
              )}
              aria-label={t.providers.verifiedAria}
            >
              <BadgeCheck size={12} className="text-white" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={`/providers/${provider.id}`}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 rounded"
              >
                <h3 className="font-bold text-[var(--text-primary)] leading-tight hover:text-navy-700 transition-colors truncate">
                  {provider.businessName}
                </h3>
              </Link>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5 truncate">
                {provider.tagline}
              </p>
            </div>
            {provider.isFeatured && (
              <Badge variant="accent" size="sm" className="shrink-0">
                {t.providers.featured}
              </Badge>
            )}
          </div>

          {/* Rating */}
          <div className="mt-2">
            <Rating
              value={provider.rating}
              showValue
              reviewCount={provider.reviewCount}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--bg-secondary)]">
          <Briefcase size={14} className="text-navy-600 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)] leading-none">
              {provider.completedJobs.toLocaleString("en-AE")}+
            </p>
            <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{t.providers.jobsDone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--bg-secondary)]">
          <Clock size={14} className="text-emerald-600 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)] leading-none">
              {provider.responseTime}
            </p>
            <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{t.providers.response}</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5">
        {provider.categories.map((cat) => (
          <Badge key={cat.id} variant="emerald" size="sm">
            {cat.name}
          </Badge>
        ))}
      </div>

      {/* CTA */}
      <Link
        href={`/providers/${provider.id}`}
        className={cn(
          "flex items-center justify-center gap-2 w-full",
          "h-10 rounded-xl text-sm font-semibold",
          "bg-navy-900 text-white",
          "hover:bg-navy-800 transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700",
        )}
      >
        {t.providers.viewProfile}
        <ChevronRight size={14} aria-hidden="true" />
      </Link>
    </article>
  );
}

// ------ Section ---------------------------------------------

export function FeaturedProvidersSection() {
  const { t } = useI18n();
  return (
    <section
      className="section-padding bg-[var(--bg-secondary)]"
      aria-labelledby="providers-heading"
    >
      <div className="container-section">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 gap-4">
          <div className="space-y-2 max-w-xl">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">
              {t.providers.eyebrow}
            </p>
            <h2 id="providers-heading" className="text-[var(--text-primary)]">
              {t.providers.title}
            </h2>
            <p className="text-[var(--text-secondary)] text-base">
              {t.providers.subtitle}
            </p>
          </div>

          <Link
            href="/providers"
            className={cn(
              "hidden sm:flex items-center gap-1.5 shrink-0",
              "text-sm font-semibold text-emerald-600 hover:text-emerald-700",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded",
            )}
          >
            {t.providers.viewAll}
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          aria-label={t.providers.listAria}
        >
          {FEATURED_PROVIDERS.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>

        {/* Trust Strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 p-6 rounded-2xl bg-[var(--surface-card)] border border-[var(--border-subtle)]">
          {[
            { icon: <ShieldCheck size={18} className="text-emerald-500" />, text: t.providers.trust.backgroundChecked },
            { icon: <BadgeCheck size={18} className="text-navy-700" />, text: t.providers.trust.identityVerified },
            { icon: <Briefcase size={18} className="text-gold-600" />, text: t.providers.trust.insured },
            { icon: <Clock size={18} className="text-emerald-500" />, text: t.providers.trust.fastResponse },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2.5">
              {icon}
              <span className="text-sm font-medium text-[var(--text-secondary)]">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
