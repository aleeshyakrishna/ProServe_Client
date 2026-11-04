"use client";

import { useI18n } from "@/i18n/I18nProvider";
import Link from "next/link";
import { ArrowRight, Smartphone, Star, ShieldCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ------ CTA Section -----------------------------------------

export function CTASection() {
  const { t } = useI18n();
  return (
    <section
      className="section-padding"
      aria-labelledby="cta-heading"
    >
      <div className="container-section">
        {/* Main CTA Block */}
        <div
          className={cn(
            "relative rounded-3xl overflow-hidden",
            "gradient-navy",
            "p-10 lg:p-16",
          )}
        >
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left: Text */}
            <div className="flex-1 text-center lg:text-left space-y-6 max-w-xl">
              {/* Pill */}
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white/90">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                {t.cta.eyebrow}
              </span>

              <h2
                id="cta-heading"
                className="text-display text-white"
              >
                {t.cta.titleStart}{" "}
                <span className="text-gold-400">{t.cta.titleHighlight}</span>
              </h2>

              <p className="text-navy-300 text-base leading-relaxed">
                {t.cta.subtitle}
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                {[
                  { icon: <ShieldCheck size={14} className="text-emerald-400" />, text: t.cta.badges.verified },
                  { icon: <Star size={14} className="text-gold-400 fill-gold-400" />, text: t.cta.badges.rating },
                  { icon: <ShieldCheck size={14} className="text-emerald-400" />, text: t.cta.badges.secure },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-sm text-navy-300">
                    {icon}
                    {text}
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ variant: "accent", size: "lg" }),
                    "w-full sm:w-auto rounded-xl flex items-center justify-center gap-1.5"
                  )}
                >
                  {t.cta.getStarted}
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link
                  href="/services"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "w-full sm:w-auto rounded-xl border-white/20 text-white hover:bg-white/10 hover:border-white/30 text-center"
                  )}
                >
                  {t.cta.browse}
                </Link>
              </div>
            </div>

            {/* Right: Provider CTA */}
            <div
              className={cn(
                "w-full lg:w-80 rounded-2xl",
                "bg-white/8 border border-white/12 backdrop-blur-sm",
                "p-6 space-y-5",
              )}
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
                  {t.cta.proTitle}
                </h3>
                <p className="text-sm text-navy-300">
                  {t.cta.proSubtitle}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  "Set your own schedule & prices",
                  "Get new customers automatically",
                  "Fast, secure weekly payouts",
                  "Dedicated provider support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-navy-200">
                    <div className="h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <Link
                href="/providers/join"
                className={cn(
                  buttonVariants({ variant: "outline", size: "md" }),
                  "w-full text-center rounded-xl border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                )}
              >
                {t.cta.joinProvider}
              </Link>
            </div>
          </div>
        </div>

        {/* App Download Strip */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
          <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
            <Smartphone size={16} aria-hidden="true" />
            {t.cta.mobile}
          </div>
          <div className="flex items-center gap-3">
            {/* App Store */}
            <a
              href="#"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl",
                "border border-[var(--border-default)]",
                "text-sm font-medium text-[var(--text-secondary)]",
                "hover:bg-[var(--bg-secondary)] transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700",
              )}
              aria-label={t.footer.appStoreAria}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              App Store
            </a>

            {/* Google Play */}
            <a
              href="#"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl",
                "border border-[var(--border-default)]",
                "text-sm font-medium text-[var(--text-secondary)]",
                "hover:bg-[var(--bg-secondary)] transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700",
              )}
              aria-label={t.footer.playAria}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3.18 23.76c.37.2.8.2 1.18.02L15.34 12 4.36.22C3.98.04 3.55.04 3.18.24 2.44.64 2 1.42 2 2.28V21.7c0 .87.44 1.67 1.18 2.06z" fill="#32BBFF"/>
                <path d="M20.54 10.37L17.4 8.6l-3.45 3.38 3.46 3.46 3.12-1.74c.9-.5.9-1.84.01-2.33z" fill="#FFD900"/>
                <path d="M4.36.22L15.34 12 4.36 23.78l10.98-11.56L4.36.22z" fill="#00F076"/>
                <path d="M4.36 23.78L15.34 12l2.06 2.06-10.98 11.56-.06.16z" fill="#FF3A44"/>
              </svg>
              Google Play
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
