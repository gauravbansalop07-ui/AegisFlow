"use client";

import React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RouteOption } from "@/types";
import {
  Route,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Compass,
} from "lucide-react";
import { useAegisFlow } from "@/context/AegisFlowContext";

interface RouteInspectorDrawerProps {
  routeOption: RouteOption | null;
  onClose: () => void;
}

export function RouteInspectorDrawer({
  routeOption,
  onClose,
}: RouteInspectorDrawerProps) {
  const { showToast } = useAegisFlow();

  if (!routeOption) return null;

  const isSafe = routeOption.status === "safe";
  const isCaution = routeOption.status === "caution";
  const isBlocked = routeOption.status === "no_safe_route";

  return (
    <Drawer
      isOpen={!!routeOption}
      onClose={onClose}
      title="EVACUATION CORRIDOR INSPECTOR"
      subtitle={`${routeOption.name} • Detailed Waypoint Telemetry`}
      width="lg"
    >
      <div className="space-y-5 font-mono text-xs">
        {/* Header Hero */}
        <div
          className={`p-4 rounded border flex items-center justify-between gap-4 ${
            isSafe
              ? "bg-ops-emerald/10 border-ops-emerald/30 shadow-glow-emerald"
              : isCaution
              ? "bg-ops-amber/10 border-ops-amber/30 shadow-glow-amber"
              : "bg-ops-crimson/10 border-ops-crimson/30 shadow-glow-crimson"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant={isSafe ? "safe" : isCaution ? "warning" : "critical"}
                dot={true}
              >
                {routeOption.status.toUpperCase().replace(/_/g, " ")}
              </Badge>
              {routeOption.isRecommended && (
                <Badge variant="info">AEGISFLOW RECOMMENDED</Badge>
              )}
            </div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
              {routeOption.name}
            </h3>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Distance: <strong className="text-text-primary">{routeOption.totalDistanceKm} km</strong> • Est. Transit:{" "}
              <strong className="text-ops-cyan">{routeOption.estimatedMinutes} mins</strong>
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[10px] text-text-muted uppercase">Safety Score</div>
            <div
              className={`text-2xl font-black ${
                isSafe ? "text-ops-emerald" : isCaution ? "text-ops-amber" : "text-ops-crimson"
              }`}
            >
              {routeOption.safetyScore}
              <span className="text-xs font-normal text-text-dim">/100</span>
            </div>
          </div>
        </div>

        {/* Selection Rationale */}
        <div className="p-3.5 rounded bg-surface-elevated border border-border space-y-1.5 leading-relaxed">
          <div className="text-[10px] uppercase font-bold text-ops-cyan flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Path Optimization Rationale</span>
          </div>
          <div className="text-text-secondary text-[11px]">
            {routeOption.selectionRationale}
          </div>
        </div>

        {/* Sequential Road Segments Breakdown */}
        <div className="space-y-2">
          <div className="text-[10px] uppercase text-text-dim font-bold tracking-wider flex items-center justify-between">
            <span>Road Segments Traversed ({routeOption.segments.length})</span>
            <span>Elevation / Status</span>
          </div>

          <div className="space-y-2">
            {routeOption.segments.map((seg, idx) => {
              const segOpen = seg.status === "open";
              const segRisk = seg.status === "at_risk";
              const segFlooded = seg.status === "flooded";

              return (
                <div
                  key={seg.id}
                  className="p-2.5 rounded bg-surface-subtle border border-border flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-text-primary">
                      <span className="text-text-muted">{idx + 1}.</span>
                      <span>{seg.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-surface-elevated text-text-dim border border-border">
                        {seg.roadType}
                      </span>
                    </div>
                    <div className="text-[10px] text-text-dim">
                      {seg.fromName} &rarr; {seg.toName} • {seg.distanceKm} km (~{seg.baselineMinutes} min)
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge
                      variant={segOpen ? "safe" : segRisk ? "warning" : "critical"}
                      size="sm"
                    >
                      {seg.status.toUpperCase()}
                    </Badge>
                    <div className="text-[9px] text-text-muted mt-0.5">
                      Elev: {seg.elevationM}m • Depth: {seg.inundationDepthM}m
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            className="w-full gap-2"
            onClick={() => {
              showToast({
                title: "Corridor Selected for Convoy Briefing",
                message: `${routeOption.name} tagged for forward dispatch.`,
                type: "success",
              });
              onClose();
            }}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Select This Evacuation Corridor</span>
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
