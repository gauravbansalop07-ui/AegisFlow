"use client";

import React from "react";
import { SituationReport } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  AlertTriangle,
  Flame,
  Boxes,
  BellRing,
  CheckCircle2,
  FileSpreadsheet,
  Waves,
  Gauge,
  CalendarClock,
} from "lucide-react";

interface ReportExecutiveKpiGridProps {
  report: SituationReport;
}

export function ReportExecutiveKpiGrid({ report }: ReportExecutiveKpiGridProps) {
  return (
    <div className="space-y-4 font-mono text-xs">
      {/* 1. Executive Summary Card */}
      <Card className="border-border">
        <CardHeader className="py-3 bg-surface-subtle/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-ops-cyan" />
              <span>1. EXECUTIVE SITUATION BRIEFING</span>
            </CardTitle>
            <Badge variant="info" size="sm">Deterministic Synthesis</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 leading-relaxed text-text-primary text-[11.5px] bg-surface">
          {report.executiveSummary}
        </CardContent>
      </Card>

      {/* 2. Situation KPIs (6 Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Exposed Population */}
        <div className="p-3 rounded bg-surface border border-border space-y-1">
          <div className="text-[10px] text-text-muted uppercase flex items-center gap-1">
            <Users className="w-3 h-3 text-ops-amber" />
            <span>Exposed Pop</span>
          </div>
          <div className="text-base font-bold text-text-primary">
            {report.kpis.populationAffected.toLocaleString("en-IN")}
          </div>
        </div>

        {/* Districts at Risk */}
        <div className="p-3 rounded bg-surface border border-border space-y-1">
          <div className="text-[10px] text-text-muted uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-ops-cyan" />
            <span>At-Risk Districts</span>
          </div>
          <div className="text-base font-bold text-ops-cyan">
            {report.kpis.districtsAtRiskCount} Districts
          </div>
        </div>

        {/* Critical Locations */}
        <div className="p-3 rounded bg-surface border border-ops-crimson/30 space-y-1 bg-ops-crimson/5">
          <div className="text-[10px] text-text-muted uppercase flex items-center gap-1">
            <Flame className="w-3 h-3 text-ops-crimson" />
            <span>Critical Hotspots</span>
          </div>
          <div className="text-base font-bold text-ops-crimson">
            {report.kpis.criticalLocationsCount} Sectors
          </div>
        </div>

        {/* Resources Deployed */}
        <div className="p-3 rounded bg-surface border border-border space-y-1">
          <div className="text-[10px] text-text-muted uppercase flex items-center gap-1">
            <Boxes className="w-3 h-3 text-ops-indigo-light" />
            <span>Assets Staged</span>
          </div>
          <div className="text-base font-bold text-ops-indigo-light">
            {report.kpis.resourcesDeployedCount} Units
          </div>
        </div>

        {/* Active Official Alerts */}
        <div className="p-3 rounded bg-surface border border-border space-y-1">
          <div className="text-[10px] text-text-muted uppercase flex items-center gap-1">
            <BellRing className="w-3 h-3 text-ops-amber" />
            <span>Active Alerts</span>
          </div>
          <div className="text-base font-bold text-ops-amber">
            {report.kpis.activeAlertsCount} Bulletins
          </div>
        </div>

        {/* Commander Approved Plans */}
        <div className="p-3 rounded bg-surface border border-ops-emerald/30 space-y-1 bg-ops-emerald/5">
          <div className="text-[10px] text-text-muted uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-ops-emerald" />
            <span>Approved Plans</span>
          </div>
          <div className="text-base font-bold text-ops-emerald">
            {report.kpis.approvedPlansCount} Plans
          </div>
        </div>
      </div>

      {/* 3. Hazard Situation Strip */}
      <Card className="border-border">
        <CardHeader className="py-2.5 bg-surface-subtle/50">
          <CardTitle className="text-xs flex items-center gap-2">
            <Waves className="w-4 h-4 text-ops-cyan" />
            <span>2. HYDRO-METEOROLOGICAL TELEMETRY STATUS</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded bg-surface-elevated border border-border">
            <div className="text-[10px] text-text-muted uppercase">Precipitation</div>
            <div className="text-xs font-bold text-ops-amber mt-0.5">{report.hazardSummary.rainfallIntensity}</div>
          </div>
          <div className="p-2 rounded bg-surface-elevated border border-border">
            <div className="text-[10px] text-text-muted uppercase">River Level Gauge</div>
            <div className="text-xs font-bold text-ops-crimson mt-0.5">{report.hazardSummary.riverGaugeLevel}</div>
          </div>
          <div className="p-2 rounded bg-surface-elevated border border-border">
            <div className="text-[10px] text-text-muted uppercase">Forecast Horizon</div>
            <div className="text-xs font-bold text-ops-cyan mt-0.5">{report.hazardSummary.forecastHorizon}</div>
          </div>
          <div className="p-2 rounded bg-surface-elevated border border-border">
            <div className="text-[10px] text-text-muted uppercase">Highest Hazard Sector</div>
            <div className="text-xs font-bold text-text-primary mt-0.5">
              {report.hazardSummary.highestHazardDistrict} ({report.hazardSummary.highestHazardScore}/100)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
