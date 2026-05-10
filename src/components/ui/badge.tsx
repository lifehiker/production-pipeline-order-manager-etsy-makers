import * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[var(--sand)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
