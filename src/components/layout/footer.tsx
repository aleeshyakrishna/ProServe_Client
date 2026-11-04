"use client";

import { useI18n } from "@/i18n/I18nProvider";
import type { Dictionary } from "@/i18n/dictionaries";

const footerLabel = (t: Dictionary, label: string) =>
  (t.footer.labels as Record<string, string>)[label] ?? label;
import Link from "next/link";
import { Instagram, Twitter, Linkedin, Facebook, MapPin, Phone, Mail } from "lucide-react";
import { APP_NAME } from "@/constants";
import { cn } from "@/lib/utils";

// ------ Data ------------------------------------------------

const FOOTER_LINKS = {
  services: {
    title: "Services",
    links: [
      { label: "Home Cleaning", href: "/services/home-cleaning" },
      { label: "Plumbing", href: "/services/plumbing" },
      { label: "Electrical", href: "/services/electrical" },
      { label: "AC & HVAC", href: "/services/ac-hvac" },
      { label: "Beauty & Wellness", href: "/services/beauty-wellness" },
      { label: "All Services", href: "/services" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Become a Provider", href: "/providers/join" },
      { label: "Pricing", href: "/pricing" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Safety", href: "/safety" },
      { label: "Report an Issue", href: "/report" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Cookie Policy", href: "/legal/cookies" },
      { label: "Refund Policy", href: "/legal/refunds" },
    ],
  },
} as const;

const SOCIAL_LINKS = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/proserveae" },
  { icon: Twitter, label: "X (Twitter)", href: "https://twitter.com/proserveae" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/proserve-ae" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/proserveae" },
] as const;

// ------ Sub-components -------------------------------------

function FooterLogo() {
  const { t } = useI18n();
  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-md"
        aria-label={`${APP_NAME} homepage`}
      >
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-navy-900">
          <span className="text-white font-bold text-sm" aria-hidden="true">P</span>
        </div>
        <span className="font-bold text-lg text-white tracking-tight">
          Pro<span className="text-emerald-400">Serve</span>
        </span>
      </Link>
      <p className="text-sm text-navy-300 leading-relaxed max-w-xs">
        {t.footer.tagline}
      </p>

      {/* Contact Info */}
      <address className="not-italic space-y-2">
        <div className="flex items-center gap-2 text-sm text-navy-300">
          <MapPin size={14} className="shrink-0 text-emerald-400" aria-hidden="true" />
          <span>{t.footer.address}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-navy-300">
          <Phone size={14} className="shrink-0 text-emerald-400" aria-hidden="true" />
          <a href="tel:+97144000000" className="hover:text-white transition-colors">
            +971 4 400 0000
          </a>
        </div>
        <div className="flex items-center gap-2 text-sm text-navy-300">
          <Mail size={14} className="shrink-0 text-emerald-400" aria-hidden="true" />
          <a href="mailto:hello@proserve.ae" className="hover:text-white transition-colors">
            hello@proserve.ae
          </a>
        </div>
      </address>
    </div>
  );
}

function FooterNavSection({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-white uppercase tracking-widest">
        {title}
      </h3>
      <ul className="space-y-3" role="list">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-navy-300 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
            >
              {footerLabel(t, link.label)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="flex items-center gap-3">
      {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={cn(
            "flex items-center justify-center h-9 w-9 rounded-xl",
            "bg-navy-800 text-navy-300",
            "hover:bg-emerald-600 hover:text-white",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          )}
        >
          <Icon size={16} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

// ------ App Store Badges ------------------------------------

function AppStoreBadges() {
  const { t } = useI18n();
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-white uppercase tracking-widest">
        {t.footer.downloadApp}
      </h3>
      <div className="flex flex-col gap-3">
        {/* App Store */}
        <a
          href="#"
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-xl",
            "bg-navy-800 border border-navy-700",
            "hover:bg-navy-700 hover:border-navy-600",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          )}
          aria-label={t.footer.appStoreAria}
        >
          <svg className="h-6 w-6 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <div>
            <div className="text-[10px] text-navy-400 leading-none">Download on the</div>
            <div className="text-sm font-semibold text-white leading-tight">App Store</div>
          </div>
        </a>

        {/* Google Play */}
        <a
          href="#"
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-xl",
            "bg-navy-800 border border-navy-700",
            "hover:bg-navy-700 hover:border-navy-600",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          )}
          aria-label={t.footer.playAria}
        >
          <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3.18 23.76c.37.2.8.2 1.18.02L15.34 12 4.36.22C3.98.04 3.55.04 3.18.24 2.44.64 2 1.42 2 2.28V21.7c0 .87.44 1.67 1.18 2.06z" fill="#32BBFF"/>
            <path d="M20.54 10.37L17.4 8.6l-3.45 3.38 3.46 3.46 3.12-1.74c.9-.5.9-1.84.01-2.33z" fill="#FFD900"/>
            <path d="M4.36.22L15.34 12 4.36 23.78l10.98-11.56L4.36.22z" fill="#00F076"/>
            <path d="M4.36 23.78L15.34 12l2.06 2.06-10.98 11.56c-.02.01-.04.01-.06.16z" fill="#FF3A44"/>
          </svg>
          <div>
            <div className="text-[10px] text-navy-400 leading-none">Get it on</div>
            <div className="text-sm font-semibold text-white leading-tight">Google Play</div>
          </div>
        </a>
      </div>
    </div>
  );
}

// ------ Footer Root -----------------------------------------

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-navy-950 text-navy-300"
      role="contentinfo"
    >
      {/* Main footer grid */}
      <div className="container-section py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand column — spans 2 cols */}
          <div className="lg:col-span-2">
            <FooterLogo />
          </div>

          {/* Nav columns */}
          <FooterNavSection
            title={footerLabel(t, FOOTER_LINKS.services.title)}
            links={FOOTER_LINKS.services.links}
          />
          <FooterNavSection
            title={footerLabel(t, FOOTER_LINKS.company.title)}
            links={FOOTER_LINKS.company.links}
          />
          <FooterNavSection
            title={footerLabel(t, FOOTER_LINKS.support.title)}
            links={FOOTER_LINKS.support.links}
          />
          <AppStoreBadges />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-navy-800" />

      {/* Bottom bar */}
      <div className="container-section py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-navy-500 text-center sm:text-start">
            © {currentYear} {APP_NAME} Technologies LLC. {t.footer.rights}
          </p>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            {FOOTER_LINKS.legal.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-navy-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
              >
                {footerLabel(t, link.label)}
              </Link>
            ))}
          </div>

          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
