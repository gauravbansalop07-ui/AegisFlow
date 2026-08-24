"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ResponsePlan, ResponsePlanAuditEntry } from "@/types";
import { History, FileCheck2, Clock, ChevronRight } from "lucide-react";

interface PlanHistoryAndAuditProps {
  currentPlanId: string;
  auditLog: ResponsePlanAuditEntry[];
  history: ResponsePlan[];
  onSelectPlan: (planId: string) => void;
}

export function PlanHistoryAndAudit({
  currentPlanId,
  auditLog,
  history,
  onSelectPlan,
}: PlanHistoryAndAuditProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Decision Audit Log (6 cols) */}
      <div className="lg:col-span-6 space-y-3">
        <Card>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs flex items-center gap-2">
                <History className="w-4 h-4 text-ops-cyan" />
                <span>TACTICAL DECISION AUDIT TRAIL</span>
              </CardTitle>
              <Badge variant="info" size="sm">{auditLog.length} Entries</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-3.5 space-y-2.5 font-mono text-xs max-h-56 overflow-y-auto pr-1">
            {auditLog.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded bg-surface-elevated border border-border space-y-1 text-[11px]"
              >
                <div className="flex items-center justify-between text-text-muted text-[10px]">
                  <span className="font-bold text-ops-cyan flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{log.timestamp}</span>
                  </span>
                  <span className="text-text-dim">Actor: {log.actor}</span>
                </div>
                <div className="font-bold text-text-primary">{log.action}</div>
                {log.details && <div className="text-text-secondary text-[10px]">{log.details}</div>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Response Plan History Table (6 cols) */}
      <div className="lg:col-span-6 space-y-3">
        <Card>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-ops-emerald" />
                <span>RESPONSE PLAN HISTORY (IMMUTABLE ARCHIVE)</span>
              </CardTitle>
              <Badge variant="neutral" size="sm">{history.length} Plans</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-surface-subtle text-text-muted text-[10px] uppercase border-b border-border">
                <tr>
                  <th className="py-2 px-3">Plan</th>
                  <th className="py-2 px-3">Target</th>
                  <th className="py-2 px-3 text-center">Impact</th>
                  <th className="py-2 px-3 text-center">Status</th>
                  <th className="py-2 px-3">Created</th>
                  <th className="py-2 px-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {history.map((histPlan) => {
                  const isCur = histPlan.id === currentPlanId;

                  return (
                    <tr
                      key={histPlan.id}
                      onClick={() => onSelectPlan(histPlan.id)}
                      className={`hover:bg-surface-elevated transition-colors cursor-pointer ${
                        isCur ? "bg-ops-cyan/10 font-bold" : ""
                      }`}
                    >
                      <td className="py-2 px-3 text-ops-cyan">{histPlan.planCode}</td>
                      <td className="py-2 px-3 text-text-primary">{histPlan.targetLocationName}</td>
                      <td className="py-2 px-3 text-center font-bold">{histPlan.impactScore}</td>
                      <td className="py-2 px-3 text-center">
                        <Badge
                          variant={
                            histPlan.status === "approved"
                              ? "safe"
                              : histPlan.status === "rejected"
                              ? "critical"
                              : "warning"
                          }
                          size="sm"
                        >
                          {histPlan.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-text-muted text-[10px]">{histPlan.createdAt}</td>
                      <td className="py-2 px-3 text-right">
                        <ChevronRight className="w-3.5 h-3.5 text-text-muted inline" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
