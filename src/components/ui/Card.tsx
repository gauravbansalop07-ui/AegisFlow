import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "highlight" | "danger" | "warning";
}

export function Card({ className, variant = "default", ...props }: CardProps) {
  const variantStyles = {
    default: "bg-surface border-border",
    elevated: "bg-surface-elevated border-border-strong",
    highlight: "bg-surface border-ops-cyan/50 shadow-ops-md",
    danger: "bg-surface border-ops-crimson/50 shadow-ops-md",
    warning: "bg-surface border-ops-amber/50 shadow-ops-md",
  };

  return (
    <div
      className={cn(
        "rounded-lg border text-text-primary transition-all duration-150 shadow-ops-sm",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-4 sm:p-5 border-b border-border/60", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-semibold leading-tight tracking-normal text-sm sm:text-base text-text-primary uppercase font-mono", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs sm:text-sm text-text-secondary leading-relaxed font-sans", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 sm:p-5", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center p-4 sm:p-5 pt-0 border-t border-border/40 mt-4", className)}
      {...props}
    />
  );
}

