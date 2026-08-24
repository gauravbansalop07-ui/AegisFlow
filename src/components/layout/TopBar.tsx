"use client";

import React from "react";
import {
  Search,
  Bell,
  Clock,
  MapPin,
  UserCheck,
  Zap,
  Play,
  Sparkles,
  Menu,
} from "lucide-react";
import { useAegisFlow } from "@/context/AegisFlowContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import Link from "next/link";

export function TopBar() {
  const {
    simulationState,
    alerts,
    districts,
    selectedDistrictId,
    setSelectedDistrictId,
    isDemoMode,
    startDemo,
    exitDemo,
    toggleMobileNav,
  } = useAegisFlow();

  const activeAlerts = alerts.filter((a) => a.status === "active");

  return (
    <header className="h-14 sm:h-16 bg-surface/90 backdrop-blur border-b border-border px-3 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 transition-all">
      {/* Left: Hamburger (Mobile only) + Region & Active Basin Context */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileNav}
          className="lg:hidden p-1.5 rounded-md hover:bg-surface-elevated text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-ops-cyan" />
        </button>

        {/* Basin Context Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden xs:flex w-7 h-7 rounded-md bg-ops-cyan/10 border border-ops-cyan/30 items-center justify-center text-ops-cyan">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <select
            value={selectedDistrictId || "all"}
            onChange={(e) =>
              setSelectedDistrictId(e.target.value === "all" ? null : e.target.value)
            }
            className="bg-surface-elevated text-[11px] sm:text-xs font-mono text-text-primary px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border border-border-strong focus:outline-none focus:ring-1 focus:ring-ops-cyan cursor-pointer hover:border-ops-cyan/50 transition-colors max-w-[150px] xs:max-w-[200px] sm:max-w-none truncate"
          >
            <option value="all">Assam (Statewide)</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        {/* Global Live Simulation Indicator - Hidden on extra small screens */}
        <Tooltip content="Deterministic Hydro-GIS model running in real-time decision simulation mode.">
          <div className="hidden md:block">
            <Badge variant="warning" dot={true} className="cursor-help shadow-sm">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <Zap className="w-3 h-3 text-ops-amber" />
                SIMULATION
              </span>
            </Badge>
          </div>
        </Tooltip>
      </div>

      {/* Right: Guided Demo CTA, Search, Clock, Unread Alerts & Commander Profile */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Guided Demo Button */}
        {isDemoMode ? (
          <Button
            variant="outline"
            size="sm"
            onClick={exitDemo}
            className="border-ops-cyan text-ops-cyan font-mono text-[10px] sm:text-xs gap-1 sm:gap-1.5 bg-ops-cyan/10 hover:bg-ops-cyan/20 animate-pulse rounded-md py-1 px-2 sm:px-3 h-7 sm:h-8"
          >
            <span className="w-2 h-2 rounded-full bg-ops-cyan" />
            <span className="hidden xs:inline">DEMO ACTIVE</span>
            <span className="xs:hidden">RESET</span>
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={startDemo}
            className="font-mono text-[10px] sm:text-xs gap-1 sm:gap-2 font-bold shadow-glow-cyan rounded-md py-1 px-2 sm:px-3 h-7 sm:h-8 hover:scale-[1.02] transition-transform"
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="hidden xs:inline">5-MIN DEMO</span>
            <span className="xs:hidden">DEMO</span>
          </Button>
        )}

        {/* Search - Desktop only */}
        <div className="relative hidden xl:block">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search district, gauge..."
            className="w-40 bg-surface-elevated text-xs font-mono text-text-primary pl-8 pr-3 py-1.5 rounded-md border border-border focus:border-ops-cyan/50 focus:outline-none placeholder:text-text-dim"
          />
        </div>

        {/* Last Data Sync Clock - Hidden on very small screens */}
        <Tooltip content="Telemetry synchronization frequency: < 15 seconds.">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-text-secondary bg-surface-elevated/60 px-2 py-1 rounded-md border border-border/60 cursor-default">
            <Clock className="w-3 h-3 text-ops-cyan" />
            <span className="text-[11px] font-bold text-ops-cyan">
              {simulationState.lastUpdatedTimestamp.split(" ")[0]}
            </span>
          </div>
        </Tooltip>

        {/* Notification / Alert Icon */}
        <Tooltip content={`${activeAlerts.length} active official emergency bulletins.`}>
          <Link
            href="/alerts"
            className="relative p-1.5 sm:p-2 rounded-md hover:bg-surface-elevated text-text-secondary hover:text-text-primary transition-colors border border-transparent hover:border-border"
            title="Active Alerts"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-ops-crimson animate-ping" />
            )}
          </Link>
        </Tooltip>

        {/* Commander Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 pl-1.5 sm:pl-3 border-l border-border">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-ops-cyan/15 border border-ops-cyan/40 flex items-center justify-center text-ops-cyan font-bold text-[10px] sm:text-xs font-mono shadow-sm">
            GB
          </div>
          <div className="text-left hidden lg:block">
            <div className="text-xs font-mono font-bold text-text-primary">
              Gaurav Bansal
            </div>
            <div className="text-[10px] font-mono text-ops-cyan">
              Incident Commander
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
