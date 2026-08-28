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

export const NAV_GROUPS = [
  {
    title: "SITUATION",
    items: [
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
        badge: null,
      },
      {
        label: "Exposure Map",
        href: "/exposure-map",
        icon: Map,
        badge: null,
      },
    ],
  },
  {
    title: "DECISION SUPPORT",
    items: [
      {
        label: "Risk Prioritization",
        href: "/risk-prioritization",
        icon: ShieldAlert,
        badge: null,
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
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      {
        label: "Official Alerts",
        href: "/alerts",
        icon: BellRing,
        badge: "alerts_count",
      },
      {
        label: "Situation Reports",
        href: "/reports",
        icon: FileSpreadsheet,
        badge: null,
      },
    ],
  },
];

export const NAV_ITEMS = NAV_GROUPS.flatMap((group) => group.items);

export function Sidebar() {
  const pathname = usePathname();
  const { alerts } = useAegisFlow();
  const activeAlertsCount = alerts.filter((a) => a.status === "active").length;

  return (
    <aside className="hidden lg:flex w-64 bg-surface border-r border-border flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-border gap-3">
          <div className="w-8 h-8 rounded-lg bg-ops-cyan/10 border border-ops-cyan/30 flex items-center justify-center text-ops-cyan shadow-sm">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-wider font-mono text-text-primary">
                AEGIS<span className="text-ops-cyan">FLOW</span>
              </span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-surface-elevated text-text-muted border border-border font-mono">
                EOC
              </span>
            </div>
            <p className="text-[11px] text-text-muted font-mono">
              Assam Flood Decision
            </p>
          </div>
        </div>

        {/* Tactical Grouped Nav Section */}
        <div className="px-3 py-4 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="text-[10px] font-mono uppercase text-text-muted/70 px-3 tracking-widest font-semibold">
                {group.title}
              </div>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  const isAlert = item.badge === "alerts_count";

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-md text-xs font-mono transition-colors duration-150 group",
                        isActive
                          ? "bg-ops-cyan/10 text-ops-cyan font-semibold border-l-2 border-ops-cyan pl-2.5"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/70"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            "w-4 h-4 transition-colors",
                            isActive
                              ? "text-ops-cyan"
                              : "text-text-muted group-hover:text-text-secondary"
                          )}
                        />
                        <span>{item.label}</span>
                      </div>

                      {isAlert && activeAlertsCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-ops-crimson/20 text-ops-crimson border border-ops-crimson/40 font-mono font-bold">
                          {activeAlertsCount}
                        </span>
                      )}

                      {item.badge && !isAlert && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted border border-border font-mono">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Telemetry Box */}
      <div className="p-3 border-t border-border bg-surface-subtle/40 m-2.5 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-ops-emerald animate-pulse" />
            <span className="text-[11px] font-mono text-text-secondary uppercase">
              EOC Telemetry
            </span>
          </div>
          <span className="text-[10px] font-mono text-ops-emerald bg-ops-emerald/10 px-1.5 py-0.5 rounded border border-ops-emerald/20">
            ONLINE
          </span>
        </div>
        <div className="space-y-1 text-[11px] font-mono text-text-muted">
          <div className="flex justify-between">
            <span>Hydro Gauges</span>
            <span className="text-text-secondary">6 Active</span>
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

