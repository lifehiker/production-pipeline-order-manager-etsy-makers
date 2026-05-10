import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--brand)] px-5 py-3 text-white shadow-[0_14px_28px_rgba(190,90,48,0.18)] hover:translate-y-[-1px] hover:bg-[color:var(--brand-strong)]",
        secondary:
          "border border-[var(--line)] bg-white px-5 py-3 text-[var(--ink)] hover:border-[var(--brand)] hover:text-[var(--brand)]",
        ghost: "px-3 py-2 text-[var(--muted-ink)] hover:bg-white/80 hover:text-[var(--ink)]",
      },
      size: {
        default: "",
        sm: "px-3 py-2 text-xs",
        lg: "px-6 py-4 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      type={type}
      {...props}
    />
  );
}
