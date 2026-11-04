"use client";

import { useI18n } from "@/i18n/I18nProvider";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { PLATFORM_STATS } from "@/constants";
import { cn } from "@/lib/utils";

// ------ Animated Counter ------------------------------------

function AnimatedCounter({
  value,
  duration = 2000,
}: {
  value: string;
  duration?: number;
}) {
  // value is a display string like "50,000+" or "4.9/5"
  // We simply reveal it with a fade+scale, actual numeric counting
  // would require parsing the string which is fragile with arbitrary formats.
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {value}
    </motion.span>
  );
}

// ------ Stat Card -------------------------------------------

function StatCard({
  stat,
  index,
}: {
  stat: (typeof PLATFORM_STATS)[number];
  index: number;
}) {
  const { t } = useI18n();
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center text-center p-8 rounded-2xl",
        "border border-white/10",
        "bg-white/5 backdrop-blur-sm",
      )}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0, 0, 0.2, 1],
      }}
    >
      {/* Value */}
      <p
        className="text-display text-4xl lg:text-5xl font-bold text-white mb-2"
        aria-label={`${stat.value} ${t.stats.items[index]?.label ?? stat.label}`}
      >
        <AnimatedCounter value={stat.value} />
      </p>

      {/* Label */}
      <p className="text-base font-semibold text-white/90 mb-1">
        {t.stats.items[index]?.label ?? stat.label}
      </p>

      {/* Description */}
      <p className="text-sm text-navy-300">
        {t.stats.items[index]?.description ?? stat.description}
      </p>
    </motion.div>
  );
}

// ------ Section ---------------------------------------------

export function StatisticsSection() {
  const { t } = useI18n();
  return (
    <section
      className="section-padding gradient-navy relative overflow-hidden"
      aria-labelledby="statistics-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="container-section relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">
            {t.stats.eyebrow}
          </p>
          <h2
            id="statistics-heading"
            className="text-white text-display"
          >
            {t.stats.title}
          </h2>
          <p className="text-navy-300 text-base">
            {t.stats.subtitle}
          </p>
        </div>

        {/* Stats grid */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          aria-label={t.stats.listAria}
        >
          {PLATFORM_STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
