"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { serviceName } from "@/i18n/service-names";

import Link from "next/link";
import {
  Sparkles,
  Wrench,
  Zap,
  Wind,
  Paintbrush,
  Hammer,
  Heart,
  Leaf,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/constants";
import type { Category } from "@/types";
import * as React from "react";
import api from "@/lib/axios";

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
};

// ------ Category Card ---------------------------------------

function CategoryCard({ category }: { category: Category }) {
  const { t } = useI18n();
  const Icon = ICON_MAP[category.iconName.toLowerCase()] ?? Wrench;

  return (
    <Link
      href={`/services/${category.slug}`}
      className={cn(
        "group flex flex-col items-center text-center",
        "rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)]",
        "p-6 gap-4",
        "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:shadow-lg hover:-translate-y-1",
        "hover:border-emerald-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
      )}
      aria-label={`${serviceName(t, category.name)} — ${t.categories.servicesCount.replace("{count}", String(category.serviceCount))}`}
    >
      {/* Icon bubble */}
      <div
        className={cn(
          "flex items-center justify-center h-14 w-14 rounded-2xl",
          "bg-navy-50 text-navy-700",
          "transition-all duration-300",
          "group-hover:bg-emerald-100 group-hover:text-emerald-700",
          "group-hover:scale-110",
        )}
        aria-hidden="true"
      >
        <Icon size={24} />
      </div>

      {/* Text */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-tight">
          {serviceName(t, category.name)}
        </h3>
        <p className="text-xs text-[var(--text-tertiary)]">
          {t.categories.servicesCount.replace("{count}", category.serviceCount.toLocaleString("en-AE"))}
        </p>
      </div>
    </Link>
  );
}

// ------ Section ---------------------------------------------

export function CategoriesSection() {
  const { t } = useI18n();
  const [categoriesList, setCategoriesList] = React.useState<Category[]>([]);

  React.useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get("/api/categories");
        const rawCats = response.data.data;

        if (Array.isArray(rawCats) && rawCats.length > 0) {
          const normalized: Category[] = rawCats.map((item: any) => ({
            id: item.id,
            name: item.name.charAt(0) + item.name.slice(1).toLowerCase(),
            slug: item.slug,
            description: item.description || "",
            iconName: item.iconName ? item.iconName.toLowerCase() : "wrench",
            serviceCount: 4, // Seed fallback count
            imageUrl: item.imageUrl || null,
          }));
          setCategoriesList(normalized);
        } else {
          setCategoriesList(CATEGORIES);
        }
      } catch (err) {
        console.error("Failed to load home page categories:", err);
        setCategoriesList(CATEGORIES);
      }
    }

    loadCategories();
  }, []);

  return (
    <section
      className="section-padding bg-[var(--bg-secondary)]"
      aria-labelledby="categories-heading"
    >
      <div className="container-section">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 gap-4">
          <div className="space-y-2 max-w-xl">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">
              {t.categories.eyebrow}
            </p>
            <h2
              id="categories-heading"
              className="text-[var(--text-primary)]"
            >
              {t.categories.title}
            </h2>
            <p className="text-[var(--text-secondary)] text-base">
              {t.categories.subtitle}
            </p>
          </div>

          <Link
            href="/services"
            className={cn(
              "hidden sm:flex items-center gap-1.5 shrink-0",
              "text-sm font-semibold text-emerald-600 hover:text-emerald-700",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded",
            )}
          >
            {t.categories.viewAll}
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          aria-label={t.categories.listAria}
        >
          {categoriesList.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link href="/services">
            <button
              type="button"
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl",
                "border border-[var(--border-default)] text-sm font-semibold text-[var(--text-secondary)]",
                "hover:bg-[var(--bg-tertiary)] transition-colors",
              )}
            >
              {t.categories.viewAll}
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
