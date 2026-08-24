"use client";

import React from "react";
import { Alert } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  BellRing,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Undo2,
  ShieldAlert,
  Radio,
} from "lucide-react";

interface AlertFeedTableProps {
  alerts: Alert[];
  onSelectAlert: (alert: Alert) => void;
  onToggleAcknowledge: (alertId: string) => void;
}

export function AlertFeedTable({
  alerts,
  onSelectAlert,
  onToggleAcknowledge,
}: AlertFeedTableProps) {
  if (alerts.length === 0) {
    return (
      <div className="p-12 text-center rounded bg-surface border border-border font-mono text-xs text-text-muted space-y-2">
        <BellRing className="w-8 h-8 text-text-dim mx-auto" />
        <div className="font-bold text-text-primary">NO OFFICIAL ALERTS MATCH FILTER CRITERIA</div>
        <p className="text-[11px] text-text-secondary">Try resetting your search query or severity filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded bg-surface border border-border overflow-hidden font-mono text-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-subtle text-text-muted text-[10px] uppercase border-b border-border">
            <tr>
              <th className="py-2.5 px-3.5">Severity</th>
              <th className="py-2.5 px-3">Agency / Source</th>
              <th className="py-2.5 px-3">Official Warning & Location</th>
              <th className="py-2.5 px-3">Issued</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {alerts.map((alert) => {
              const isAck = alert.status === "acknowledged";
              const isCritical = alert.severity === "critical";

              return (
                <tr
                  key={alert.id}
                  onClick={() => onSelectAlert(alert)}
                  className={`hover:bg-surface-elevated transition-colors cursor-pointer group ${
                    isCritical && !isAck ? "bg-ops-crimson/5" : ""
                  }`}
                >
                  {/* Severity Badge */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <Badge
                      variant={
                        alert.severity === "critical"
                          ? "critical"
                          : alert.severity === "high"
                          ? "warning"
                          : "neutral"
                      }
                      dot={true}
                      size="sm"
                    >
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </td>

                  {/* Agency Source */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-elevated border border-border text-ops-cyan">
                      {alert.source.split(" ")[0]}
                    </span>
                  </td>

                  {/* Title & Location */}
                  <td className="py-3 px-3 max-w-md">
                    <div className="font-bold text-text-primary group-hover:text-ops-cyan transition-colors text-[11px]">
                      {alert.title}
                    </div>
                    <div className="text-[10px] text-text-secondary mt-0.5 flex items-center gap-1.5 truncate">
                      <MapPin className="w-3 h-3 text-ops-amber shrink-0" />
                      <span>{alert.locationName}</span>
                    </div>
                  </td>

                  {/* Timestamp */}
                  <td className="py-3 px-3 whitespace-nowrap text-text-muted text-[10px]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-text-dim" />
                      <span>{alert.timestamp}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        isAck
                          ? "bg-ops-emerald/10 text-ops-emerald border border-ops-emerald/30"
                          : "bg-ops-crimson/10 text-ops-crimson border border-ops-crimson/30 animate-pulse"
                      }`}
                    >
                      {isAck ? "ACKNOWLEDGED" : "ACTIVE"}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td
                    className="py-3 px-3.5 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onToggleAcknowledge(alert.id)}
                        className={`p-1 rounded transition-colors text-[10px] border ${
                          isAck
                            ? "border-border text-text-muted hover:text-text-primary"
                            : "border-ops-emerald/40 text-ops-emerald hover:bg-ops-emerald/15"
                        }`}
                        title={isAck ? "Unacknowledge" : "Acknowledge"}
                      >
                        {isAck ? <Undo2 className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onSelectAlert(alert)}
                        className="p-1 rounded text-text-muted group-hover:text-ops-cyan hover:bg-surface-elevated"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
