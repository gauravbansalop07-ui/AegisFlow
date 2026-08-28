"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAegisFlow } from "@/context/AegisFlowContext";
import { NAV_GROUPS } from "@/components/layout/Sidebar";
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
      <div className="relative w-[85%] max-w-sm bg-surface border-r border-border h-full flex flex-col justify-between p-4 sm:p-5 shadow-2xl z-10 overflow-y-auto">
        <div>
          {/* Brand & Close */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-ops-cyan/10 border border-ops-cyan/30 flex items-center justify-center text-ops-cyan shadow-sm">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm tracking-wider font-mono text-text-primary">
                    AEGIS<span className="text-ops-cyan">FLOW</span>
                  </span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-surface-elevated text-text-muted border border-border font-mono">
                    EOC
                  </span>
                </div>
                <p className="text-[11px] text-text-muted font-mono">Assam Flood Operations</p>
              </div>
            </div>

            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Commander Profile Banner */}
          <div className="mt-3 p-3 rounded-lg bg-surface-elevated border border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-ops-cyan/20 border border-ops-cyan/50 flex items-center justify-center text-ops-cyan font-bold text-xs font-mono">
                GB
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-text-primary">
                  Gaurav Bansal
                </div>
                <div className="text-[11px] font-mono text-ops-cyan">
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
                size="md"
                onClick={exitDemo}
                className="w-full text-xs font-mono border-ops-cyan text-ops-cyan bg-ops-cyan/10 gap-1.5 justify-center py-2.5 h-10"
              >
                <span className="w-2 h-2 rounded-full bg-ops-cyan animate-pulse" />
                <span>EXIT DEMO (RESET)</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={startDemo}
                className="w-full text-xs font-mono font-bold gap-1.5 justify-center py-2.5 h-10 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>START 5-MIN DEMO</span>
              </Button>
            )}
          </div>

          {/* Grouped Nav Links */}
          <div className="mt-5 space-y-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="space-y-1">
                <div className="text-[10px] font-mono uppercase text-text-muted/70 px-2 tracking-wider font-semibold">
                  {group.title}
                </div>
                <nav className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    const isAlert = item.badge === "alerts_count";

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileNavOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-mono transition-all",
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
        <div className="pt-3 border-t border-border mt-4">
          <div className="p-2.5 rounded-lg bg-surface-subtle border border-border space-y-1.5 font-mono text-[11px]">
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

