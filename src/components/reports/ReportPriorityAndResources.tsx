"use client";

import React from "react";
import { SituationReport } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ShieldAlert, Boxes, Route, Building2 } from "lucide-react";

interface ReportPriorityAndResourcesProps {
  report: SituationReport;
}

export function ReportPriorityAndResources({ report }: ReportPriorityAndResourcesProps) {
  return (
    <div className="space-y-4 font-mono text-xs">
      {/* 3. Priority Hotspots Table & Top Factor Breakdown */}
      <Card className="border-border">
        <CardHeader className="py-3 bg-surface-subtle/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-ops-crimson" />
              <span>3. TOP PRIORITY DISASTER SECTORS</span>
            </CardTitle>
            <Badge variant="info" size="sm">Impact Risk Model</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface-subtle text-text-muted text-[10px] uppercase border-b border-border">
              <tr>
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-3 text-center">Impact Score</th>
                <th className="py-2.5 px-3 text-center">Priority</th>
                <th className="py-2.5 px-3">Exposed Pop</th>
                <th className="py-2.5 px-3">Recommended Command Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {report.topPriorityLocations.map((loc) => (
                <tr key={loc.rank} className="hover:bg-surface-elevated transition-colors">
                  <td className="py-2 px-3 text-ops-cyan font-bold">#{loc.rank}</td>
                  <td className="py-2 px-3 font-bold text-text-primary">{loc.locationName}</td>
                  <td className="py-2 px-3 text-text-secondary">{loc.districtCode}</td>
                  <td className="py-2 px-3 text-center font-bold text-ops-crimson">{loc.impactScore}/100</td>
                  <td className="py-2 px-3 text-center">
                    <Badge variant={loc.priorityLevel === "critical" ? "critical" : "warning"} size="sm">
                      {loc.priorityLevel.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-2 px-3 text-text-primary">{loc.populationExposed.toLocaleString("en-IN")}</td>
                  <td className="py-2 px-3 text-text-secondary text-[11px] max-w-xs truncate">{loc.recommendedAction}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Top Priority Factor Breakdown Box */}
          <div className="p-3 bg-surface-subtle/80 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-text-primary uppercase">
                Priority #1 Factor Analysis: {report.highestPriorityBreakdown.locationName}
              </span>
              <span className="text-ops-cyan font-bold">
                Impact Score: {report.highestPriorityBreakdown.impactScore}/100
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <div className="p-1.5 rounded bg-surface border border-border">
                <span className="text-text-muted">Hazard: </span>
                <strong className="text-ops-cyan">{report.highestPriorityBreakdown.hazardRisk}</strong>
              </div>
              <div className="p-1.5 rounded bg-surface border border-border">
                <span className="text-text-muted">Exposure: </span>
                <strong className="text-ops-amber">{report.highestPriorityBreakdown.exposure}</strong>
              </div>
              <div className="p-1.5 rounded bg-surface border border-border">
                <span className="text-text-muted">Vulnerability: </span>
                <strong className="text-ops-crimson">{report.highestPriorityBreakdown.vulnerability}</strong>
              </div>
              <div className="p-1.5 rounded bg-surface border border-border">
                <span className="text-text-muted">Infra Criticality: </span>
                <strong className="text-ops-indigo-light">{report.highestPriorityBreakdown.infrastructure}</strong>
              </div>
            </div>
            <p className="text-[10.5px] text-text-secondary italic">
              Why Prioritized: {report.highestPriorityBreakdown.whyPrioritized}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Logistics & Asset Allocation Matrix */}
      <Card className="border-border">
        <CardHeader className="py-3 bg-surface-subtle/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs flex items-center gap-2">
              <Boxes className="w-4 h-4 text-ops-amber" />
              <span>4. RESOURCE ALLOCATION & OPTIMIZATION BALANCE</span>
            </CardTitle>
            <Badge variant="safe" size="sm">
              +{report.resourceStatus.summaryGainPercent}% Efficiency Gain
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface-subtle text-text-muted text-[10px] uppercase border-b border-border">
              <tr>
                <th className="py-2.5 px-3">Asset Category</th>
                <th className="py-2.5 px-3 text-center">Total Inventory</th>
                <th className="py-2.5 px-3 text-center">Deployed</th>
                <th className="py-2.5 px-3 text-center">Available Depot</th>
                <th className="py-2.5 px-3 text-center">Deficit Shortfall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {report.resourceStatus.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-surface-elevated transition-colors">
                  <td className="py-2 px-3 font-bold text-text-primary">{item.name}</td>
                  <td className="py-2 px-3 text-center font-mono">{item.totalInventory.toLocaleString("en-IN")}</td>
                  <td className="py-2 px-3 text-center font-mono text-ops-cyan">{item.deployed.toLocaleString("en-IN")}</td>
                  <td className="py-2 px-3 text-center font-mono text-ops-emerald">{item.available.toLocaleString("en-IN")}</td>
                  <td className="py-2 px-3 text-center font-mono text-ops-crimson">
                    {item.shortfall > 0 ? `-${item.shortfall.toLocaleString("en-IN")}` : "0"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-2.5 bg-surface-subtle/80 border-t border-border text-[10.5px] text-text-secondary">
            <strong className="text-text-primary">Operational Constraint: </strong>
            {report.resourceStatus.criticalConstraints}
          </div>
        </CardContent>
      </Card>

      {/* 5. Evacuation Operations */}
      <Card className="border-border">
        <CardHeader className="py-2.5 bg-surface-subtle/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs flex items-center gap-2">
              <Route className="w-4 h-4 text-ops-emerald" />
              <span>5. EVACUATION CORRIDOR READINESS</span>
            </CardTitle>
            <Badge
              variant={
                report.evacuationOperations.safetyStatus === "SAFE"
                  ? "safe"
                  : report.evacuationOperations.safetyStatus === "CAUTION"
                  ? "warning"
                  : "critical"
              }
              size="sm"
            >
              {report.evacuationOperations.safetyStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="p-2 rounded bg-surface-elevated border border-border">
            <div className="text-[9px] text-text-muted uppercase">Origin Hotspot</div>
            <div className="font-bold text-text-primary mt-0.5">{report.evacuationOperations.originName}</div>
          </div>
          <div className="p-2 rounded bg-surface-elevated border border-border">
            <div className="text-[9px] text-text-muted uppercase">Designated Camp</div>
            <div className="font-bold text-ops-emerald mt-0.5 truncate">{report.evacuationOperations.destinationShelterName}</div>
          </div>
          <div className="p-2 rounded bg-surface-elevated border border-border">
            <div className="text-[9px] text-text-muted uppercase">Corridor Name</div>
            <div className="font-bold text-ops-cyan mt-0.5 truncate">{report.evacuationOperations.routeName}</div>
          </div>
          <div className="p-2 rounded bg-surface-elevated border border-border">
            <div className="text-[9px] text-text-muted uppercase">Distance & ETA</div>
            <div className="font-bold text-text-primary mt-0.5">
              {report.evacuationOperations.distanceKm} km (~{report.evacuationOperations.estimatedMinutes} mins)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
