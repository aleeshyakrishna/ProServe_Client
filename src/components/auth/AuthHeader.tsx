import * as React from "react";
import { cn } from "@/lib/utils";

// ------ AuthHeader Component ---------------------------------

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export function AuthHeader({ title, subtitle, className }: AuthHeaderProps) {
  return (
    <div className={cn("space-y-2 mb-6 text-center sm:text-left", className)}>
      <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
        {title}
      </h2>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed text-balance">
        {subtitle}
      </p>
    </div>
  );
}
