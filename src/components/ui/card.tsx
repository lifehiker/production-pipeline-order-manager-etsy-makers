import * as React from "react";

import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-[var(--line)] bg-white p-6 shadow-[0_24px_80px_rgba(25,24,23,0.06)]",
        className,
      )}
      {...props}
    />
  );
}
