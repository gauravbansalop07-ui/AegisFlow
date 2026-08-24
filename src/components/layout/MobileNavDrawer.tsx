"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAegisFlow } from "@/context/AegisFlowContext";
import { NAV_ITEMS } from "@/components/layout/Sidebar";
import { X, Activity, Radio, Zap, Shield, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function MobileNavDrawer() {
  const pathname = usePathname();
  const {
    isMobileNavOpen,
    setIsMobileNavOpen,
    alerts,
    simulationState,
    isDemoMode,
    startDemo,
    exitDemo,
  } = useAegisFlow();

  const activeAlertsCount = alerts.filter((a) => a.status === "active").length;

  // Close on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname, setIsMobileNavOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileNavOpen) {
        setIsMobileNavOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileNavOpen, setIsMobileNavOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileNavOpen]);

  if (!isMobileNavOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsMobileNavOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-[85%] max-w-sm bg-surface border-r border-border h-full flex flex-col justify-between p-4 shadow-2xl z-10 overflow-y-auto">
        <div>
          {/* Brand & Close */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-ops-cyan/10 border border-ops-cyan/40 flex items-center justify-center text-ops-cyan shadow-glow-cyan">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm tracking-wider font-mono text-text-primary">
                    AEGIS<span className="text-ops-cyan">FLOW</span>
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-surface-elevated text-ops-cyan border border-ops-cyan/30 font-mono">
                    EOC
                  </span>
                </div>
                <p className="text-[10px] text-text-muted font-mono">Assam Flood Decision</p>
              </div>
            </div>

            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Commander Profile Banner */}
          <div className="mt-3 p-2.5 rounded bg-surface-elevated border border-border/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-ops-cyan/20 border border-ops-cyan/50 flex items-center justify-center text-ops-cyan font-bold text-xs font-mono">
                GB
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-text-primary">
                  Gaurav Bansal
                </div>
                <div className="text-[10px] font-mono text-ops-cyan">
                  Incident Commander
                </div>
              </div>
            </div>
            <Badge variant="warning" dot={true} size="sm">
              SIMULATION
            </Badge>
          </div>

          {/* Quick Demo Launch CTA */}
          <div className="mt-3">
            {isDemoMode ? (
              <Button
                variant="outline"
                size="sm"
                onClick={exitDemo}
                className="w-full text-xs font-mono border-ops-cyan text-ops-cyan bg-ops-cyan/10 gap-1.5 justify-center py-2"
              >
                <span className="w-2 h-2 rounded-full bg-ops-cyan animate-pulse" />
                <span>EXIT DEMO (RESET)</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={startDemo}
                className="w-full text-xs font-mono font-bold gap-1.5 justify-center py-2 shadow-glow-cyan"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>START 5-MIN DEMO</span>
              </Button>
            )}
          </div>

          {/* Nav Links */}
          <div className="mt-4">
            <div className="text-[10px] font-mono uppercase text-text-dim px-2 mb-2 tracking-wider">
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
                    onClick={() => setIsMobileNavOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded text-xs font-mono transition-all",
                      isActive
                        ? "bg-ops-cyan/10 text-ops-cyan border-l-2 border-ops-cyan font-semibold"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          isActive ? "text-ops-cyan" : "text-text-muted"
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
        <div className="pt-3 border-t border-border mt-4">
          <div className="p-2.5 rounded bg-surface-subtle border border-border space-y-1.5 font-mono text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Telemetry Status</span>
              <span className="text-ops-emerald font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-ops-emerald animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="flex items-center justify-between text-text-secondary">
              <span>Sync Time:</span>
              <strong className="text-ops-cyan">{simulationState.lastUpdatedTimestamp}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
