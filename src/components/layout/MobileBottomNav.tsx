"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAegisFlow } from "@/context/AegisFlowContext";
import {
  LayoutDashboard,
  Waves,
  ShieldAlert,
  Boxes,
  Route,
  BellRing,
  FileSpreadsheet,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { toggleMobileNav, alerts } = useAegisFlow();
  const activeAlertsCount = alerts.filter((a) => a.status === "active").length;

  const PRIMARY_MOBILE_ITEMS = [
    { label: "Overview", href: "/", icon: LayoutDashboard },
    { label: "Hazard", href: "/hazard-monitor", icon: Waves },
    { label: "Risk", href: "/risk-prioritization", icon: ShieldAlert },
    { label: "Resources", href: "/resources", icon: Boxes },
    { label: "Plan", href: "/response-plan", icon: Route },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border px-2 py-1.5 flex items-center justify-around select-none">
      {PRIMARY_MOBILE_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center min-w-[54px] py-1 px-1.5 rounded text-[10px] font-mono transition-colors",
              isActive
                ? "text-ops-cyan font-bold bg-ops-cyan/10"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            <Icon className={cn("w-4 h-4 mb-0.5", isActive ? "text-ops-cyan" : "text-text-muted")} />
            <span className="truncate max-w-[56px] text-center leading-none">{item.label}</span>
          </Link>
        );
      })}

      {/* Menu / All Modules button */}
      <button
        onClick={toggleMobileNav}
        className={cn(
          "relative flex flex-col items-center justify-center min-w-[54px] py-1 px-1.5 rounded text-[10px] font-mono text-text-muted hover:text-text-primary"
        )}
        aria-label="Open full operational navigation"
      >
        <div className="relative">
          <Menu className="w-4 h-4 mb-0.5 text-text-muted" />
          {activeAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-ops-crimson animate-ping" />
          )}
        </div>
        <span className="truncate max-w-[56px] text-center leading-none">Menu</span>
      </button>
    </div>
  );
}
