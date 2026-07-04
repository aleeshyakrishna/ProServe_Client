"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  title: string;
  subtitle?: string;
  categoryLabel?: string;
  items: FAQItem[];
  defaultExpandedIndex?: number | null;
  className?: string;
  bgClassName?: string;
}

export function FAQSection({
  title,
  subtitle,
  categoryLabel,
  items,
  defaultExpandedIndex = null,
  className,
  bgClassName
}: FAQSectionProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(defaultExpandedIndex);

  const toggleIndex = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      className={cn(
        "section-padding",
        bgClassName || "bg-white",
        className
      )}
      aria-labelledby="faq-section-title"
    >
      <div className="container-section max-w-3xl space-y-10">
        <div className="text-center space-y-3">
          {categoryLabel && (
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              {categoryLabel}
            </p>
          )}
          <h2 id="faq-section-title" className="text-[var(--text-primary)]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[var(--text-secondary)] text-sm">
              {subtitle}
            </p>
          )}
        </div>

        <div className="space-y-3" role="presentation">
          {items.map((item, i) => {
            const isOpen = activeIndex === i;
            return (
              <div
                key={i}
                className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleIndex(i)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-xs lg:text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-[var(--text-tertiary)] transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-200 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100 bg-white" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="p-5 pt-0 text-xs text-[var(--text-secondary)] border-t border-[var(--border-subtle)] leading-relaxed mt-4">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
