"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Star, Users, ArrowLeft, MapPin, BadgeCheck, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { APP_NAME, TESTIMONIALS } from "@/constants";

// ------ Left Showcase Data ----------------------------------

const SHOWCASE_STATS = [
  { label: "Happy Customers", value: "50,000+", icon: Users },
  { label: "Verified Providers", value: "3,200+", icon: ShieldCheck },
  { label: "Average Rating", value: "4.9/5", icon: Star },
];

const CITIES = ["Dubai", "Abu Dhabi", "Sharjah"];

const TRUST_BADGES = [
  "Background-checked providers",
  "Secure AED payments",
  "24/7 customer support",
];

// A real social-proof quote, sourced from the shared testimonials seed.
const FEATURED_QUOTE = TESTIMONIALS[0];

// ------ AuthLayout Component ---------------------------------

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[var(--bg-secondary)] font-sans">
      {/* 1. Left Panel — Premium UAE Showcase */}
      <div className="relative w-full lg:w-[45%] flex flex-col justify-between gradient-navy text-white p-8 lg:p-12 overflow-hidden shrink-0">
        {/* Background decorations — mirrors the marketing hero */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-gold-500/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Top: Branding logo + back link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-md"
            aria-label={`Go to ${APP_NAME} homepage`}
          >
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/10 group-hover:bg-emerald-600 transition-colors">
              <span className="text-white font-bold text-sm" aria-hidden="true">P</span>
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              Pro<span className="text-emerald-400">Serve</span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-navy-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to home
          </Link>
        </div>

        {/* Center: Branding Copy */}
        <div className="relative z-10 my-12 lg:my-auto max-w-lg space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
          >
            {/* Eyebrow — matches the hero "Now serving..." pill */}
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/12 text-[11px] font-semibold text-emerald-300 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              Now serving Dubai, Abu Dhabi &amp; Sharjah
            </span>

            <h1 className="text-display text-[2rem] sm:text-4xl lg:text-5xl font-bold leading-tight text-white mb-4 text-balance break-words">
              Find Trusted{" "}
              {/* Gold underline accent — mirrors the hero heading treatment */}
              <span className="relative inline-block">
                <span className="relative z-10 text-gold-300 font-medium">Professionals</span>
                <span
                  aria-hidden="true"
                  className="absolute bottom-1.5 left-0 right-0 h-2.5 bg-gold-400/40 -z-0 rounded-sm"
                />
              </span>{" "}
              Across the UAE
            </h1>

            <p className="text-sm lg:text-base text-navy-300 leading-relaxed text-balance">
              Book verified, background-checked specialists for cleaning, AC &amp; HVAC, electrical, plumbing, renovations, beauty, and wellness — instantly, and pay securely in AED.
            </p>
          </motion.div>

          {/* Cities served */}
          <motion.div
            className="flex flex-wrap items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {CITIES.map((city) => (
              <span
                key={city}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-navy-200"
              >
                <MapPin size={12} className="text-emerald-400 shrink-0" aria-hidden="true" />
                {city}
              </span>
            ))}
          </motion.div>

          {/* Social-proof testimonial card — glass, like the hero floating cards */}
          <motion.figure
            className="glass rounded-2xl p-5 space-y-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1" aria-label={`Rated ${FEATURED_QUOTE.rating} out of 5`}>
                {Array.from({ length: FEATURED_QUOTE.rating }).map((_, i) => (
                  <Star key={i} size={13} className="fill-gold-400 stroke-gold-400" aria-hidden="true" />
                ))}
              </div>
              <Quote size={20} className="text-white/20 shrink-0" aria-hidden="true" />
            </div>
            <blockquote className="text-sm text-navy-100 leading-relaxed text-balance">
              &ldquo;{FEATURED_QUOTE.body}&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-2.5 pt-1">
              <span className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                {getInitials(FEATURED_QUOTE.customer.fullName)}
              </span>
              <span className="text-xs">
                <span className="block font-semibold text-white leading-tight">
                  {FEATURED_QUOTE.customer.fullName}
                </span>
                <span className="inline-flex items-center gap-1 text-navy-300">
                  <BadgeCheck size={11} className="text-emerald-400 shrink-0" aria-hidden="true" />
                  Verified customer
                </span>
              </span>
            </figcaption>
          </motion.figure>

          {/* Stats grid */}
          <motion.div
            className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            {SHOWCASE_STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Icon size={14} aria-hidden="true" className="shrink-0" />
                    <span className="text-sm font-bold text-white tracking-tight">{stat.value}</span>
                  </div>
                  <p className="text-[10px] text-navy-400 leading-tight font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom: Trust Strip */}
        <div className="relative z-10 hidden lg:flex items-center justify-between border-t border-white/10 pt-6">
          <div className="flex flex-wrap items-center gap-6">
            {TRUST_BADGES.map((badge) => (
              <div key={badge} className="flex items-center gap-1.5 text-xs text-navy-300">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Right Panel — Form Card Container */}
      <main
        className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-[var(--bg-secondary)]"
        id="auth-container"
      >
        <motion.div
          className="w-full max-w-md bg-[var(--surface-card)] rounded-3xl border border-[var(--border-subtle)] shadow-xl shadow-navy-900/5 p-8 lg:p-10"
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0, 0, 0.2, 1] }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

// ------ Helpers ---------------------------------------------

function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
