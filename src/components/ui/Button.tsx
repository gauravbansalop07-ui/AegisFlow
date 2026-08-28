import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "warning" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary:
        "bg-ops-cyan hover:bg-ops-cyan-dim text-background font-semibold shadow-ops-sm border border-ops-cyan/50 hover:border-ops-cyan active:scale-[0.98]",
      secondary:
        "bg-surface-elevated hover:bg-surface-highlight text-text-primary border border-border active:scale-[0.98]",
      destructive:
        "bg-ops-crimson hover:bg-ops-crimson-dim text-white font-semibold shadow-ops-sm border border-ops-crimson/50 hover:border-ops-crimson active:scale-[0.98]",
      warning:
        "bg-ops-amber hover:bg-ops-amber-dim text-background font-semibold shadow-ops-sm border border-ops-amber/50 active:scale-[0.98]",
      outline:
        "bg-transparent hover:bg-surface-elevated text-text-primary border border-border hover:border-border-strong active:scale-[0.98]",
      ghost:
        "bg-transparent hover:bg-surface-elevated text-text-secondary hover:text-text-primary active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs font-mono tracking-wide",
      md: "h-9 px-4 text-xs font-mono uppercase tracking-wider font-semibold",
      lg: "h-11 px-6 text-sm font-mono uppercase tracking-wider font-semibold",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-md transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-ops-cyan/60",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

