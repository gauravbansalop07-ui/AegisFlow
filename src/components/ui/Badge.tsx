import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "critical" | "warning" | "safe" | "info" | "neutral" | "outline";
  dot?: boolean;
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "neutral",
  dot = false,
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    critical: "bg-ops-crimson/15 text-ops-crimson border-ops-crimson/30",
    warning: "bg-ops-amber/15 text-ops-amber border-ops-amber/30",
    safe: "bg-ops-emerald/15 text-ops-emerald border-ops-emerald/30",
    info: "bg-ops-cyan/15 text-ops-cyan border-ops-cyan/30",
    neutral: "bg-surface-elevated text-text-secondary border-border",
    outline: "bg-transparent text-text-secondary border-border-strong",
  };

  const dotStyles = {
    critical: "bg-ops-crimson animate-ops-pulse",
    warning: "bg-ops-amber",
    safe: "bg-ops-emerald",
    info: "bg-ops-cyan animate-ops-pulse",
    neutral: "bg-text-muted",
    outline: "bg-text-muted",
  };

  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-[10px] tracking-wide",
    md: "px-2.5 py-1 text-xs tracking-wide",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium uppercase rounded border font-mono",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotStyles[variant])} />}
      {children}
    </span>
  );
}
