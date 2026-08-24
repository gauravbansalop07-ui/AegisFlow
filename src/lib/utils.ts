import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatCompactNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(2)} L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

export function getRiskColorClass(level: "safe" | "low" | "moderate" | "high" | "critical" | string) {
  switch (level.toLowerCase()) {
    case "critical":
      return {
        badge: "bg-ops-crimson/15 text-ops-crimson border-ops-crimson/30",
        text: "text-ops-crimson",
        border: "border-ops-crimson/40",
        bg: "bg-ops-crimson/10",
        dot: "bg-ops-crimson",
        glow: "shadow-[0_0_8px_rgba(239,68,68,0.4)]",
      };
    case "high":
      return {
        badge: "bg-ops-amber/15 text-ops-amber border-ops-amber/30",
        text: "text-ops-amber",
        border: "border-ops-amber/40",
        bg: "bg-ops-amber/10",
        dot: "bg-ops-amber",
        glow: "shadow-[0_0_8px_rgba(245,158,11,0.4)]",
      };
    case "moderate":
      return {
        badge: "bg-ops-indigo/15 text-ops-indigo-light border-ops-indigo/30",
        text: "text-ops-indigo-light",
        border: "border-ops-indigo/40",
        bg: "bg-ops-indigo/10",
        dot: "bg-ops-indigo",
        glow: "shadow-[0_0_8px_rgba(99,102,241,0.4)]",
      };
    case "low":
    case "safe":
    case "stable":
      return {
        badge: "bg-ops-emerald/15 text-ops-emerald border-ops-emerald/30",
        text: "text-ops-emerald",
        border: "border-ops-emerald/40",
        bg: "bg-ops-emerald/10",
        dot: "bg-ops-emerald",
        glow: "shadow-[0_0_8px_rgba(16,185,129,0.4)]",
      };
    default:
      return {
        badge: "bg-surface-elevated text-text-secondary border-border",
        text: "text-text-secondary",
        border: "border-border",
        bg: "bg-surface-subtle",
        dot: "bg-text-muted",
        glow: "",
      };
  }
}
