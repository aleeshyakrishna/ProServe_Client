"use client";

import * as React from "react";
import { X, MapPin, SlidersHorizontal, Star, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FilterCategoryItem {
  id: string;
  name: string;
  slug: string;
  serviceCount?: number;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export interface FilterLocationItem {
  value: string;
  label: string;
}

export interface FilterSortItem {
  value: string;
  label: string;
}

export interface FilterRatingItem {
  value: number;
  label: string;
}

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Categories
  categories: FilterCategoryItem[];
  selectedCategory: string;
  onCategoryChange: (slug: string) => void;
  allCategoryCount?: number;
  categoryLabel?: string;
  // Location
  locations: FilterLocationItem[];
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  // Sort
  sortOptions: FilterSortItem[];
  sortBy: string;
  onSortChange: (sort: string) => void;
  // Optional Rating (e.g. providers)
  ratingOptions?: FilterRatingItem[];
  selectedRating?: number;
  onRatingChange?: (rating: number) => void;
  // Counts & Reset
  hasActiveFilters: boolean;
  onReset: () => void;
  resultCount?: number;
  applyButtonLabel?: string;
}

export function MobileFilterModal({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategoryChange,
  allCategoryCount,
  categoryLabel = "Service Category",
  locations,
  selectedLocation,
  onLocationChange,
  sortOptions,
  sortBy,
  onSortChange,
  ratingOptions,
  selectedRating,
  onRatingChange,
  hasActiveFilters,
  onReset,
  resultCount,
  applyButtonLabel = "Apply",
}: MobileFilterModalProps) {
  // Lock body scroll and listen for Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal / Bottom Sheet Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative z-10 w-full max-h-[88vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden border-t border-[var(--border-subtle)]"
            role="dialog"
            aria-modal="true"
            aria-label="Filter options"
          >
            {/* Sheet Handle */}
            <div className="pt-2 pb-1 flex justify-center">
              <div className="w-10 h-1 rounded-full bg-neutral-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-emerald-600" />
                <h2 className="text-lg font-bold text-navy-950">Filters</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                aria-label="Close filters dialog"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 overscroll-contain">
              {/* Reset bar */}
              <div className="flex items-center justify-between pb-1 border-b border-dashed border-[var(--border-subtle)]">
                <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  Active Options
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={onReset}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* 1. Category Filter */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-navy-950">{categoryLabel}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onCategoryChange("all")}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left",
                      selectedCategory === "all"
                        ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                        : "bg-white text-navy-900 border-[var(--border-subtle)] hover:bg-neutral-50"
                    )}
                  >
                    <span className="truncate">All</span>
                    {allCategoryCount !== undefined && (
                      <span
                        className={cn(
                          "ml-1 text-[10px] px-1.5 py-0.5 rounded-full shrink-0",
                          selectedCategory === "all"
                            ? "bg-navy-800 text-white"
                            : "bg-neutral-100 text-[var(--text-tertiary)]"
                        )}
                      >
                        {allCategoryCount}
                      </span>
                    )}
                  </button>

                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.slug;
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => onCategoryChange(cat.slug)}
                        className={cn(
                          "flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left",
                          isSelected
                            ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                            : "bg-white text-navy-900 border-[var(--border-subtle)] hover:bg-neutral-50"
                        )}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {Icon && (
                            <Icon
                              size={14}
                              className={cn(
                                "shrink-0",
                                isSelected ? "text-emerald-400" : "text-[var(--text-tertiary)]"
                              )}
                            />
                          )}
                          <span className="truncate">{cat.name}</span>
                        </div>
                        {cat.serviceCount !== undefined && (
                          <span
                            className={cn(
                              "ml-1 text-[10px] px-1.5 py-0.5 rounded-full shrink-0",
                              isSelected
                                ? "bg-navy-800 text-white"
                                : "bg-neutral-100 text-[var(--text-tertiary)]"
                            )}
                          >
                            {cat.serviceCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Location Filter */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-navy-950 flex items-center gap-1.5">
                  <MapPin size={15} className="text-emerald-600" />
                  <span>Location</span>
                </h3>
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => onLocationChange(e.target.value)}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-3.5 h-11 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {locations.map((loc) => (
                      <option key={loc.value} value={loc.value}>
                        {loc.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Optional Rating Filter */}
              {ratingOptions && onRatingChange && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-navy-950 flex items-center gap-1.5">
                    <Star size={15} className="text-gold-500 fill-gold-500" />
                    <span>Minimum Rating</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {ratingOptions.map((opt) => {
                      const isSelected = selectedRating === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => onRatingChange(opt.value)}
                          className={cn(
                            "py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center",
                            isSelected
                              ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                              : "bg-white text-navy-900 border-[var(--border-subtle)] hover:bg-neutral-50"
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Sort By Filter */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-navy-950">Sort By</h3>
                <div className="space-y-2">
                  {sortOptions.map((opt) => {
                    const isSelected = sortBy === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
                          isSelected
                            ? "border-emerald-500 bg-emerald-50/50 text-navy-950"
                            : "border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] hover:bg-neutral-50"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="mobile-sortBy"
                            value={opt.value}
                            checked={isSelected}
                            onChange={() => onSortChange(opt.value)}
                            className="h-4 w-4 border-[var(--border-default)] text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                          />
                          <span>{opt.label}</span>
                        </div>
                        {isSelected && <Check size={14} className="text-emerald-600" />}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="p-4 border-t border-[var(--border-subtle)] bg-white">
              <button
                type="button"
                onClick={onClose}
                className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
              >
                <span>{applyButtonLabel}</span>
                {resultCount !== undefined && (
                  <span className="text-emerald-100 font-medium text-xs">
                    ({resultCount} {resultCount === 1 ? "result" : "results"})
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

