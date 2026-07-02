"use client";

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
      aria-label={`${category.name} — ${category.serviceCount} services available`}
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
          {category.name}
        </h3>
        <p className="text-xs text-[var(--text-tertiary)]">
          {category.serviceCount.toLocaleString("en-AE")} services
        </p>
      </div>
    </Link>
  );
}

// ------ Section ---------------------------------------------

export function CategoriesSection() {
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
              Browse by Category
            </p>
            <h2
              id="categories-heading"
              className="text-[var(--text-primary)]"
            >
              Find the Right Service
            </h2>
            <p className="text-[var(--text-secondary)] text-base">
              Explore our full range of professional services, all available on-demand across the UAE.
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
            View all services
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          aria-label="Service categories"
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
              View all services
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
