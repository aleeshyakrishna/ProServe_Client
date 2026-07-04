"use client";

import * as React from "react";
import { Search, CalendarCheck, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ------ Steps Data ------------------------------------------

const STEPS = [
  {
    num: "01",
    icon: Search,
    title: "Search & Compare",
    description:
      "Browse hundreds of verified professionals in your area. Filter by category, price, ratings, and real-time availability.",
    accent: "#10b981", // emerald
    glow: "shadow-emerald-500/30",
    border: "border-emerald-500/30",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    numColor: "text-emerald-500/50",
  },
  {
    num: "02",
    icon: CalendarCheck,
    title: "Book in 60 Seconds",
    description:
      "Pick your time slot and confirm instantly — no phone calls, no back-and-forth. Your booking is secured right away.",
    accent: "#6366f1", // indigo
    glow: "shadow-indigo-500/30",
    border: "border-indigo-500/30",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    numColor: "text-indigo-500/50",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "Get Done. Pay Safely.",
    description:
      "Your vetted pro arrives on time. Payment is held securely and only released once you approve the completed work.",
    accent: "#f59e0b", // amber
    glow: "shadow-amber-500/30",
    border: "border-amber-500/30",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    numColor: "text-amber-500/50",
  },
] as const;

// ------ Section Component -----------------------------------

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="section-padding relative overflow-hidden bg-navy-950"
      aria-labelledby="how-it-works-heading"
    >
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 h-96 w-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-amber-500/3 rounded-full blur-3xl" />
      </div>

      <div className="container-section max-w-6xl relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-white/60 uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Simple Process
          </div>
          <h2 id="how-it-works-heading" className="text-white">
            How ProServe Works
          </h2>
          <p className="text-navy-300 text-sm leading-relaxed">
            From search to completion in three simple steps — we handle the vetting so you can enjoy the results.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative group">
                {/* Connector arrow between cards (desktop) */}
                {idx < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center h-8 w-8">
                    <ArrowRight size={16} className="text-white/20" />
                  </div>
                )}

                <div
                  className={cn(
                    "relative h-full flex flex-col gap-6 p-7 rounded-3xl border",
                    "bg-white/[0.03] backdrop-blur-sm",
                    step.border,
                    "transition-all duration-300",
                    `hover:shadow-xl ${step.glow} hover:bg-white/[0.06] hover:-translate-y-1`
                  )}
                >
                  {/* Decorative glow orb */}
                  <div
                    className="absolute -top-4 -right-4 h-20 w-20 rounded-full blur-2xl opacity-40 pointer-events-none"
                    style={{ background: step.accent }}
                  />

                  {/* Step number (huge background) */}
                  <span
                    className={cn(
                      "absolute bottom-4 right-5 text-7xl font-black leading-none select-none pointer-events-none",
                      step.numColor
                    )}
                    aria-hidden="true"
                  >
                    {step.num}
                  </span>

                  {/* Icon */}
                  <div
                    className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 relative z-10",
                      step.iconBg
                    )}
                  >
                    <Icon size={22} className={step.iconColor} />
                  </div>

                  {/* Text */}
                  <div className="space-y-2 relative z-10 flex-1">
                    <h3 className="text-base font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm text-navy-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee strip */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10">
          {/* Glass base */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-navy-900/80 to-indigo-950/80" />
          <div className="absolute inset-0 bg-white/[0.02]" />
          {/* Glow accents */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-48 w-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-48 w-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-7 lg:p-8">
            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  ProServe Guarantee
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                100% Satisfaction or Your Money Back
              </h3>
              <p className="text-sm text-navy-300 max-w-lg">
                Not happy with the result? We&apos;ll arrange a re-do at no extra cost — or issue a full refund. No questions asked.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex -space-x-2.5">
                {["FA", "AK", "MB"].map((initials) => (
                  <div
                    key={initials}
                    className="h-9 w-9 rounded-full ring-2 ring-navy-950 bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center text-[9px] font-bold text-white select-none"
                    aria-hidden="true"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="h-3 w-3 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[10px] text-navy-300 mt-0.5 font-semibold whitespace-nowrap">
                  4.9/5 · 50,000+ customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
