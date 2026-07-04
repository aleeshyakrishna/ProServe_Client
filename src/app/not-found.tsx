"use client";

import * as React from "react";
import Link from "next/link";
import { Compass, Home, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function NotFoundPage() {
  return (
    <>
      <Navbar />

      <main id="main-content" className="flex-grow flex flex-col justify-center items-center gradient-hero text-center py-20 lg:py-32 min-h-[75vh]">
        <div className="container-section flex flex-col items-center max-w-lg gap-6">
          
          {/* Animated visual element */}
          <div 
            className="flex items-center justify-center h-24 w-24 rounded-3xl bg-emerald-50 text-emerald-600 shadow-md animate-pulse"
            aria-hidden="true"
          >
            <Compass 
              size={48} 
              className="animate-spin" 
              style={{ animationDuration: "25s", animationTimingFunction: "linear" }} 
            />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-display font-extrabold text-[var(--text-primary)] text-6xl md:text-8xl select-none leading-none">
              404
            </h1>
            <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)]">
              Oops! Page Not Found
            </h2>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed max-w-md text-balance mx-auto">
              We couldn&apos;t find the page you are looking for. It might have been moved, deleted, or never existed in the first place.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "primary", size: "md" }),
                "flex items-center gap-2"
              )}
            >
              <Home size={16} aria-hidden="true" />
              Back to Home
            </Link>

            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.history.back();
                }
              }}
              className={cn(
                buttonVariants({ variant: "outline", size: "md" }),
                "flex items-center gap-2 cursor-pointer"
              )}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Go Back
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
