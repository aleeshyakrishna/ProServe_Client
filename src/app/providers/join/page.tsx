"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  Wallet,
  Headphones,
  CheckCircle,
  FileCheck,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FAQSection } from "@/components/common/FAQSection";
import { buttonVariants } from "@/components/ui/button";

// ------ Types & Constants ----------------------------------

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How long does the onboarding approval process take?",
    answer: "Once you create your provider account and upload your trade license documents, our partner team will review your application and background check results. This typically takes 3 to 5 business days."
  },
  {
    question: "Are there any registration or monthly listing fees?",
    answer: "No, ProServe does not charge any upfront signup fees or monthly listing subscriptions. We only charge a small platform commission fee on successfully completed and paid bookings."
  },
  {
    question: "How and when do I get paid?",
    answer: "Customer payments are collected securely online when a job is completed. ProServe runs payout direct deposits to your registered UAE bank account every Monday for all jobs completed in the previous week."
  },
  {
    question: "Do I need to be a registered company to apply?",
    answer: "We accept applications from licensed home service companies (corporate trade licenses) as well as individual freelance professionals who hold valid professional permits/visas in the UAE."
  }
];

const BENEFITS = [
  {
    icon: Users,
    title: "Steady Customer Flow",
    desc: "Gain access to thousands of active UAE households looking for home services without spending money on marketing or ads.",
    color: "bg-navy-50 text-navy-800"
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    desc: "Be your own boss. Define your work areas, set your daily shifts, and toggle your availability status on or off instantly.",
    color: "bg-emerald-50 text-emerald-600"
  },
  {
    icon: Wallet,
    title: "Guaranteed Payments",
    desc: "Payments are captured when booking and released directly to your bank account weekly. Never worry about collection hassles.",
    color: "bg-gold-50 text-gold-600"
  },
  {
    icon: Headphones,
    title: "Partner Support Staff",
    desc: "Our dedicated support team is available 7 days a week to assist you with dispatcher, technician, and technical platform issues.",
    color: "bg-navy-50 text-navy-800"
  }
];

const ELIGIBILITY = [
  "Valid UAE Trade License (for corporate partners) or Freelance Permit",
  "Active UAE Corporate or Individual Bank Account",
  "Valid Emirates ID / Residency Visa of the representative",
  "Minimum 1 year of professional experience in your service category",
  "Clear criminal record background check"
];

// ------ Main Component -------------------------------------

export default function BecomeProviderPage() {
  return (
    <>
      <Navbar />

      <main id="main-content" className="flex-grow pt-16 lg:pt-18 bg-[var(--bg-primary)]">
        {/* ==========================================
            1. HERO SECTION
            ========================================== */}
        <section
          className="relative py-20 lg:py-28 overflow-hidden gradient-hero text-center"
          aria-labelledby="hero-title"
        >
          <div className="container-section flex flex-col items-center max-w-4xl relative z-10 gap-6">
            <Badge variant="secondary" className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 select-none animate-fade-in">
              ProServe Partner Network
            </Badge>

            <h1
              id="hero-title"
              className="text-display font-extrabold text-[var(--text-primary)] tracking-tight leading-none text-balance"
            >
              Grow Your Business. <br />
              <span className="text-emerald-600">Work on Your Terms.</span>
            </h1>

            <p className="text-[var(--text-secondary)] text-base lg:text-lg max-w-2xl text-balance">
              Join the UAE&apos;s leading platform for verified home service professionals. Create your partner account, connect with clients, and secure weekly direct payouts.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <Link
                href="/register?role=provider"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "font-bold text-xs shadow-lg hover:shadow-xl transition-all"
                )}
              >
                Apply Now
                <ArrowRight size={14} className="ml-1" />
              </Link>
              <a
                href="#how-it-works-section"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "font-bold text-xs"
                )}
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* ==========================================
            2. WHY JOIN US (BENEFITS)
            ========================================== */}
        <section className="section-padding bg-white border-y border-[var(--border-subtle)]" aria-labelledby="why-join-title">
          <div className="container-section text-center max-w-5xl space-y-12">
            <div className="space-y-3 max-w-xl mx-auto">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Partner Perks</p>
              <h2 id="why-join-title" className="text-[var(--text-primary)]">Why Join the ProServe Platform?</h2>
              <p className="text-[var(--text-secondary)] text-sm">We provide you with all the digital infrastructure and customer acquisition tools to scale your business.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {BENEFITS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] hover:shadow-md transition-shadow gap-4"
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
            3. HOW IT WORKS TIMELINE
            ========================================== */}
        <section id="how-it-works-section" className="section-padding bg-[var(--bg-secondary)]" aria-labelledby="works-title">
          <div className="container-section text-center max-w-5xl space-y-12">
            <div className="space-y-3 max-w-xl mx-auto">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Workflow</p>
              <h2 id="works-title" className="text-[var(--text-primary)]">Your Path to Onboarding</h2>
              <p className="text-[var(--text-secondary)] text-sm">We make it simple to get vetted, listed, and matched with clients.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {[
                { step: "01", title: "Register Account", desc: "Create your partner account and select the Service Provider profile type." },
                { step: "02", title: "Submit Documents", desc: "Upload your visa, trade license, and banking details in the partner portal." },
                { step: "03", title: "Setup Profile", desc: "Define your service categories, operational locations, and pricing." },
                { step: "04", title: "Start Receiving", desc: "Receive live booking notifications from clients and grow your business." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center p-6 bg-white rounded-2xl border border-[var(--border-subtle)] relative gap-4 shadow-sm">
                  <div className="absolute top-4 right-4 text-xs font-extrabold text-navy-100">{item.step}</div>
                  <div className="h-9 w-9 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold text-xs select-none">
                    {i + 1}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-[var(--text-primary)]">{item.title}</h3>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            4. ELIGIBILITY REQUIREMENTS
            ========================================== */}
        <section className="section-padding bg-white border-b border-[var(--border-subtle)]" aria-labelledby="eligibility-title">
          <div className="container-section max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none font-semibold">
                Partner Guidelines
              </Badge>
              <h2 id="eligibility-title" className="text-[var(--text-primary)]">Who Can Apply?</h2>
              <p className="text-xs lg:text-sm text-[var(--text-secondary)] leading-relaxed">
                To guarantee safe, high-quality, and reliable service delivery across the United Arab Emirates, all partners must meet our core verification qualifications and regulatory compliance standards.
              </p>
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex items-start gap-3">
                <FileCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-semibold">
                  Required Documents: Trade License (for companies), Emirates ID, Passport Copy, Bank Account Statement.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-4 shadow-sm">
              <h3 className="text-xs lg:text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-500" />
                Eligibility Criteria
              </h3>
              <ul className="space-y-3" role="list">
                {ELIGIBILITY.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] leading-normal">
                    <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ==========================================
            5. FAQ SECTION
            ========================================== */}
        <FAQSection
          title="Onboarding FAQs"
          subtitle="Answers to common questions from aspiring ProServe partners."
          categoryLabel="Help Desk"
          items={FAQS}
          bgClassName="bg-white border-b border-[var(--border-subtle)]"
        />

        {/* ==========================================
            6. FINAL CALL TO ACTION (CTA)
            ========================================== */}
        <section className="section-padding bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]" aria-label="Partner registration wrap-up">
          <div className="container-section">
            <div className="rounded-3xl gradient-navy text-white p-8 md:p-12 lg:p-16 text-center max-w-4xl mx-auto relative overflow-hidden shadow-2xl flex flex-col items-center gap-6">
              <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 h-40 w-40 bg-gold-500/10 rounded-full blur-3xl" />

              <h2 className="text-display font-extrabold text-white text-balance leading-tight">
                Ready to grow your home service business?
              </h2>

              <p className="text-navy-100 text-sm lg:text-base max-w-xl mx-auto text-balance">
                Create your provider account today and get listed on Dubai&apos;s leading professional booking application.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <Link
                  href="/register?role=provider"
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold text-xs bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-lg cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  )}
                >
                  Create Provider Account
                </Link>
                <a
                  href="mailto:support@proserve.ae"
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold text-xs border border-white/20 text-white hover:bg-white/10 transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  )}
                >
                  Contact Partner Support
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
