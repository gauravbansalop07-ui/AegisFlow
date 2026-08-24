"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AssamOverviewMap } from "@/components/map/AssamOverviewMap";
import { ResourceDepotDrawer } from "@/components/response/ResourceDepotDrawer";
import { LocationIntelligenceDrawer } from "@/components/response/LocationIntelligenceDrawer";
import {
  Boxes,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Ship,
  HeartPulse,
  Truck,
  Shield,
  Layers,
  ChevronRight,
  Info,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useAegisFlow } from "@/context/AegisFlowContext";
import { RiskScore } from "@/types";
import { Tooltip } from "@/components/ui/Tooltip";

// Staged Depots Data
const STAGED_DEPOTS = [
  {
    id: "depot-jorhat",
    name: "Jorhat Forward Staging Base",
    location: "Upper Assam / Brahmaputra South Bank",
    coordinates: [26.75, 94.22] as [number, number],
    staged: { boats: 12, foodKits: 2800, medicalTeams: 6, rescueTeams: 8, vehicles: 12 },
    supportedHotspots: ["Majuli Island", "Lakhimpur Lowlands", "Dhemaji HQ"],
    averageTransitMinutes: 35,
  },
  {
    id: "depot-guwahati",
    name: "Guwahati Central NDRF Logistics Depot",
    location: "Central Assam / Kamrup",
    coordinates: [26.18, 91.74] as [number, number],
    staged: { boats: 6, foodKits: 1800, medicalTeams: 4, rescueTeams: 5, vehicles: 10 },
    supportedHotspots: ["Barpeta Beki Delta", "Nagaon Sadar", "Goalpara Corridor"],
    averageTransitMinutes: 55,
  },
  {
    id: "depot-silchar",
    name: "Silchar Southern Regional Hub",
    location: "Barak Valley",
    coordinates: [24.83, 92.78] as [number, number],
    staged: { boats: 2, foodKits: 400, medicalTeams: 2, rescueTeams: 2, vehicles: 3 },
    supportedHotspots: ["Cachar Lowlands", "Karimganj"],
    averageTransitMinutes: 40,
  },
];

export default function ResourcesPage() {
  const {
    resources,
    impactScores,
    optimizationResult,
    isOptimizedMode,
    isOptimizing,
    triggerOptimization,
    resetOptimizationMode,
    districts,
    incidents,
    shelters,
    gauges,
    inundationPolygons,
  } = useAegisFlow();

  const [selectedDepot, setSelectedDepot] = useState<typeof STAGED_DEPOTS[0] | null>(null);
  const [selectedRiskScore, setSelectedRiskScore] = useState<RiskScore | null>(null);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "boats":
        return <Ship className="w-4 h-4 text-ops-cyan" />;
      case "food_kits":
        return <Boxes className="w-4 h-4 text-ops-amber" />;
      case "medical_teams":
        return <HeartPulse className="w-4 h-4 text-ops-emerald" />;
      case "rescue_teams":
        return <Shield className="w-4 h-4 text-ops-crimson" />;
      case "vehicles":
      default:
        return <Truck className="w-4 h-4 text-ops-indigo-light" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Situation Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold text-text-primary font-mono uppercase tracking-wider flex items-center gap-2">
              <Boxes className="w-5 h-5 text-ops-cyan" />
              <span>Emergency Logistics & Resource Optimization</span>
            </h1>
            <div className="flex items-center gap-1.5">
              <Badge variant="info">LOGISTICS COMMAND</Badge>
              <Badge variant="neutral">SIMULATED INVENTORY</Badge>
              <Badge variant="warning">RECOMMENDATION ONLY</Badge>
              <Tooltip content="Deterministic priority allocation: Finite inventory is routed to highest Impact Score hotspots rather than distributed equally.">
                <span className="cursor-help text-text-muted hover:text-ops-cyan">
                  <Info className="w-3.5 h-3.5" />
                </span>
              </Tooltip>
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-1 font-mono">
            Finite asset distribution model • Maximizes critical priority coverage under strict inventory bounds
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 font-mono">
          <Button
            variant="outline"
            size="sm"
            onClick={resetOptimizationMode}
            className={`gap-1.5 ${!isOptimizedMode ? "border-ops-cyan text-ops-cyan bg-ops-cyan/10" : ""}`}
          >
            <span>Manual Baseline</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            isLoading={isOptimizing}
            onClick={triggerOptimization}
            className="gap-1.5 shadow-glow-cyan"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isOptimizing ? "ANALYZING DEMAND..." : "OPTIMIZE ALLOCATION"}</span>
          </Button>
        </div>
      </div>

      {/* 2. Resource Inventory Cards (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {resources.map((res) => {
          const utilPercent = Math.round((res.currentlyDeployed / res.totalInventory) * 100);

          return (
            <Card key={res.id} className="border-border">
              <CardContent className="p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider truncate">
                    {res.name.split("/")[0]}
                  </span>
                  {getResourceIcon(res.type)}
                </div>

                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold font-mono text-ops-cyan">
                    {res.available.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[10px] font-mono text-text-dim">
                    / {res.totalInventory.toLocaleString("en-IN")} {res.unit}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-text-secondary">
                    <span>{res.currentlyDeployed.toLocaleString("en-IN")} Staged</span>
                    <span>{utilPercent}% Deployed</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden border border-border/60">
                    <div
                      className="h-full bg-ops-cyan rounded-full transition-all"
                      style={{ width: `${utilPercent}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3. Optimization Gain & Comparison Banner */}
      <Card className="border-border-strong bg-surface">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded flex items-center justify-center shrink-0 border ${
                isOptimizedMode
                  ? "bg-ops-cyan/15 border-ops-cyan/50 text-ops-cyan shadow-glow-cyan"
                  : "bg-surface-elevated border-border text-text-muted"
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wide">
                  Allocation Mode:
                </span>
                <Badge variant={isOptimizedMode ? "info" : "neutral"}>
                  {isOptimizedMode ? "AEGISFLOW AI RECOMMENDATION" : "MANUAL BASELINE"}
                </Badge>
              </div>
              <p className="text-[11px] text-text-secondary mt-0.5">
                {isOptimizedMode
                  ? `Prioritizing critical impact zones (Majuli, Lakhimpur, Dhemaji) based on demographic fragility.`
                  : `Conventional unoptimized distribution leaving critical deficits in vulnerable sectors.`}
              </p>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="flex items-center gap-6 text-xs">
            <div className="text-center">
              <div className="text-[10px] text-text-muted uppercase">Priority Coverage</div>
              <div className="text-sm font-bold text-ops-emerald mt-0.5">
                {isOptimizedMode
                  ? `${optimizationResult.metrics.optimizedPriorityCoverage}%`
                  : `${optimizationResult.metrics.manualPriorityCoverage}%`}
              </div>
            </div>

            <div className="text-center">
              <div className="text-[10px] text-text-muted uppercase">Optimization Gain</div>
              <div className="text-sm font-bold text-ops-cyan mt-0.5">
                +{optimizationResult.metrics.optimizationGainPercent}%
              </div>
            </div>

            <div className="text-center">
              <div className="text-[10px] text-text-muted uppercase">Inventory Used</div>
              <div className="text-sm font-bold text-text-primary mt-0.5">
                {optimizationResult.metrics.totalInventoryAllocatedPercent}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Before vs After Detailed Allocation Comparison Table */}
      <Card>
        <CardHeader className="py-3 bg-surface-subtle/60">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span>BEFORE (MANUAL) vs. AFTER (AEGISFLOW) ALLOCATION MATRIX</span>
                <Badge variant="info">Priority Ordered</Badge>
              </CardTitle>
              <CardDescription>
                Live comparison showing exact asset shifts and shortfall mitigation per location.
              </CardDescription>
            </div>

            <span className="text-[10px] font-mono text-text-muted">
              Click row to view location risk details
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface-subtle text-text-muted text-[10px] uppercase border-b border-border">
              <tr>
                <th className="py-2.5 px-3 text-center">Rank</th>
                <th className="py-2.5 px-3">Target Location</th>
                <th className="py-2.5 px-3 text-center">Priority</th>
                <th className="py-2.5 px-3 text-center">Impact</th>
                <th className="py-2.5 px-3 text-center">Boats (Man → Opt)</th>
                <th className="py-2.5 px-3 text-center">Food Kits</th>
                <th className="py-2.5 px-3 text-center">Medical</th>
                <th className="py-2.5 px-3 text-center">Rescue</th>
                <th className="py-2.5 px-3 text-center">ATVs</th>
                <th className="py-2.5 px-3">Allocation Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {optimizationResult.allocations.map((item) => {
                const isCrit = item.priorityLevel === "critical";
                const isHigh = item.priorityLevel === "high";
                const riskObj = impactScores.find((r) => r.locationId === item.districtId);

                return (
                  <tr
                    key={item.districtId}
                    onClick={() => {
                      if (riskObj) setSelectedRiskScore(riskObj);
                    }}
                    className="hover:bg-surface-elevated transition-colors cursor-pointer group"
                  >
                    {/* Rank */}
                    <td className="py-2.5 px-3 text-center font-bold text-text-muted">
                      #{String(item.rank).padStart(2, "0")}
                    </td>

                    {/* Location */}
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-text-primary uppercase group-hover:text-ops-cyan transition-colors">
                        {item.locationName}
                      </div>
                      <div className="text-[10px] text-text-dim">
                        {item.populationExposed.toLocaleString("en-IN")} exposed
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-2.5 px-3 text-center">
                      <Badge
                        variant={isCrit ? "critical" : isHigh ? "warning" : "safe"}
                        size="sm"
                        dot={isCrit}
                      >
                        {item.priorityLevel}
                      </Badge>
                    </td>

                    {/* Impact Score */}
                    <td className="py-2.5 px-3 text-center font-bold">
                      <span className={isCrit ? "text-ops-crimson" : isHigh ? "text-ops-amber" : "text-ops-cyan"}>
                        {item.impactScore}
                      </span>
                    </td>

                    {/* Boats Comparison */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-text-muted line-through text-[11px]">{item.manual.boats}</span>
                        <span className="text-text-dim">&rarr;</span>
                        <strong className="text-ops-cyan">{item.recommended.boats}</strong>
                        {item.delta.boats !== 0 && (
                          <span
                            className={`text-[9px] px-1 rounded font-bold ${
                              item.delta.boats > 0
                                ? "bg-ops-emerald/20 text-ops-emerald"
                                : "bg-ops-crimson/20 text-ops-crimson"
                            }`}
                          >
                            {item.delta.boats > 0 ? `+${item.delta.boats}` : item.delta.boats}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Food Kits Comparison */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-text-muted line-through text-[11px]">{item.manual.foodKits}</span>
                        <span className="text-text-dim">&rarr;</span>
                        <strong className="text-ops-amber">{item.recommended.foodKits}</strong>
                        {item.delta.foodKits !== 0 && (
                          <span
                            className={`text-[9px] px-1 rounded font-bold ${
                              item.delta.foodKits > 0
                                ? "bg-ops-emerald/20 text-ops-emerald"
                                : "bg-ops-crimson/20 text-ops-crimson"
                            }`}
                          >
                            {item.delta.foodKits > 0 ? `+${item.delta.foodKits}` : item.delta.foodKits}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Medical Teams */}
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-ops-emerald font-bold">{item.recommended.medicalTeams}</span>
                    </td>

                    {/* Rescue Teams */}
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-ops-crimson font-bold">{item.recommended.rescueTeams}</span>
                    </td>

                    {/* Vehicles */}
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-ops-indigo-light font-bold">{item.recommended.vehicles}</span>
                    </td>

                    {/* Rationale */}
                    <td className="py-2.5 px-3 text-[10px] text-text-secondary max-w-xs truncate">
                      {item.rationale}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 5. Resource Shortfall & Optimization Explanation Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Resource Shortfall Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-ops-amber" />
                  <span>FINITE INVENTORY DEFICIT ANALYSIS</span>
                </CardTitle>
                <Badge variant="warning" size="sm">
                  Constraints Enforced
                </Badge>
              </div>
              <CardDescription>
                Calculates unmet resource deficit across secondary sectors due to strict state-wide stock limits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 font-mono text-xs">
              {optimizationResult.shortfalls.map((s) => (
                <div
                  key={s.type}
                  className="p-2.5 rounded bg-surface-elevated border border-border flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-text-primary text-[11px]">{s.name}</div>
                    <div className="text-[10px] text-text-dim">
                      Demand: {s.totalRequired.toLocaleString("en-IN")} • Available: {s.availableInventory.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="text-right">
                    {s.shortfall > 0 ? (
                      <div className="text-xs font-bold text-ops-crimson">
                        Deficit: -{s.shortfall.toLocaleString("en-IN")} {s.unit}
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-ops-emerald flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Fully Met</span>
                      </div>
                    )}
                    <div className="text-[9px] text-text-muted">
                      Allocated: {s.allocated.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Optimization Explanation & Staged Depots (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <Card className="border-ops-cyan/40 bg-surface">
            <CardHeader className="py-3 bg-ops-cyan/10 border-b border-ops-cyan/20">
              <CardTitle className="text-ops-cyan flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>WHY THIS ALLOCATION?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 font-mono text-xs leading-relaxed text-text-secondary">
              <p className="text-text-primary font-medium">
                {optimizationResult.explanation.summary}
              </p>

              <div className="space-y-1.5 p-3 rounded bg-surface-subtle border border-border">
                <div className="text-[10px] uppercase font-bold text-text-dim">Key Algorithmic Decisions:</div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-text-secondary">
                  {optimizationResult.explanation.keyShifts.map((shift, idx) => (
                    <li key={idx}>{shift}</li>
                  ))}
                </ul>
              </div>

              <div className="text-[11px] text-text-dim">
                <strong className="text-text-secondary">Inventory Integrity: </strong>
                {optimizationResult.explanation.criticalConstraints}
              </div>

              {/* Forward Depots Selector */}
              <div className="pt-2 border-t border-border/80">
                <div className="text-[10px] uppercase text-text-dim font-bold mb-2">
                  Click Forward Staging Bases for Telemetry:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {STAGED_DEPOTS.map((depot) => (
                    <button
                      key={depot.id}
                      onClick={() => setSelectedDepot(depot)}
                      className="p-2 text-left rounded bg-surface-elevated border border-border hover:border-ops-cyan transition-colors"
                    >
                      <div className="font-bold text-text-primary text-[10px] truncate">
                        {depot.name.split(" ")[0]} Hub
                      </div>
                      <div className="text-[9px] text-ops-cyan mt-0.5">
                        {depot.staged.boats} Boats • ~{depot.averageTransitMinutes}m
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 6. Allocation Map Component */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-text-primary uppercase tracking-wider">
              Assam Staging Depots & Deployment Logistics Map
            </span>
            <Badge variant="info">Depot Network</Badge>
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            Yellow/Purple markers represent forward staging bases; hotspots show relative priority
          </span>
        </div>

        <AssamOverviewMap
          className="w-full h-[460px]"
          districts={districts}
          incidents={incidents}
          shelters={shelters}
          gauges={gauges}
          inundationPolygons={inundationPolygons}
          onSelectIncident={(inc) => {
            const riskObj = impactScores.find((r) => r.locationId === inc.districtId);
            if (riskObj) setSelectedRiskScore(riskObj);
          }}
          onSelectDistrict={(dist) => {
            const riskObj = impactScores.find((r) => r.locationId === dist.id);
            if (riskObj) setSelectedRiskScore(riskObj);
          }}
        />
      </div>

      {/* Resource Depot Drawer */}
      <ResourceDepotDrawer
        depot={selectedDepot}
        onClose={() => setSelectedDepot(null)}
      />

      {/* Location Intelligence Drawer */}
      <LocationIntelligenceDrawer
        riskScore={selectedRiskScore}
        onClose={() => setSelectedRiskScore(null)}
      />
    </div>
  );
}
