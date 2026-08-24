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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold text-text-primary font-mono uppercase tracking-wider">
              Exposure & Vulnerability Map
            </h1>
            <Badge variant="neutral" size="sm">GIS Layer</Badge>
            <Badge variant="info" size="sm">Multi-Factor</Badge>
          </div>
          <p className="text-[11px] sm:text-xs text-text-secondary mt-1 font-mono">
            Spatial overlay combining flood inundation envelopes with demographic vulnerability and critical infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
          <Badge variant="warning" dot={true} size="sm">
            {simulationResult.districtsAtRiskCount} Districts Exposed
          </Badge>
          <Badge variant="critical" size="sm">
            {simulationResult.totalPopulationAffected.toLocaleString("en-IN")} at Risk
          </Badge>
        </div>
      </div>

      {/* Main Grid: Map + Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Map (3 cols) */}
        <div className="lg:col-span-3 space-y-3 sm:space-y-4">
          <div className="rounded-lg border border-border overflow-hidden relative shadow-lg">
            <AssamLeafletMap className="w-full h-[320px] xs:h-[380px] sm:h-[460px] lg:h-[540px]" />
          </div>

          {/* Vulnerability Heatmap Legend Strip */}
          <Card className="border-border">
            <CardContent className="p-2.5 sm:p-3">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="font-bold text-text-primary uppercase flex items-center gap-1.5 text-[11px] sm:text-xs">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ops-cyan" />
                  <span>Vulnerability Legend:</span>
                </span>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px]">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-ops-crimson inline-block"></span>
                    <span className="text-text-secondary">Extreme (&gt;80)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-ops-amber inline-block"></span>
                    <span className="text-text-secondary">High (60-80)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-ops-indigo-light inline-block"></span>
                    <span className="text-text-secondary">Mod (40-60)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-ops-emerald inline-block"></span>
                    <span className="text-text-secondary">Low (&lt;40)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Layer Toggles & Top Exposed Sectors (1 col) */}
        <div className="space-y-3 sm:space-y-4 font-mono text-xs">
          {/* Layer Controls */}
          <Card>
            <CardHeader className="py-2.5 sm:py-3 bg-surface-subtle/50">
              <CardTitle className="text-xs flex items-center gap-2">
                <Layers className="w-4 h-4 text-ops-cyan" />
                <span>Multi-Source Overlays</span>
              </CardTitle>
              <CardDescription className="text-[10px]">Toggle spatial data layers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-2.5 sm:p-3">
              <label className="flex items-center justify-between p-2 rounded bg-surface-elevated border border-border cursor-pointer hover:border-ops-cyan/50 transition-colors">
                <span className="flex items-center gap-2 text-text-primary text-[11px]">
                  <Waves className="w-3.5 h-3.5 text-ops-cyan" />
                  <span>Inundation Envelope</span>
                </span>
                <input
                  type="checkbox"
                  checked={layers.inundation}
                  onChange={() => toggleLayer("inundation")}
                  className="accent-ops-cyan"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded bg-surface-elevated border border-border cursor-pointer hover:border-ops-cyan/50 transition-colors">
                <span className="flex items-center gap-2 text-text-primary text-[11px]">
                  <Users className="w-3.5 h-3.5 text-ops-amber" />
                  <span>Demographic Vuln.</span>
                </span>
                <input
                  type="checkbox"
                  checked={layers.vulnerability}
                  onChange={() => toggleLayer("vulnerability")}
                  className="accent-ops-cyan"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded bg-surface-elevated border border-border cursor-pointer hover:border-ops-cyan/50 transition-colors">
                <span className="flex items-center gap-2 text-text-primary text-[11px]">
                  <Building2 className="w-3.5 h-3.5 text-ops-crimson" />
                  <span>Critical Infra</span>
                </span>
                <input
                  type="checkbox"
                  checked={layers.infrastructure}
                  onChange={() => toggleLayer("infrastructure")}
                  className="accent-ops-cyan"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded bg-surface-elevated border border-border cursor-pointer hover:border-ops-cyan/50 transition-colors">
                <span className="flex items-center gap-2 text-text-primary text-[11px]">
                  <Home className="w-3.5 h-3.5 text-ops-emerald" />
                  <span>Evacuation Shelters</span>
                </span>
                <input
                  type="checkbox"
                  checked={layers.shelters}
                  onChange={() => toggleLayer("shelters")}
                  className="accent-ops-cyan"
                />
              </label>
            </CardContent>
          </Card>

          {/* Top Exposed Districts Panel */}
          <Card>
            <CardHeader className="py-2 sm:py-2.5 bg-surface-subtle/50">
              <CardTitle className="text-xs flex items-center gap-2">
                <Flame className="w-4 h-4 text-ops-crimson" />
                <span>Top Exposed Districts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {topExposed.map((item, idx) => (
                <div
                  key={item.locationId}
                  className="p-2 rounded bg-surface-elevated border border-border space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
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
                  <div className="flex items-center justify-between text-[10px] text-text-secondary">
                    <span>Pop Exposed:</span>
                    <strong className="text-text-primary">
                      {item.populationExposed.toLocaleString("en-IN")}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-[9.5px] text-text-dim">
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
