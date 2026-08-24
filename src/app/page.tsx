"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AssamOverviewMap } from "@/components/map/AssamOverviewMap";
import { RiskDistributionChart } from "@/components/charts/RiskDistributionChart";
import { IncidentDetailDrawer } from "@/components/response/IncidentDetailDrawer";
import { QuickActionModal } from "@/components/response/QuickActionModal";
import {
  Activity,
  AlertTriangle,
  Users,
  Building2,
  Boxes,
  Waves,
  ShieldAlert,
  ChevronRight,
  Clock,
  Compass,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useAegisFlow } from "@/context/AegisFlowContext";
import { Incident, District } from "@/types";

export default function OverviewPage() {
  const {
    districts,
    incidents,
    gauges,
    shelters,
    resources,
    inundationPolygons,
    simulationState,
    simulationResult,
    impactScores,
    showToast,
  } = useAegisFlow();

  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const [activeDistrict, setActiveDistrict] = useState<District | null>(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

  const handleSelectIncident = (incident: Incident) => {
    setActiveDistrict(null);
    setActiveIncident(incident);
  };

  const handleSelectDistrict = (district: District) => {
    const matchedIncident = incidents.find((i) => i.districtId === district.id);
    if (matchedIncident) {
      setActiveDistrict(null);
      setActiveIncident(matchedIncident);
    } else {
      setActiveIncident(null);
      setActiveDistrict(district);
    }
  };

  const handleCloseDrawer = () => {
    setActiveIncident(null);
    setActiveDistrict(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Situation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold text-text-primary font-mono uppercase tracking-wider">
              Assam Flood Situation
            </h1>
            <div className="flex items-center gap-1.5">
              <Badge variant="warning" dot={true}>
                SIMULATION MODE
              </Badge>
              <Badge variant="neutral">DEMO DATA</Badge>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-ops-emerald/10 text-ops-emerald border border-ops-emerald/30">
                <span className="w-1.5 h-1.5 rounded-full bg-ops-emerald animate-pulse" />
                OPERATIONAL
              </span>
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-1 font-mono">
            Unified disaster intelligence • Flood response operations • Brahmaputra Basin Hydro-GIS
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-mono text-text-muted">Situation Sync</div>
            <div className="text-xs font-mono font-bold text-ops-cyan">
              {simulationState.lastUpdatedTimestamp}
            </div>
          </div>
          <Link href="/hazard-monitor">
            <Button variant="outline" size="sm" className="gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-ops-cyan" />
              <span>Simulate Scenarios</span>
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            className="gap-1.5"
            onClick={() => setIsResponseModalOpen(true)}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>ACTIVATE RESPONSE</span>
          </Button>
        </div>
      </div>

      {/* Commander Welcome & Status Briefing Banner */}
      <div className="p-3.5 rounded-lg bg-gradient-to-r from-ops-cyan/15 via-surface-elevated to-surface border border-ops-cyan/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-ops-cyan/20 border border-ops-cyan/50 flex items-center justify-center text-ops-cyan font-bold text-xs shrink-0 shadow-glow-cyan">
            GB
          </div>
          <div>
            <div className="font-bold text-text-primary text-xs flex items-center gap-2">
              <span>Commander Gaurav Bansal</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-ops-cyan/20 text-ops-cyan border border-ops-cyan/40">
                EOC ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Telemetry synchronized. {simulationResult.criticalDistrictsCount} sectors at critical flood surge. Follow the operational workflow: <strong className="text-ops-cyan">Sense → Predict → Prioritize → Act</strong>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/risk-prioritization">
            <Button variant="secondary" size="sm" className="text-xs h-7 gap-1 hover:border-ops-cyan/50">
              <span>View Top Priorities</span>
              <ChevronRight className="w-3 h-3 text-ops-cyan" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Casualties */}
        <Card className="hover:border-ops-crimson/50 transition-colors">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                Simulated Casualties
              </div>
              <div className="text-2xl font-bold font-mono text-ops-crimson mt-0.5 tracking-tight">
                {simulationResult.simulatedCasualties}
              </div>
              <div className="text-[10px] font-mono text-text-secondary mt-0.5">
                Deaths reported
              </div>
            </div>
            <div className="w-9 h-9 rounded bg-ops-crimson/10 border border-ops-crimson/30 flex items-center justify-center text-ops-crimson shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Population Affected */}
        <Card className="hover:border-ops-amber/50 transition-colors">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                Population Affected
              </div>
              <div className="text-2xl font-bold font-mono text-ops-amber mt-0.5 tracking-tight">
                {(simulationResult.totalPopulationAffected / 100000).toFixed(2)}L+
              </div>
              <div className="text-[10px] font-mono text-text-secondary mt-0.5">
                Across {simulationResult.districtsAtRiskCount} districts
              </div>
            </div>
            <div className="w-9 h-9 rounded bg-ops-amber/10 border border-ops-amber/30 flex items-center justify-center text-ops-amber shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Districts Impacted */}
        <Card className="hover:border-ops-cyan/50 transition-colors">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                Districts In Danger
              </div>
              <div className="text-2xl font-bold font-mono text-text-primary mt-0.5 tracking-tight">
                {simulationResult.districtsAtRiskCount} <span className="text-xs text-text-muted font-normal">/ 34</span>
              </div>
              <div className="text-[10px] font-mono text-ops-crimson mt-0.5">
                {simulationResult.criticalDistrictsCount} Critical Hotspots
              </div>
            </div>
            <div className="w-9 h-9 rounded bg-surface-elevated border border-border flex items-center justify-center text-ops-cyan shrink-0">
              <Activity className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Relief Camps */}
        <Card className="hover:border-ops-emerald/50 transition-colors">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                Relief Camps Active
              </div>
              <div className="text-2xl font-bold font-mono text-ops-emerald mt-0.5 tracking-tight">
                {simulationResult.reliefCampsRequired.toLocaleString("en-IN")}+
              </div>
              <div className="text-[10px] font-mono text-text-secondary mt-0.5">
                Operational • 74% Capacity
              </div>
            </div>
            <div className="w-9 h-9 rounded bg-ops-emerald/10 border border-ops-emerald/30 flex items-center justify-center text-ops-emerald shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 5: Resources Deployed */}
        <Card className="hover:border-ops-indigo/50 transition-colors">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                Resources Deployed
              </div>
              <div className="text-2xl font-bold font-mono text-ops-indigo-light mt-0.5 tracking-tight">
                {simulationResult.resourcesDeployedCount.toLocaleString("en-IN")}+
              </div>
              <div className="text-[10px] font-mono text-text-secondary mt-0.5">
                NDRF/SDRF batt. active
              </div>
            </div>
            <div className="w-9 h-9 rounded bg-ops-indigo/10 border border-ops-indigo/30 flex items-center justify-center text-ops-indigo-light shrink-0">
              <Boxes className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Main Operations Area (Map: ~65%, Incidents: ~35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Map */}
        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-text-primary uppercase tracking-wider">
                Brahmaputra Basin Operations Intelligence Map
              </span>
              <Badge variant="info">LIVE GIS</Badge>
            </div>
            <span className="text-[11px] font-mono text-text-muted">
              Interactive • Click hot-spots for telemetry
            </span>
          </div>

          <AssamOverviewMap
            className="w-full h-[520px]"
            districts={districts}
            incidents={incidents}
            shelters={shelters}
            gauges={gauges}
            inundationPolygons={inundationPolygons}
            onSelectIncident={handleSelectIncident}
            onSelectDistrict={handleSelectDistrict}
          />
        </div>

        {/* Prioritized Incidents Panel */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-ops-crimson" />
              <span className="font-mono text-xs font-semibold text-text-primary uppercase tracking-wider">
                Prioritized Incidents
              </span>
            </div>
            <Link
              href="/risk-prioritization"
              className="text-[10px] font-mono text-ops-cyan hover:underline flex items-center gap-0.5"
            >
              <span>Priority Queue</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {incidents.map((incident) => {
              const isCrit = incident.severity === "critical";
              const isHigh = incident.severity === "high";

              return (
                <div
                  key={incident.id}
                  onClick={() => handleSelectIncident(incident)}
                  className={`p-3.5 rounded border transition-all duration-150 cursor-pointer text-xs font-mono group hover:border-ops-cyan/60 ${
                    isCrit
                      ? "bg-surface border-ops-crimson/40 hover:bg-surface-elevated"
                      : isHigh
                      ? "bg-surface border-ops-amber/40 hover:bg-surface-elevated"
                      : "bg-surface border-border hover:bg-surface-elevated"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isCrit ? "critical" : isHigh ? "warning" : "safe"}
                        dot={isCrit}
                        size="sm"
                      >
                        {incident.severity}
                      </Badge>
                      <span className="text-[10px] text-text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3 text-text-dim" />
                        {incident.timestamp}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover:text-ops-cyan group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <div className="font-bold text-text-primary text-xs uppercase tracking-wide mt-2">
                    {incident.title}
                  </div>

                  <div className="text-[11px] font-semibold text-ops-cyan mt-0.5">
                    {incident.condition}
                  </div>

                  <div className="text-[10px] text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                    {incident.locationName} • {incident.description}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between">
                    <div className="text-[10px] text-text-dim uppercase">
                      Action: <span className="text-text-primary font-medium">{incident.actionRequired}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Operational Intelligence Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Col 1: Impact Priority Distribution Chart */}
        <Card>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-ops-cyan" />
                <span>IMPACT PRIORITY DISTRIBUTION</span>
              </CardTitle>
              <Link
                href="/risk-prioritization"
                className="text-[10px] font-mono text-ops-cyan hover:underline flex items-center gap-0.5"
              >
                <span>Full Queue</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <CardDescription>
              Categorized by AegisFlow Impact Risk Model (Hazard × Vulnerability/Exposure)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-1 pb-3">
            <RiskDistributionChart districts={districts} />
          </CardContent>
        </Card>

        {/* Col 2: River Gauges Status */}
        <Card>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Waves className="w-3.5 h-3.5 text-ops-cyan" />
                <span>Key Hydrological Gauges</span>
              </CardTitle>
              <Badge variant="info" size="sm">
                Simulated CWC
              </Badge>
            </div>
            <CardDescription>
              Brahmaputra and major tributary hydro-monitoring stations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-1 font-mono text-xs max-h-48 overflow-y-auto pr-1">
            {gauges.slice(0, 4).map((gauge) => {
              const isCrit = gauge.status === "critical";
              const isAbove = gauge.status === "above_danger";
              const isNear = gauge.status === "near_danger";

              const percentageToDanger = Math.min(
                100,
                Math.max(
                  10,
                  ((gauge.currentLevelM - gauge.warningLevelM) /
                    (gauge.highestFloodLevelM - gauge.warningLevelM)) *
                    100
                )
              );

              return (
                <div
                  key={gauge.id}
                  className="p-2.5 rounded bg-surface-elevated border border-border space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-text-primary text-[11px] uppercase">
                        {gauge.stationName}
                      </span>
                      <span className="text-[10px] text-text-muted ml-1.5">
                        ({gauge.riverName})
                      </span>
                    </div>
                    <Badge
                      variant={isCrit ? "critical" : isAbove ? "warning" : isNear ? "warning" : "safe"}
                      size="sm"
                    >
                      {gauge.status.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-secondary">
                      Current: <strong className="text-text-primary">{gauge.currentLevelM}m</strong>
                    </span>
                    <span className="text-text-dim text-[10px]">
                      Danger: {gauge.dangerLevelM}m (HFL {gauge.highestFloodLevelM}m)
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-surface-subtle rounded-full overflow-hidden border border-border/40">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCrit ? "bg-ops-crimson" : isAbove ? "bg-ops-amber" : "bg-ops-cyan"
                      }`}
                      style={{ width: `${percentageToDanger}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Col 3: Resource Inventory Status */}
        <Card>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Boxes className="w-3.5 h-3.5 text-ops-amber" />
                <span>Available Resource Inventory</span>
              </CardTitle>
              <Link
                href="/resources"
                className="text-[10px] font-mono text-ops-cyan hover:underline flex items-center gap-1"
              >
                <span>View Details</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <CardDescription>
              Staged state-wide demonstration relief equipment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-1 font-mono text-xs max-h-48 overflow-y-auto pr-1">
            {resources.map((res) => {
              const percentAvail = Math.round((res.available / res.totalInventory) * 100);

              return (
                <div
                  key={res.id}
                  className="p-2 rounded bg-surface-elevated border border-border flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-[11px] font-bold text-text-primary">
                      {res.name}
                    </div>
                    <div className="text-[10px] text-text-dim">
                      {res.currentlyDeployed.toLocaleString("en-IN")} deployed / {res.totalInventory.toLocaleString("en-IN")} total
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-ops-cyan">
                      {res.available.toLocaleString("en-IN")} {res.unit}
                    </div>
                    <div className="text-[9px] text-text-muted font-medium">
                      {percentAvail}% Available
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* 5. Quick Actions Footer Bar */}
      <Card className="bg-surface-subtle border-border-strong">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-ops-cyan/10 border border-ops-cyan/30 flex items-center justify-center text-ops-cyan shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-text-primary uppercase tracking-wide">
                Incident Commander Quick Actions
              </div>
              <p className="text-[11px] font-mono text-text-secondary">
                Direct workflow routing to prioritize hotspots, mobilize staged assets, and approve evacuation directives.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5"
              onClick={() => setIsResponseModalOpen(true)}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>ACTIVATE RESPONSE</span>
            </Button>

            <Link href="/risk-prioritization">
              <Button variant="primary" size="sm" className="gap-1.5">
                <span>VIEW PRIORITY QUEUE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            <Link href="/alerts">
              <Button variant="outline" size="sm" className="gap-1.5">
                <span>VIEW ALERTS</span>
                <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
              </Button>
            </Link>

            <Link href="/resources">
              <Button variant="outline" size="sm" className="gap-1.5">
                <span>RESOURCE MAP</span>
                <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Tactical Incident Detail Drawer */}
      <IncidentDetailDrawer
        incident={activeIncident}
        district={activeDistrict}
        onClose={handleCloseDrawer}
      />

      {/* Response Plan Activation Confirmation Modal */}
      <QuickActionModal
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
      />
    </div>
  );
}
