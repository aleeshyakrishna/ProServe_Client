"use client";

import { useEffect, useState } from "react";

export function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Add scroll lock on body
    document.body.style.overflow = "hidden";

    // Enforce a smaller minimum duration for a quick, clean load
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      document.body.style.overflow = "";

      const finishTimer = setTimeout(() => {
        setIsFinished(true);
      }, 500);

      return () => clearTimeout(finishTimer);
    }, 850); // 850ms total minimum duration (very quick)

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  if (isFinished) return null;

  return (
    <>
      {/* Self-contained keyframe styles */}
      <style jsx global>{`
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes line-loading {
          0% { left: -40%; width: 30%; }
          50% { left: 30%; width: 40%; }
          100% { left: 100%; width: 30%; }
        }
        .anim-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }
        .anim-line-loading {
          animation: line-loading 1.4s ease-in-out infinite;
        }
      `}</style>

      <div
        id="app-preloader"
        className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-navy-950 transition-opacity duration-500 ease-out ${
          isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-busy="true"
        aria-label="Loading"
      >
        <div className="flex flex-col items-center gap-4">
          {/* Logo Mark + Wordmark in a minimalist row */}
          <div className="flex items-center gap-3 anim-pulse-soft">
            {/* Minimal P logo box */}
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-navy-900 border border-navy-800">
              <span className="text-white font-sans font-bold text-lg select-none">P</span>
            </div>
            {/* Wordmark */}
            <span className="font-sans font-bold text-2xl text-white tracking-tight select-none">
              Pro<span className="text-emerald-500">Serve</span>
            </span>
          </div>

          {/* Minimalist Progress Line Loader */}
          <div className="w-32 h-[2px] bg-navy-900 rounded-full overflow-hidden relative">
            <div className="absolute top-0 h-full bg-emerald-500 rounded-full anim-line-loading" />
          </div>
        </div>
      </div>
    </>
  );
}
