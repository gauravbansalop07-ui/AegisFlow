"use client";

import React from "react";
import { SituationReport } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, Clock, ShieldCheck, BellRing, History } from "lucide-react";

interface ReportAuditAndTimelineProps {
  report: SituationReport;
}

export function ReportAuditAndTimeline({ report }: ReportAuditAndTimelineProps) {
  return (
    <div className="space-y-4 font-mono text-xs">
      {/* 6. Response Plan & Decision Audit */}
      <Card className="border-border">
        <CardHeader className="py-3 bg-surface-subtle/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-ops-emerald" />
              <span>6. RESPONSE PLAN AUTHORIZATION & AUDIT LEDGER</span>
            </CardTitle>
            <Badge variant="info" size="sm">{report.responsePlanAudit.length} Records</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface-subtle text-text-muted text-[10px] uppercase border-b border-border">
              <tr>
                <th className="py-2.5 px-3">Plan Code</th>
                <th className="py-2.5 px-3">Target Sector</th>
                <th className="py-2.5 px-3 text-center">Impact Score</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3">Created</th>
                <th className="py-2.5 px-3">Commander Decision / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {report.responsePlanAudit.map((p, idx) => (
                <tr key={idx} className="hover:bg-surface-elevated transition-colors">
                  <td className="py-2 px-3 text-ops-cyan font-bold">{p.planCode}</td>
                  <td className="py-2 px-3 font-bold text-text-primary">{p.targetLocationName}</td>
                  <td className="py-2 px-3 text-center font-bold text-ops-crimson">{p.impactScore}</td>
                  <td className="py-2 px-3 text-center">
                    <Badge
                      variant={
                        p.status.includes("APPROVED")
                          ? "safe"
                          : p.status.includes("REJECTED")
                          ? "critical"
                          : "warning"
                      }
                      size="sm"
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-2 px-3 text-text-muted text-[10px]">{p.createdAt}</td>
                  <td className="py-2 px-3 text-text-secondary text-[11px]">{p.decision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 7. Official Alerts Summary & Decision Timeline (Two Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Official Warnings & Bulletins */}
        <Card className="border-border">
          <CardHeader className="py-2.5 bg-surface-subtle/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs flex items-center gap-2">
                <BellRing className="w-4 h-4 text-ops-amber" />
                <span>7. OFFICIAL ALERTS SITUATION</span>
              </CardTitle>
              <Badge variant="warning" size="sm">
                {report.alertsSummary.unacknowledgedCount} Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] pb-2 border-b border-border">
              <div className="p-1 rounded bg-ops-crimson/10 border border-ops-crimson/30">
                <span className="text-text-muted">Critical: </span>
                <strong className="text-ops-crimson">{report.alertsSummary.criticalCount}</strong>
              </div>
              <div className="p-1 rounded bg-ops-amber/10 border border-ops-amber/30">
                <span className="text-text-muted">High: </span>
                <strong className="text-ops-amber">{report.alertsSummary.highCount}</strong>
              </div>
              <div className="p-1 rounded bg-ops-emerald/10 border border-ops-emerald/30">
                <span className="text-text-muted">Acked: </span>
                <strong className="text-ops-emerald">{report.alertsSummary.acknowledgedCount}</strong>
              </div>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {report.alertsSummary.recentAlerts.map((a, i) => (
                <div
                  key={i}
                  className="p-2 rounded bg-surface-elevated border border-border text-[10.5px] space-y-0.5"
                >
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-ops-cyan font-bold">{a.source.split(" ")[0]}</span>
                    <Badge variant={a.severity === "critical" ? "critical" : "warning"} size="sm">
                      {a.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="font-bold text-text-primary truncate">{a.title}</div>
                  <div className="text-text-secondary text-[10px]">{a.locationName}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tactical Decision Timeline */}
        <Card className="border-border">
          <CardHeader className="py-2.5 bg-surface-subtle/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs flex items-center gap-2">
                <History className="w-4 h-4 text-ops-cyan" />
                <span>8. DECISION REASONING TIMELINE</span>
              </CardTitle>
              <Badge variant="info" size="sm">Audit Trail</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-3 space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {report.timelineEvents.map((t, idx) => (
              <div key={idx} className="p-2 rounded bg-surface-elevated border border-border space-y-1 text-[11px]">
                <div className="flex items-center justify-between text-[9.5px] text-text-muted">
                  <span className="font-bold text-ops-cyan flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{t.time}</span>
                  </span>
                  <span className="text-text-dim">{t.source}</span>
                </div>
                <div className="text-text-primary text-[10.5px] leading-relaxed">{t.event}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 9. Data Integrity & Transparent Models Footer */}
      <div className="p-3 rounded bg-surface-subtle border border-border flex flex-wrap items-center justify-between gap-3 text-[10.5px]">
        <div className="flex items-center gap-2 text-text-muted">
          <ShieldCheck className="w-4 h-4 text-ops-cyan" />
          <strong className="text-text-primary">Data & Model Integrity: </strong>
          <span>Hazard: SIMULATED • Risk Model: DETERMINISTIC • Optimizer: DETERMINISTIC • Router: TOPOLOGICAL</span>
        </div>
        <Badge variant="neutral">AEGISFLOW DECISION SUPPORT PROTOCOL</Badge>
      </div>
    </div>
  );
}
