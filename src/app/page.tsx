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
  ArrowRight,
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
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border/80">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-mono tracking-tight">
              Assam Flood Emergency Operations
            </h1>
            <Badge variant="safe" dot={true}>OPERATIONAL</Badge>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 font-sans">
            Unified hydro-GIS disaster intelligence • Brahmaputra Basin real-time response
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/hazard-monitor">
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-ops-cyan" />
              <span>Simulate Scenario</span>
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            className="gap-2 font-bold"
            onClick={() => setIsResponseModalOpen(true)}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>ACTIVATE RESPONSE</span>
          </Button>
        </div>
      </div>

      {/* Commander Welcome & Status Briefing Banner */}
      <div className="p-4 sm:p-5 rounded-lg bg-surface-elevated/70 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-ops-cyan/15 border border-ops-cyan/40 flex items-center justify-center text-ops-cyan font-bold text-sm shrink-0">
            GB
          </div>
          <div>
            <div className="font-bold text-text-primary text-sm font-mono flex items-center gap-2 flex-wrap">
              <span>Commander Gaurav Bansal</span>
              <span className="text-xs font-normal text-text-muted font-sans">• EOC Incident Commander</span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed font-sans">
              Hydro telemetry synchronized. <strong className="text-ops-crimson">{simulationResult.criticalDistrictsCount} sectors</strong> at critical flood surge. Follow the workflow: <strong className="text-ops-cyan">Sense → Predict → Prioritize → Act</strong>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <Link href="/risk-prioritization" className="w-full sm:w-auto">
            <Button variant="secondary" size="sm" className="gap-1.5 w-full sm:w-auto justify-center">
              <span>View Priority Queue</span>
              <ChevronRight className="w-4 h-4 text-ops-cyan" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. KPI Summary Cards (Clean, Bold, High Readability) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* KPI 1: Casualties */}
        <Card className="border-border hover:border-ops-crimson/40 transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="text-xs font-mono uppercase text-text-muted font-semibold tracking-wider">
              Casualties
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-ops-crimson mt-1 tracking-tight">
              {simulationResult.simulatedCasualties}
            </div>
            <div className="text-xs text-text-secondary mt-1 font-sans">
              Reported across sectors
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Population Affected */}
        <Card className="border-border hover:border-ops-amber/40 transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="text-xs font-mono uppercase text-text-muted font-semibold tracking-wider">
              Exposed Pop
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-ops-amber mt-1 tracking-tight">
              {(simulationResult.totalPopulationAffected / 100000).toFixed(2)}L+
            </div>
            <div className="text-xs text-text-secondary mt-1 font-sans">
              {simulationResult.districtsAtRiskCount} districts in danger
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Districts in Danger */}
        <Card className="border-border hover:border-ops-cyan/40 transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="text-xs font-mono uppercase text-text-muted font-semibold tracking-wider">
              Districts at Risk
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-text-primary mt-1 tracking-tight">
              {simulationResult.districtsAtRiskCount} <span className="text-sm text-text-muted font-normal">/ 34</span>
            </div>
            <div className="text-xs text-ops-crimson mt-1 font-sans font-medium">
              {simulationResult.criticalDistrictsCount} Critical Hotspots
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Relief Camps */}
        <Card className="border-border hover:border-ops-emerald/40 transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="text-xs font-mono uppercase text-text-muted font-semibold tracking-wider">
              Relief Shelters
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-ops-emerald mt-1 tracking-tight">
              {simulationResult.reliefCampsRequired.toLocaleString("en-IN")}+
            </div>
            <div className="text-xs text-text-secondary mt-1 font-sans">
              74% capacity occupied
            </div>
          </CardContent>
        </Card>

        {/* KPI 5: Resources Deployed */}
        <Card className="col-span-2 sm:col-span-1 border-border hover:border-ops-indigo/40 transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="text-xs font-mono uppercase text-text-muted font-semibold tracking-wider">
              Resources Staged
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-ops-indigo-light mt-1 tracking-tight">
              {simulationResult.resourcesDeployedCount.toLocaleString("en-IN")}+
            </div>
            <div className="text-xs text-text-secondary mt-1 font-sans">
              Active equipment units
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Main Operations Area (Map: ~65%, Incidents: ~35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Main Map Container */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between px-1 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs sm:text-sm font-bold text-text-primary uppercase tracking-wider">
                Assam Flood Inundation & River GIS Map
              </span>
              <Badge variant="info" size="sm">LIVE GIS</Badge>
            </div>
            <span className="text-xs font-mono text-text-muted">
              Select district or hotspot to inspect telemetry
            </span>
          </div>

          <div className="rounded-lg border border-border overflow-hidden shadow-sm">
            <AssamOverviewMap
              className="w-full h-[360px] xs:h-[420px] sm:h-[480px] lg:h-[540px]"
              districts={districts}
              incidents={incidents}
              shelters={shelters}
              gauges={gauges}
              inundationPolygons={inundationPolygons}
              onSelectIncident={handleSelectIncident}
              onSelectDistrict={handleSelectDistrict}
            />
          </div>
        </div>

        {/* Prioritized Incidents Panel */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-ops-crimson" />
              <span className="font-mono text-xs sm:text-sm font-bold text-text-primary uppercase tracking-wider">
                Prioritized Incidents
              </span>
            </div>
            <Link
              href="/risk-prioritization"
              className="text-xs font-mono text-ops-cyan hover:underline flex items-center gap-1"
            >
              <span>Full Queue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
            {incidents.map((incident) => {
              const isCrit = incident.severity === "critical";
              const isHigh = incident.severity === "high";

              return (
                <div
                  key={incident.id}
                  onClick={() => handleSelectIncident(incident)}
                  className={`p-3.5 sm:p-4 rounded-lg border transition-all duration-150 cursor-pointer text-xs font-mono group hover:border-ops-cyan/60 ${
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
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3 text-text-muted" />
                        {incident.timestamp}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-ops-cyan group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <div className="font-bold text-text-primary text-sm uppercase tracking-wide mt-2">
                    {incident.title}
                  </div>

                  <div className="text-xs font-semibold text-ops-cyan mt-0.5">
                    {incident.condition}
                  </div>

                  <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed font-sans">
                    {incident.locationName} • {incident.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-text-muted">
                      Action: <strong className="text-text-primary font-mono">{incident.actionRequired}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Operational Intelligence Row (3 Cards with generous padding) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Col 1: Impact Priority Distribution Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-ops-cyan" />
                <span>IMPACT DISTRIBUTION</span>
              </CardTitle>
              <Link
                href="/risk-prioritization"
                className="text-xs font-mono text-ops-cyan hover:underline flex items-center gap-0.5"
              >
                <span>Queue</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <CardDescription>
              Categorized by Impact Risk Model (Hazard × Vulnerability)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <RiskDistributionChart districts={districts} />
          </CardContent>
        </Card>

        {/* Col 2: River Gauges Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-ops-cyan" />
                <span>HYDROLOGICAL GAUGES</span>
              </CardTitle>
              <Badge variant="info" size="sm">CWC</Badge>
            </div>
            <CardDescription>
              Brahmaputra and major tributary telemetry stations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-2 font-mono text-xs max-h-56 overflow-y-auto pr-1">
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
                  className="p-2.5 rounded-md bg-surface-elevated border border-border space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-text-primary text-xs uppercase">
                        {gauge.stationName}
                      </span>
                      <span className="text-xs text-text-muted ml-1">
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

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">
                      Current: <strong className="text-text-primary">{gauge.currentLevelM}m</strong>
                    </span>
                    <span className="text-text-muted">
                      Danger: {gauge.dangerLevelM}m
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
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-ops-amber" />
                <span>RESOURCE INVENTORY</span>
              </CardTitle>
              <Link
                href="/resources"
                className="text-xs font-mono text-ops-cyan hover:underline flex items-center gap-1"
              >
                <span>Matrix</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <CardDescription>
              Staged state-wide demonstration relief inventory
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-2 font-mono text-xs max-h-56 overflow-y-auto pr-1">
            {resources.map((res) => {
              const percentAvail = Math.round((res.available / res.totalInventory) * 100);

              return (
                <div
                  key={res.id}
                  className="p-2.5 rounded-md bg-surface-elevated border border-border flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-text-primary">
                      {res.name}
                    </div>
                    <div className="text-[11px] text-text-muted">
                      {res.currentlyDeployed.toLocaleString("en-IN")} staged / {res.totalInventory.toLocaleString("en-IN")} total
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-ops-cyan">
                      {res.available.toLocaleString("en-IN")} {res.unit}
                    </div>
                    <div className="text-[10px] text-text-muted">
                      {percentAvail}% Avail
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* 5. Quick Actions Footer Bar */}
      <Card className="bg-surface-elevated/70 border-border">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-ops-cyan/10 border border-ops-cyan/30 flex items-center justify-center text-ops-cyan shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-text-primary uppercase tracking-wide">
                Commander Workflow Directives
              </div>
              <p className="text-xs text-text-secondary mt-0.5 font-sans">
                Direct decision-support routing to prioritize hotspots, optimize staging, and approve directives.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <Button
              variant="destructive"
              size="sm"
              className="gap-2 text-xs font-bold flex-1 sm:flex-initial justify-center"
              onClick={() => setIsResponseModalOpen(true)}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>ACTIVATE RESPONSE</span>
            </Button>

            <Link href="/risk-prioritization" className="flex-1 sm:flex-initial">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs w-full justify-center">
                <span>PRIORITY QUEUE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            <Link href="/alerts" className="flex-1 sm:flex-initial">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs w-full justify-center">
                <span>ALERTS</span>
                <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
              </Button>
            </Link>

            <Link href="/resources" className="flex-1 sm:flex-initial">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs w-full justify-center">
                <span>RESOURCES</span>
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

