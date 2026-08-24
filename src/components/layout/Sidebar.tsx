"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Waves,
  Map,
  ShieldAlert,
  Boxes,
  Route,
  BellRing,
  FileSpreadsheet,
  Activity,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAegisFlow } from "@/context/AegisFlowContext";

export const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    label: "Hazard Monitor",
    href: "/hazard-monitor",
    icon: Waves,
    badge: "LIVE SIM",
  },
  {
    label: "Exposure Map",
    href: "/exposure-map",
    icon: Map,
    badge: null,
  },
  {
    label: "Risk Prioritization",
    href: "/risk-prioritization",
    icon: ShieldAlert,
    badge: "USP",
  },
  {
    label: "Resources",
    href: "/resources",
    icon: Boxes,
    badge: null,
  },
  {
    label: "Response Plan",
    href: "/response-plan",
    icon: Route,
    badge: "HITL",
  },
  {
    label: "Alerts",
    href: "/alerts",
    icon: BellRing,
    badge: "5",
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileSpreadsheet,
    badge: null,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { alerts } = useAegisFlow();
  const activeAlertsCount = alerts.filter((a) => a.status === "active").length;

  return (
    <aside className="hidden lg:flex w-64 bg-surface border-r border-border flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-4 border-b border-border gap-3">
          <div className="w-9 h-9 rounded bg-ops-cyan/10 border border-ops-cyan/40 flex items-center justify-center text-ops-cyan shadow-glow-cyan">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-wider font-mono text-text-primary">
                AEGIS<span className="text-ops-cyan">FLOW</span>
              </span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-surface-elevated text-ops-cyan border border-ops-cyan/30 font-mono">
                EOC v1.0
              </span>
            </div>
            <p className="text-[10px] text-text-muted font-mono tracking-tight">
              Assam Flood Decision Platform
            </p>
          </div>
        </div>

        {/* Tactical Nav Section */}
        <div className="px-3 py-4">
          <div className="text-[10px] font-mono uppercase text-text-dim px-3 mb-2 tracking-wider">
            Operational Modules
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const badgeContent =
                item.href === "/alerts" && activeAlertsCount > 0
                  ? activeAlertsCount.toString()
                  : item.badge;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-all duration-150 group",
                    isActive
                      ? "bg-ops-cyan/10 text-ops-cyan border-l-2 border-ops-cyan pl-2.5 font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-subtle"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive
                          ? "text-ops-cyan"
                          : "text-text-muted group-hover:text-text-primary"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {badgeContent && (
                    <span
                      className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded font-mono font-medium",
                        item.href === "/alerts"
                          ? "bg-ops-crimson/20 text-ops-crimson border border-ops-crimson/30"
                          : item.badge === "USP" || item.badge === "HITL"
                          ? "bg-ops-indigo/20 text-ops-indigo-light border border-ops-indigo/30"
                          : "bg-surface-elevated text-text-muted border border-border"
                      )}
                    >
                      {badgeContent}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Telemetry Box */}
      <div className="p-3 border-t border-border bg-surface-subtle/50 m-2 rounded border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-ops-emerald animate-pulse" />
            <span className="text-[11px] font-mono text-text-secondary uppercase">
              EOC Telemetry
            </span>
          </div>
          <span className="text-[9px] font-mono text-ops-emerald bg-ops-emerald/10 px-1.5 py-0.5 rounded border border-ops-emerald/20">
            ONLINE
          </span>
        </div>
        <div className="space-y-1 text-[10px] font-mono text-text-muted">
          <div className="flex justify-between">
            <span>Hydro Gauges</span>
            <span className="text-text-secondary">6 Active</span>
          </div>
          <div className="flex justify-between">
            <span>AWS Radar</span>
            <span className="text-text-secondary">6 Doppler</span>
          </div>
          <div className="flex justify-between">
            <span>Decision Loop</span>
            <span className="text-ops-cyan">&lt; 4 mins</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
