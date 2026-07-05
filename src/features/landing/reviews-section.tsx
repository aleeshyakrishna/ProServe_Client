"use client";

import * as React from "react";
import { Quote, Star, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Rating } from "@/components/common/rating";
import { TESTIMONIALS } from "@/constants";
import { formatDate } from "@/lib/utils";

// ------ Helpers ------------------------------------------------

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_GRADIENTS = [
  "from-navy-700 via-navy-800 to-navy-950",
  "from-emerald-600 via-emerald-700 to-emerald-900",
  "from-gold-500 via-gold-600 to-gold-800",
];

// ------ Testimonial Card ---------------------------------------

function TestimonialCard({
  review,
  position, // -1 = left, 0 = center, 1 = right
  index,
}: {
  review: (typeof TESTIMONIALS)[number];
  position: -1 | 0 | 1;
  index: number;
}) {
  const isCenter = position === 0;
  const initials = getInitials(review.customer.fullName);
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  return (
    <div
      className={cn(
        "relative flex flex-col gap-5 rounded-3xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] select-none",
        isCenter
          ? [
              "p-8 bg-navy-950 text-white shadow-2xl z-20 scale-100",
              "border border-white/10",
            ]
          : [
              "p-6 bg-white border border-[var(--border-subtle)] shadow-sm z-10 scale-95 opacity-70",
            ]
      )}
      aria-label={`Review by ${review.customer.fullName}`}
    >
      {/* Decorative blob for center card */}
      {isCenter && (
        <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
      )}

      {/* Top row: Quote icon + Rating */}
      <div className="flex items-start justify-between gap-2 relative z-10">
        <div
          className={cn(
            "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
            isCenter ? "bg-white/10" : "bg-emerald-50"
          )}
        >
          <Quote
            size={16}
            className={cn(
              isCenter ? "text-emerald-400 fill-emerald-400/30" : "text-emerald-600 fill-emerald-100"
            )}
          />
        </div>
        <Rating value={review.rating} size="sm" />
      </div>

      {/* Title */}
      <h3
        className={cn(
          "font-bold leading-snug relative z-10",
          isCenter ? "text-base text-white" : "text-sm text-[var(--text-primary)]"
        )}
      >
        &ldquo;{review.title}&rdquo;
      </h3>

      {/* Body */}
      <p
        className={cn(
          "leading-relaxed flex-1 relative z-10",
          isCenter ? "text-sm text-navy-200" : "text-xs text-[var(--text-secondary)]"
        )}
      >
        {review.body}
      </p>

      {/* Divider */}
      <div
        className={cn(
          "h-px",
          isCenter ? "bg-white/10" : "bg-[var(--border-subtle)]"
        )}
      />

      {/* Author */}
      <div className="flex items-center gap-3 relative z-10">
        <div
          className={cn(
            "rounded-xl flex items-center justify-center font-bold shrink-0 shadow-md",
            `bg-gradient-to-br ${gradient}`,
            isCenter ? "h-11 w-11 text-sm text-white" : "h-9 w-9 text-xs text-white"
          )}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p
            className={cn(
              "font-bold truncate",
              isCenter ? "text-sm text-white" : "text-xs text-[var(--text-primary)]"
            )}
          >
            {review.customer.fullName}
          </p>
          <div className={cn("flex items-center gap-1 mt-0.5")}>
            <CheckCircle2
              size={10}
              className={isCenter ? "text-emerald-400" : "text-emerald-500"}
            />
            <p
              className={cn(
                "text-[10px] font-semibold",
                isCenter ? "text-navy-300" : "text-[var(--text-tertiary)]"
              )}
            >
              Verified · {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------ Main Section -------------------------------------------

export function ReviewsSection() {
  const total = TESTIMONIALS.length;
  const [current, setCurrent] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const navigate = React.useCallback(
    (dir: 1 | -1) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent((c) => (c + dir + total) % total);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating, total]
  );

  // Auto-advance every 5 s, resetting on slide changes
  React.useEffect(() => {
    const t = setInterval(() => navigate(1), 5000);
    return () => clearInterval(t);
  }, [current, navigate]);

  // Build the 3 visible indices: prev, center, next
  const prev = (current - 1 + total) % total;
  const next = (current + 1) % total;
  const visible = [
    { review: TESTIMONIALS[prev], position: -1 as const, index: prev },
    { review: TESTIMONIALS[current], position: 0 as const, index: current },
    { review: TESTIMONIALS[next], position: 1 as const, index: next },
  ];

  return (
    <section
      className="section-padding overflow-hidden bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)]"
      aria-labelledby="reviews-heading"
    >
      <div className="container-section max-w-6xl space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold select-none">
            <Star size={11} className="fill-amber-500 text-amber-500" />
            <span>4.9 / 5 &nbsp;·&nbsp; 50,000+ Happy Customers</span>
          </div>
          <h2 id="reviews-heading" className="text-[var(--text-primary)]">
            What Our Customers Say
          </h2>
          <p className="text-[var(--text-secondary)] text-sm">
            Verified reviews from Dubai, Abu Dhabi, and Sharjah residents — unfiltered and authentic.
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
        >
          {/* 3-card layout */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.18fr_1fr] gap-4 items-center">
            {visible.map(({ review, position, index }) => (
              <TestimonialCard
                key={position}
                review={review}
                position={position}
                index={index}
              />
            ))}
          </div>

          {/* Navigation row */}
          <div className="flex items-center justify-center gap-4 mt-10">
            {/* Prev button */}
            <button
              onClick={() => navigate(-1)}
              className={cn(
                "h-10 w-10 rounded-full border flex items-center justify-center transition-all duration-200",
                "border-[var(--border-default)] bg-white text-[var(--text-secondary)]",
                "hover:bg-navy-950 hover:text-white hover:border-navy-950 hover:scale-105",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700"
              )}
              aria-label="Previous review"
            >
              <ChevronLeft size={17} />
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Review navigation">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Go to review ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700",
                    i === current
                      ? "h-2.5 w-8 bg-navy-950"
                      : "h-2.5 w-2.5 bg-[var(--border-strong)] hover:bg-[var(--text-disabled)]"
                  )}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={() => navigate(1)}
              className={cn(
                "h-10 w-10 rounded-full border flex items-center justify-center transition-all duration-200",
                "border-[var(--border-default)] bg-white text-[var(--text-secondary)]",
                "hover:bg-navy-950 hover:text-white hover:border-navy-950 hover:scale-105",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700"
              )}
              aria-label="Next review"
            >
              <ChevronRight size={17} />
            </button>
          </div>

          {/* Counter */}
          <p className="text-center text-[10px] text-[var(--text-disabled)] mt-3 font-semibold tracking-widest uppercase">
            {current + 1} of {total} reviews
          </p>
        </div>
      </div>
    </section>
  );
}
