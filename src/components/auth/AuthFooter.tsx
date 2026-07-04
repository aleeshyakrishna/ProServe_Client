import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ------ AuthFooter Component ---------------------------------

interface AuthFooterProps {
  promptText: string;
  linkText: string;
  linkHref: string;
  className?: string;
}

export function AuthFooter({ promptText, linkText, linkHref, className }: AuthFooterProps) {
  return (
    <div className={cn("mt-6 text-center text-xs text-[var(--text-tertiary)]", className)}>
      <span>{promptText} </span>
      <Link
        href={linkHref}
        className={cn(
          "font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500",
          "underline underline-offset-4 decoration-emerald-500/20 hover:decoration-emerald-500/60",
          "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded px-1"
        )}
      >
        {linkText}
      </Link>
    </div>
  );
}
