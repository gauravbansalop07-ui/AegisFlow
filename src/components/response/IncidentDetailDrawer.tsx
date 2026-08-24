"use client";

import React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Incident, District, HazardGauge, RainfallStation } from "@/types";
import {
  AlertTriangle,
  Waves,
  CloudRain,
  Users,
  Shield,
  Boxes,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useAegisFlow } from "@/context/AegisFlowContext";

interface IncidentDetailDrawerProps {
  incident: Incident | null;
  district?: District | null;
  onClose: () => void;
}

export function IncidentDetailDrawer({
  incident,
  district,
  onClose,
}: IncidentDetailDrawerProps) {
  const { gauges, rainfallStations, showToast } = useAegisFlow();

  if (!incident && !district) return null;

  const targetName = incident ? incident.title : district?.name || "Incident Focus";
  const locationSubtitle = incident
    ? `${incident.locationName} • ${incident.districtName} District`
    : `${district?.name} (${district?.code}) • Elevation ${district?.baselineElevationM}m`;

  const severity = incident ? incident.severity : district?.currentRiskLevel || "moderate";

  // Find linked gauge and rainfall
  const linkedGauge = gauges.find(
    (g) => g.districtId === (incident?.districtId || district?.id)
  );
  const linkedRain = rainfallStations.find(
    (r) => r.districtId === (incident?.districtId || district?.id)
  );

  return (
    <Drawer
      isOpen={!!incident || !!district}
      onClose={onClose}
      title="Tactical Incident Dossier"
      subtitle={locationSubtitle}
      width="lg"
    >
      <div className="space-y-5 font-mono text-xs">
        {/* Header Badge & Title */}
        <div className="p-3.5 rounded bg-surface-elevated border border-border flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={severity === "critical" ? "critical" : severity === "high" ? "warning" : "safe"} dot={true}>
                {severity} STATUS
              </Badge>
              <span className="text-[10px] text-text-dim">
                {incident?.timestamp || "Active Telemetry"}
              </span>
            </div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
              {targetName}
            </h3>
            <p className="text-[11px] text-ops-cyan mt-0.5">
              {incident?.condition || `Primary River: ${district?.primaryRiver}`}
            </p>
          </div>
        </div>

        {/* Situation Briefing */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase text-text-dim font-bold tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-ops-amber" />
            <span>Situation Overview</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed bg-surface-subtle p-3 rounded border border-border">
            {incident?.description ||
              `${district?.name} is experiencing elevated hydrological runoff along the ${district?.primaryRiver} basin. High vulnerability index of ${district?.vulnerabilityIndex}/100 with ${district?.kutchaHousingRatio}% kutcha housing.`}
          </p>
        </div>

        {/* Live Multi-Source Telemetry Strip */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase text-text-dim font-bold tracking-wider">
            Linked Hydro-Meteorological Feeds
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {/* River Gauge Data */}
            <div className="p-2.5 rounded bg-surface-elevated border border-border space-y-1">
              <div className="flex items-center justify-between text-text-muted text-[10px]">
                <span className="flex items-center gap-1">
                  <Waves className="w-3 h-3 text-ops-cyan" />
                  <span>River Gauge</span>
                </span>
                <span className="text-ops-cyan uppercase font-bold">{linkedGauge?.status || "Normal"}</span>
              </div>
              <div className="text-sm font-bold text-text-primary">
                {linkedGauge ? `${linkedGauge.currentLevelM}m` : "84.50m (Stable)"}
              </div>
              <div className="text-[10px] text-text-dim">
                {linkedGauge
                  ? `Danger Mark: ${linkedGauge.dangerLevelM}m (HFL: ${linkedGauge.highestFloodLevelM}m)`
                  : "Within safe threshold"}
              </div>
            </div>

            {/* Rainfall Station Data */}
            <div className="p-2.5 rounded bg-surface-elevated border border-border space-y-1">
              <div className="flex items-center justify-between text-text-muted text-[10px]">
                <span className="flex items-center gap-1">
                  <CloudRain className="w-3 h-3 text-ops-indigo-light" />
                  <span>AWS Doppler Radar</span>
                </span>
                <span className="text-ops-indigo-light uppercase font-bold">{linkedRain?.status || "Normal"}</span>
              </div>
              <div className="text-sm font-bold text-text-primary">
                {linkedRain ? `${linkedRain.rainfall24hMm} mm / 24h` : "45.0 mm"}
              </div>
              <div className="text-[10px] text-text-dim">
                Forecast: {linkedRain ? `${linkedRain.rainfallForecastMm} mm` : "55 mm"}
              </div>
            </div>
          </div>
        </div>

        {/* Demographic & Vulnerability Factors */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase text-text-dim font-bold tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-ops-cyan" />
            <span>Demographic Exposure Factors</span>
          </div>
          <div className="p-3 rounded bg-surface-subtle border border-border grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] text-text-muted">Estimated At Risk</div>
              <div className="text-xs font-bold text-ops-amber mt-0.5">
                {incident?.affectedPopulationEst?.toLocaleString("en-IN") ||
                  district?.population.toLocaleString("en-IN")}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted">Elderly Ratio</div>
              <div className="text-xs font-bold text-text-primary mt-0.5">
                {district?.elderlyRatio || 14.8}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted">Kutcha Dwellings</div>
              <div className="text-xs font-bold text-ops-crimson mt-0.5">
                {district?.kutchaHousingRatio || 72.5}%
              </div>
            </div>
          </div>
        </div>

        {/* Deployed Resources */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase text-text-dim font-bold tracking-wider flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-ops-amber" />
            <span>Staged Resources & Relief Units</span>
          </div>
          <div className="p-3 rounded bg-surface-elevated border border-border text-text-secondary leading-normal text-[11px]">
            {incident?.availableResourcesSummary ||
              "Standard SDRF rescue platoon on standby at district headquarters. Sandbag depots provisioned."}
          </div>
        </div>

        {/* Recommended Attention & Directives */}
        <div className="p-3.5 rounded bg-ops-cyan/10 border border-ops-cyan/30 space-y-1">
          <div className="text-[10px] uppercase font-bold text-ops-cyan flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Recommended Incident Directive</span>
          </div>
          <div className="text-xs text-text-primary font-semibold">
            {incident?.actionRequired ||
              "Initiate pre-emptive standby orders for vulnerable riverine settlements and ensure road bypasses are marked."}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center gap-3">
          <Link href="/response-plan" className="flex-1" onClick={onClose}>
            <Button variant="primary" size="md" className="w-full gap-2">
              <span>Generate Response Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="md"
            onClick={() => {
              showToast({
                title: "Directive Logged",
                message: `Incident bulletin acknowledged by Incident Commander.`,
                type: "success",
              });
              onClose();
            }}
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Acknowledge
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
