"use client";

import * as React from "react";
import Link from "next/link";
import { Search, MapPin, ChevronDown, ShieldCheck, Star, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ------ Search Bar ------------------------------------------

const POPULAR_SEARCHES = [
  "Home Cleaning",
  "AC Service",
  "Plumbing",
  "Electrical",
  "Deep Cleaning",
];

import { useRouter } from "next/navigation";

function HeroSearchBar() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [location, setLocation] = React.useState("Dubai");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set("search", query.trim());
    }
    if (location) {
      params.set("location", location);
    }
    router.push(`/services?${params.toString()}`);
  };

  const handleTagClick = (term: string) => {
    setQuery(term);
    const params = new URLSearchParams();
    params.set("search", term);
    if (location) {
      params.set("location", location);
    }
    router.push(`/services?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "w-full max-w-2xl",
        "rounded-2xl bg-white shadow-xl shadow-navy-900/10",
        "border border-[var(--border-subtle)]",
        "p-2",
      )}
      role="search"
      aria-label="Search for services"
    >
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Service search */}
        <div className="flex-1 flex items-center gap-3 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors">
          <Search size={18} className="text-[var(--text-tertiary)] shrink-0" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What service do you need?"
            className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:outline-none"
            aria-label="Search for a service"
          />
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors sm:w-44 cursor-pointer">
          <MapPin size={16} className="text-emerald-500 shrink-0" aria-hidden="true" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-[var(--text-primary)] focus:outline-none cursor-pointer appearance-none pr-4"
            aria-label="Select location"
          >
            <option value="Dubai">Dubai</option>
            <option value="Abu Dhabi">Abu Dhabi</option>
            <option value="Sharjah">Sharjah</option>
          </select>
          <ChevronDown size={14} className="text-[var(--text-tertiary)] shrink-0 -ml-4 pointer-events-none" aria-hidden="true" />
        </div>

        {/* CTA */}
        <Button type="submit" variant="primary" size="lg" className="sm:w-auto w-full shrink-0 rounded-xl cursor-pointer">
          Search
        </Button>
      </div>

      {/* Popular searches */}
      <div className="flex items-center gap-2 flex-wrap px-2 pt-2 pb-1">
        <span className="text-xs text-[var(--text-disabled)]">Popular:</span>
        {POPULAR_SEARCHES.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => handleTagClick(term)}
            className={cn(
              "text-xs text-[var(--text-tertiary)] hover:text-navy-800",
              "hover:underline underline-offset-2",
              "transition-colors duration-150 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-navy-700 rounded",
            )}
          >
            {term}
          </button>
        ))}
      </div>
    </form>
  );
}

// ------ Trust Badges ----------------------------------------

function TrustBadges() {
  const badges = [
    {
      icon: <ShieldCheck size={16} className="text-emerald-500" />,
      text: "Verified Providers",
    },
    {
      icon: <Star size={16} className="text-gold-500 fill-gold-500" />,
      text: "4.9/5 Average Rating",
    },
    {
      icon: <Users size={16} className="text-navy-600" />,
      text: "50,000+ Happy Customers",
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
      {badges.map((badge) => (
        <div
          key={badge.text}
          className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]"
        >
          {badge.icon}
          <span>{badge.text}</span>
        </div>
      ))}
    </div>
  );
}

// ------ Floating Stat Cards ---------------------------------

function FloatingCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute hidden lg:flex items-center gap-3",
        "bg-white rounded-2xl shadow-xl border border-[var(--border-subtle)]",
        "px-4 py-3",
        className
      )}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

// ------ Hero Section ----------------------------------------

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center gradient-hero overflow-hidden pt-16"
      aria-labelledby="hero-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Top-right glow */}
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-emerald-100/40 blur-3xl" />
        {/* Bottom-left glow */}
        <div className="absolute -bottom-20 -left-40 h-[500px] w-[500px] rounded-full bg-navy-100/40 blur-3xl" />
        {/* Center grid lines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(var(--color-navy-900) 1px, transparent 1px), linear-gradient(90deg, var(--color-navy-900) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="container-section relative z-10 py-20 lg:py-32">
        <div className="max-w-3xl mx-auto lg:mx-0">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              Now serving Dubai, Abu Dhabi & Sharjah
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            id="hero-heading"
            className="text-display text-[var(--text-primary)] mb-6 text-balance"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0, 0, 0.2, 1] }}
          >
            Verified Professionals,{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-navy-900">On Demand</span>
              <span
                aria-hidden="true"
                className="absolute bottom-2 left-0 right-0 h-3 bg-gold-300/60 -z-0 rounded-sm"
              />
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg lg:text-xl text-[var(--text-secondary)] mb-10 max-w-xl text-balance leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0, 0, 0.2, 1] }}
          >
            Connect with background-checked, insured service professionals across the UAE. 
            Book instantly, pay securely, and get the job done right.
          </motion.p>

          {/* Search */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0, 0, 0.2, 1] }}
          >
            <HeroSearchBar />
          </motion.div>

          {/* Trust */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <TrustBadges />
          </motion.div>
        </div>
      </div>

      {/* Floating stat cards (desktop only) */}
      <FloatingCard className="right-[8%] top-[30%]">
        <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <ShieldCheck size={20} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-xs text-[var(--text-tertiary)]">Background verified</p>
          <p className="text-sm font-bold text-[var(--text-primary)]">3,200+ Providers</p>
        </div>
      </FloatingCard>

      <FloatingCard className="right-[14%] bottom-[28%]">
        <div className="flex -space-x-2 mr-1">
          {[
            { initials: "FA", color: "bg-navy-700" },
            { initials: "AK", color: "bg-emerald-600" },
            { initials: "ST", color: "bg-gold-600" },
          ].map(({ initials, color }) => (
            <div
              key={initials}
              className={cn("h-8 w-8 rounded-full ring-2 ring-white flex items-center justify-center text-white text-[10px] font-bold", color)}
            >
              {initials}
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={10} className="fill-gold-500 stroke-gold-500" />
            ))}
          </div>
          <p className="text-xs font-semibold text-[var(--text-primary)]">50,000+ Reviews</p>
        </div>
      </FloatingCard>
    </section>
  );
}
