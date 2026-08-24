"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AssamOverviewMap } from "@/components/map/AssamOverviewMap";
import { AlertSummaryCards } from "@/components/alerts/AlertSummaryCards";
import { AlertFilterBar } from "@/components/alerts/AlertFilterBar";
import { AlertFeedTable } from "@/components/alerts/AlertFeedTable";
import { AlertDetailDrawer } from "@/components/alerts/AlertDetailDrawer";
import { useAegisFlow } from "@/context/AegisFlowContext";
import { Alert } from "@/types";
import {
  BellRing,
  ShieldCheck,
  Radio,
  RotateCcw,
  SlidersHorizontal,
  Info,
  Layers,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Tooltip } from "@/components/ui/Tooltip";

export default function AlertsPage() {
  const {
    alerts,
    toggleAlertStatus,
    impactScores,
    optimizationResult,
    routingResult,
    districts,
    incidents,
    shelters,
    gauges,
    inundationPolygons,
    simulationState,
  } = useAegisFlow();

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleResetFilters = () => {
    setSearchQuery("");
    setSourceFilter("all");
    setSeverityFilter("all");
    setStatusFilter("all");
  };

  // Filtered Alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = a.title.toLowerCase().includes(q);
        const matchLoc = a.locationName.toLowerCase().includes(q);
        const matchDesc = a.description.toLowerCase().includes(q);
        const matchSource = a.source.toLowerCase().includes(q);
        if (!matchTitle && !matchLoc && !matchDesc && !matchSource) return false;
      }

      // Source
      if (sourceFilter !== "all") {
        if (sourceFilter === "CWC" && !a.source.includes("CWC")) return false;
        if (sourceFilter === "IMD" && !a.source.includes("IMD")) return false;
        if (sourceFilter === "ASDMA" && !a.source.includes("ASDMA")) return false;
        if (sourceFilter === "District" && !a.source.includes("District")) return false;
      }

      // Severity
      if (severityFilter !== "all" && a.severity !== severityFilter) return false;

      // Status
      if (statusFilter !== "all" && a.status !== statusFilter) return false;

      return true;
    });
  }, [alerts, searchQuery, sourceFilter, severityFilter, statusFilter]);

  // Operational correlation lookup for selected alert
  const correlatedImpactScore = useMemo(() => {
    if (!selectedAlert) return null;
    return impactScores.find((r) => r.locationId === selectedAlert.districtId) || null;
  }, [selectedAlert, impactScores]);

  const correlatedAllocation = useMemo(() => {
    if (!selectedAlert) return null;
    return optimizationResult.allocations.find((a) => a.districtId === selectedAlert.districtId) || null;
  }, [selectedAlert, optimizationResult]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Situation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-border">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-text-primary font-mono uppercase tracking-wider flex items-center gap-2">
              <BellRing className="w-4 h-4 sm:w-5 sm:h-5 text-ops-cyan" />
              <span>Official Intelligence & Warning Feed</span>
            </h1>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="info" size="sm">CWC</Badge>
              <Badge variant="warning" size="sm">IMD</Badge>
              <Badge variant="neutral" size="sm">ASDMA</Badge>
              <Tooltip content="Preserves official agency warnings as authoritative. Ingests simulated hydrological, meteorological, and state emergency alerts.">
                <span className="cursor-help text-text-muted hover:text-ops-cyan">
                  <Info className="w-3.5 h-3.5" />
                </span>
              </Tooltip>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-text-secondary mt-1 font-mono">
            Authoritative multi-agency disaster bulletins correlated with AegisFlow impact models
          </p>
        </div>

        {/* Tune Simulation Link */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono">
          <Link href="/hazard-monitor">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-ops-cyan" />
              <span>Tune Simulation</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Alert Summary Cards */}
      <AlertSummaryCards alerts={alerts} />

      {/* 3. Filter & Search Controls */}
      <AlertFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sourceFilter={sourceFilter}
        onSourceChange={setSourceFilter}
        severityFilter={severityFilter}
        onSeverityChange={setSeverityFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Main Feed + Mini GIS Spatial Context Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Alerts Table Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between px-1 font-mono text-xs text-text-muted">
            <span className="text-[11px]">
              Showing <strong className="text-text-primary">{filteredAlerts.length}</strong> of {alerts.length} Bulletins
            </span>
            <span className="text-[10px] text-ops-emerald flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>Feed Live</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <AlertFeedTable
              alerts={filteredAlerts}
              onSelectAlert={(a) => setSelectedAlert(a)}
              onToggleAcknowledge={(id) => toggleAlertStatus(id)}
            />
          </div>
        </div>

        {/* GIS Map & Tactical Authority Card (4 cols) */}
        <div className="lg:col-span-4 space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 font-mono text-[11px] sm:text-xs text-text-primary uppercase tracking-wider font-semibold">
              <span>Geographic Distribution</span>
              <Badge variant="neutral" size="sm">GIS Sync</Badge>
            </div>

            <AssamOverviewMap
              className="w-full h-[280px] xs:h-[320px]"
              districts={districts}
              incidents={incidents}
              shelters={shelters}
              gauges={gauges}
              inundationPolygons={inundationPolygons}
              routingResult={routingResult}
            />
          </div>

          {/* Authoritative Protocol Card */}
          <div className="p-3 sm:p-3.5 rounded bg-surface border border-border space-y-1.5 font-mono text-xs">
            <div className="flex items-center gap-2 text-ops-cyan font-bold text-[11px] uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Integration Principle</span>
            </div>
            <p className="text-text-secondary text-[10.5px] sm:text-[11px] leading-relaxed">
              AegisFlow preserves official ASDMA, CWC, and IMD warnings as authoritative. Warnings are correlated with vulnerability indices to formulate decision recommendations for the Incident Commander.
            </p>
          </div>
        </div>
      </div>

      {/* Selected Alert Intelligence Drawer */}
      <AlertDetailDrawer
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onToggleAcknowledge={(id) => toggleAlertStatus(id)}
        impactScore={correlatedImpactScore}
        resourceAllocation={correlatedAllocation}
        routingResult={routingResult}
      />
    </div>
  );
}
