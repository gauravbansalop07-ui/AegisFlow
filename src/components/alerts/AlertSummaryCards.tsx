"use client";

import React from "react";
import { Alert } from "@/types";
import { Card, CardContent } from "@/components/ui/Card";
import { AlertOctagon, AlertTriangle, AlertCircle, BellRing } from "lucide-react";

interface AlertSummaryCardsProps {
  alerts: Alert[];
}

export function AlertSummaryCards({ alerts }: AlertSummaryCardsProps) {
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const highCount = alerts.filter((a) => a.severity === "high").length;
  const moderateCount = alerts.filter((a) => a.severity === "moderate").length;
  const advisoryCount = alerts.filter((a) => a.severity === "low" || a.severity === "safe").length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
      {/* Critical */}
      <Card className="border-ops-crimson/40 bg-surface shadow-glow-crimson">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-text-muted uppercase font-bold">Critical Warnings</div>
            <div className="text-xl font-bold text-ops-crimson mt-0.5">{criticalCount}</div>
            <div className="text-[9px] text-text-secondary mt-0.5">Immediate Evac Trigger</div>
          </div>
          <div className="w-8 h-8 rounded bg-ops-crimson/15 text-ops-crimson flex items-center justify-center">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      {/* High */}
      <Card className="border-ops-amber/40 bg-surface">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-text-muted uppercase font-bold">High Alerts</div>
            <div className="text-xl font-bold text-ops-amber mt-0.5">{highCount}</div>
            <div className="text-[9px] text-text-secondary mt-0.5">Surge / Heavy Rainfall</div>
          </div>
          <div className="w-8 h-8 rounded bg-ops-amber/15 text-ops-amber flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      {/* Moderate */}
      <Card className="border-border bg-surface">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-text-muted uppercase font-bold">Moderate Bulletins</div>
            <div className="text-xl font-bold text-text-primary mt-0.5">{moderateCount}</div>
            <div className="text-[9px] text-text-secondary mt-0.5">Capacity & Monitoring</div>
          </div>
          <div className="w-8 h-8 rounded bg-surface-elevated text-text-muted flex items-center justify-center border border-border">
            <AlertCircle className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      {/* Advisory */}
      <Card className="border-border bg-surface">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-text-muted uppercase font-bold">Advisories</div>
            <div className="text-xl font-bold text-ops-cyan mt-0.5">{advisoryCount}</div>
            <div className="text-[9px] text-text-secondary mt-0.5">Surveillance Routine</div>
          </div>
          <div className="w-8 h-8 rounded bg-ops-cyan/10 text-ops-cyan flex items-center justify-center border border-ops-cyan/20">
            <BellRing className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
