"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Lock,
  ThumbsUp,
  Users,
  Compass,
  ArrowRight,
  Heart,
  TrendingUp,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_STATS } from "@/constants";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { buttonVariants } from "@/components/ui/button";

// ------ Types & Constants ----------------------------------

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Uncompromising Trust",
    desc: "We rigorously verify credentials and monitor ratings to maintain a safe, licensed, and transparent marketplace."
  },
  {
    icon: Award,
    title: "Quality Standard",
    desc: "We partner with highly skilled technicians who are committed to exceptional workmanship and clear results."
  },
  {
    icon: Heart,
    title: "Customer First",
    desc: "Your satisfaction is our focus. We guarantee easy booking, clear pricing, and dedicated post-service assistance."
  },
  {
    icon: TrendingUp,
    title: "Partner Empowerment",
    desc: "We provide local service businesses and professionals with the scheduling and digital tools to scale their business."
  }
];

const STRENGTHS = [
  {
    icon: ShieldCheck,
    title: "100% Vetted Professionals",
    desc: "Every provider undergoes background screening, certificate reviews, and face-to-face onboarding checks.",
    color: "bg-navy-50 text-navy-800"
  },
  {
    icon: ThumbsUp,
    title: "Satisfaction Guarantee",
    desc: "We stand behind the work. If you're not completely happy with the service execution, we'll make it right.",
    color: "bg-emerald-50 text-emerald-600"
  },
  {
    icon: Lock,
    title: "Secure Escrow Payments",
    desc: "Your card is charged only after a booking is signed off. No hidden fees, cash hassles, or prepayment risks.",
    color: "bg-gold-50 text-gold-600"
  },
  {
    icon: Users,
    title: "Dedicated Partner Support",
    desc: "Our customer success and technical operations teams are available 7 days a week to support you.",
    color: "bg-navy-50 text-navy-800"
  }
];

// ------ Main Component -------------------------------------

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main id="main-content" className="flex-1 pt-16 lg:pt-18 bg-[var(--bg-primary)]">
        {/* ==========================================
            1. HERO SECTION
            ========================================== */}
        <section
          className="relative py-20 lg:py-28 overflow-hidden gradient-hero text-center"
          aria-labelledby="hero-title"
        >
          <div className="container-section flex flex-col items-center max-w-4xl relative z-10 gap-6">
            <Badge variant="secondary" className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 select-none animate-fade-in">
              Connecting the UAE Since 2024
            </Badge>

            <h1
              id="hero-title"
              className="text-display font-extrabold text-[var(--text-primary)] tracking-tight leading-none text-balance"
            >
              We Make Home Services <br />
              <span className="text-emerald-600">Simple & Reliable.</span>
            </h1>

            <p className="text-[var(--text-secondary)] text-base lg:text-lg max-w-2xl text-balance">
              ProServe is the UAE&apos;s leading on-demand service ecosystem, bringing certified cleaners, technicians, plumbers, and beauty therapists directly to your doorstep.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <Link
                href="/services"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "font-bold text-xs shadow-lg hover:shadow-xl transition-all"
                )}
              >
                Explore Our Services
                <ArrowRight size={14} className="ml-1" />
              </Link>
              <Link
                href="/providers/join"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "font-bold text-xs"
                )}
              >
                Become a Partner
              </Link>
            </div>
          </div>
        </section>

        {/* ==========================================
            2. OUR STORY & VISION
            ========================================== */}
        <section className="section-padding bg-white border-y border-[var(--border-subtle)]" aria-labelledby="story-title">
          <div className="container-section max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Visual element */}
            <div className="flex flex-col gap-6">
              <div className="space-y-3">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Our Story</p>
                <h2 id="story-title" className="text-[var(--text-primary)]">Building Trust in the UAE Gig Economy</h2>
              </div>
              <p className="text-xs lg:text-sm text-[var(--text-secondary)] leading-relaxed">
                ProServe was founded in Dubai to address a major challenge in the domestic services industry: finding trusted, licensed, and consistently reliable professionals.
              </p>
              <p className="text-xs lg:text-sm text-[var(--text-secondary)] leading-relaxed">
                By designing a rigorous vetting onboarding flow and integrating cashless transactions, we created a safe, transparent platform. Today, we empower hundreds of local businesses and connect thousands of households across Dubai, Abu Dhabi, and Sharjah.
              </p>
            </div>

            {/* Mission / Vision panel */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 space-y-3 shadow-sm">
                <h3 className="text-xs lg:text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Compass size={18} className="text-navy-700" />
                  Our Mission
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  To elevate home and commercial service standard by matching verified service experts with customers instantly, offering complete convenience, transparent pricing, and guaranteed satisfaction.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 space-y-3 shadow-sm">
                <h3 className="text-xs lg:text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Eye size={18} className="text-emerald-600" />
                  Our Vision
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  To become the ultimate, most trusted domestic services gateway in the Middle East, serving as a catalyst for service quality improvement and independent service provider business growth.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ==========================================
            3. WHY CHOOSE US
            ========================================== */}
        <section className="section-padding bg-[var(--bg-secondary)]" aria-labelledby="strengths-title">
          <div className="container-section text-center max-w-5xl space-y-12">
            <div className="space-y-3 max-w-xl mx-auto">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Our Guarantees</p>
              <h2 id="strengths-title" className="text-[var(--text-primary)]">Why Customers Book ProServe</h2>
              <p className="text-[var(--text-secondary)] text-sm">We maintain the highest standards of safety, quality, and payment security.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {STRENGTHS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center p-6 bg-white rounded-2xl border border-[var(--border-subtle)] hover:shadow-md transition-shadow gap-4 shadow-sm"
                  >
                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0", item.color)}>
                      <Icon size={24} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xs lg:text-sm font-bold text-[var(--text-primary)]">{item.title}</h3>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==========================================
            4. PLATFORM STATISTICS (IMPACT)
            ========================================== */}
        <section className="py-12 bg-navy-950 text-white border-y border-[var(--border-subtle)]" aria-label="Platform impact statistics">
          <div className="container-section">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {PLATFORM_STATS.map((stat, i) => (
                <div key={i} className="space-y-1.5">
                  <p className="text-3xl md:text-4xl font-extrabold text-emerald-400 tracking-tight leading-none">
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm font-semibold text-white/95">
                    {stat.label}
                  </p>
                  <p className="text-[10px] text-white/60 font-medium">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            5. CORE VALUES
            ========================================== */}
        <section className="section-padding bg-white" aria-labelledby="values-title">
          <div className="container-section max-w-5xl space-y-12">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Our Foundations</p>
              <h2 id="values-title" className="text-[var(--text-primary)]">The Values We Live By</h2>
              <p className="text-[var(--text-secondary)] text-sm">Our culture is driven by transparency, quality, and service excellence.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((val, i) => {
                const Icon = val.icon;
                return (
                  <div key={i} className="flex flex-col p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] gap-4 hover:border-emerald-100 transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-navy-900 text-white flex items-center justify-center shrink-0">
                      <Icon size={20} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xs lg:text-sm font-bold text-[var(--text-primary)] leading-snug">{val.title}</h3>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{val.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==========================================
            6. CALL TO ACTION (CTA)
            ========================================== */}
        <section className="section-padding bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]" aria-label="About us onboarding actions">
          <div className="container-section">
            <div className="rounded-3xl gradient-navy text-white p-8 md:p-12 lg:p-16 text-center max-w-4xl mx-auto relative overflow-hidden shadow-2xl flex flex-col items-center gap-6">
              <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 h-40 w-40 bg-gold-500/10 rounded-full blur-3xl" />

              <h2 className="text-display font-extrabold text-white text-balance leading-tight">
                Ready to experience the ProServe difference?
              </h2>

              <p className="text-navy-100 text-sm lg:text-base max-w-xl mx-auto text-balance">
                Book a verified expert today or sign up to grow your domestic services business.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <Link
                  href="/services"
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold text-xs bg-emerald-50 text-navy-900 hover:bg-white transition-colors shadow-lg cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  )}
                >
                  Book a Service
                </Link>
                <Link
                  href="/providers/join"
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold text-xs border border-white/20 text-white hover:bg-white/10 transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  )}
                >
                  Apply as a Partner
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
