"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AssamLeafletMap } from "@/components/map/AssamLeafletMap";
import { useAegisFlow } from "@/context/AegisFlowContext";
import {
  Layers,
  MapPin,
  Shield,
  Users,
  Building2,
  AlertTriangle,
  Flame,
  Home,
  CheckCircle2,
  Waves,
} from "lucide-react";

export default function ExposureMapPage() {
  const { impactScores, simulationResult, simulationState } = useAegisFlow();

  const [layers, setLayers] = useState({
    inundation: true,
    vulnerability: true,
    infrastructure: true,
    shelters: true,
  });

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const topExposed = [...impactScores]
    .sort((a, b) => b.populationExposed - a.populationExposed)
    .slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-mono tracking-tight flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-ops-cyan" />
              <span>Exposure & Vulnerability Map</span>
            </h1>
            <Badge variant="info">GIS MULTI-FACTOR</Badge>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 font-sans">
            Spatial overlay combining flood inundation envelopes with demographic vulnerability and critical infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs flex-wrap">
          <Badge variant="warning" dot={true}>
            {simulationResult.districtsAtRiskCount} Districts Exposed
          </Badge>
          <Badge variant="critical">
            {simulationResult.totalPopulationAffected.toLocaleString("en-IN")} Citizens at Risk
          </Badge>
        </div>
      </div>

      {/* Main Grid: Map + Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Map (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-lg border border-border overflow-hidden relative shadow-sm">
            <AssamLeafletMap className="w-full h-[360px] xs:h-[420px] sm:h-[480px] lg:h-[560px]" />
          </div>

          {/* Vulnerability Heatmap Legend Strip */}
          <Card className="border-border">
            <CardContent className="p-3.5 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                <span className="font-bold text-text-primary uppercase flex items-center gap-2">
                  <Shield className="w-4 h-4 text-ops-cyan" />
                  <span>Vulnerability Index Legend:</span>
                </span>
                <div className="flex flex-wrap items-center gap-4 text-xs font-sans">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-ops-crimson inline-block"></span>
                    <span className="text-text-secondary">Extreme (&gt;80)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-ops-amber inline-block"></span>
                    <span className="text-text-secondary">High (60-80)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-ops-indigo-light inline-block"></span>
                    <span className="text-text-secondary">Moderate (40-60)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-ops-emerald inline-block"></span>
                    <span className="text-text-secondary">Low / Stable (&lt;40)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Layer Toggles & Top Exposed Sectors (1 col) */}
        <div className="space-y-6 font-mono text-xs">
          {/* Layer Controls */}
          <Card>
            <CardHeader className="bg-surface-subtle/40">
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-ops-cyan" />
                <span>Multi-Source Overlays</span>
              </CardTitle>
              <CardDescription>Toggle spatial data layers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <label className="flex items-center justify-between p-3 rounded-md bg-surface-elevated border border-border cursor-pointer hover:border-ops-cyan/50 transition-colors">
                <span className="flex items-center gap-2.5 text-text-primary text-xs font-semibold">
                  <Waves className="w-4 h-4 text-ops-cyan" />
                  <span>Inundation Envelope</span>
                </span>
                <input
                  type="checkbox"
                  checked={layers.inundation}
                  onChange={() => toggleLayer("inundation")}
                  className="accent-ops-cyan w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-md bg-surface-elevated border border-border cursor-pointer hover:border-ops-cyan/50 transition-colors">
                <span className="flex items-center gap-2.5 text-text-primary text-xs font-semibold">
                  <Users className="w-4 h-4 text-ops-amber" />
                  <span>Demographic Vuln.</span>
                </span>
                <input
                  type="checkbox"
                  checked={layers.vulnerability}
                  onChange={() => toggleLayer("vulnerability")}
                  className="accent-ops-cyan w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-md bg-surface-elevated border border-border cursor-pointer hover:border-ops-cyan/50 transition-colors">
                <span className="flex items-center gap-2.5 text-text-primary text-xs font-semibold">
                  <Building2 className="w-4 h-4 text-ops-crimson" />
                  <span>Critical Infra</span>
                </span>
                <input
                  type="checkbox"
                  checked={layers.infrastructure}
                  onChange={() => toggleLayer("infrastructure")}
                  className="accent-ops-cyan w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-md bg-surface-elevated border border-border cursor-pointer hover:border-ops-cyan/50 transition-colors">
                <span className="flex items-center gap-2.5 text-text-primary text-xs font-semibold">
                  <Home className="w-4 h-4 text-ops-emerald" />
                  <span>Evacuation Shelters</span>
                </span>
                <input
                  type="checkbox"
                  checked={layers.shelters}
                  onChange={() => toggleLayer("shelters")}
                  className="accent-ops-cyan w-4 h-4 cursor-pointer"
                />
              </label>
            </CardContent>
          </Card>

          {/* Top Exposed Districts Panel */}
          <Card>
            <CardHeader className="bg-surface-subtle/40">
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-ops-crimson" />
                <span>Top Exposed Districts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {topExposed.map((item, idx) => (
                <div
                  key={item.locationId}
                  className="p-3 rounded-md bg-surface-elevated border border-border space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-text-primary">
                      #{idx + 1} {item.locationName}
                    </span>
                    <Badge
                      variant={item.priorityLevel === "critical" ? "critical" : "warning"}
                      size="sm"
                    >
                      {item.priorityLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>Pop Exposed:</span>
                    <strong className="text-text-primary font-mono">
                      {item.populationExposed.toLocaleString("en-IN")}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span>Hospitals: {item.metrics.hospitalCount}</span>
                    <span>Kutcha: {item.metrics.kutchaHousingRatio}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

