"use client";

import React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert, RiskScore, LocationResourceAllocationDetailed, RoutingEngineResult } from "@/types";
import {
  BellRing,
  Building2,
  Boxes,
  Route,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Undo2,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface AlertDetailDrawerProps {
  alert: Alert | null;
  onClose: () => void;
  onToggleAcknowledge: (alertId: string) => void;
  impactScore?: RiskScore | null;
  resourceAllocation?: LocationResourceAllocationDetailed | null;
  routingResult?: RoutingEngineResult | null;
}

export function AlertDetailDrawer({
  alert,
  onClose,
  onToggleAcknowledge,
  impactScore,
  resourceAllocation,
  routingResult,
}: AlertDetailDrawerProps) {
  if (!alert) return null;

  const isAck = alert.status === "acknowledged";

  return (
    <Drawer
      isOpen={!!alert}
      onClose={onClose}
      title={alert.title}
      subtitle={`Source: ${alert.source} • ${alert.locationName}`}
      width="md"
    >
      <div className="space-y-4 font-mono text-xs">
        {/* Severity & Status Header Bar */}
        <div className="flex items-center justify-between p-3 rounded bg-surface-elevated border border-border">
          <div className="flex items-center gap-2">
            <Badge
              variant={
                alert.severity === "critical"
                  ? "critical"
                  : alert.severity === "high"
                  ? "warning"
                  : "neutral"
              }
              dot={true}
            >
              {alert.severity.toUpperCase()}
            </Badge>
            <Badge variant="info">OFFICIAL SOURCE</Badge>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
            <Clock className="w-3.5 h-3.5 text-ops-cyan" />
            <span>{alert.timestamp}</span>
          </div>
        </div>

        {/* Official Bulletin Text */}
        <div className="p-3.5 rounded bg-surface border border-border space-y-2">
          <div className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-ops-cyan" />
            <span>Simulated Official Bulletin:</span>
          </div>
          <p className="text-text-primary text-[11px] leading-relaxed">
            {alert.description}
          </p>
        </div>

        {/* Recommended Immediate Action */}
        <div className="p-3 rounded bg-ops-amber/10 border border-ops-amber/30 space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-ops-amber flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Official Recommended Action:</span>
          </div>
          <p className="text-text-secondary text-[11px] leading-relaxed">
            {alert.recommendedAction}
          </p>
        </div>

        {/* Source Authority & Non-Replacement Disclaimer */}
        <div className="p-2.5 rounded bg-surface-subtle border border-border flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-ops-cyan shrink-0 mt-0.5" />
          <div className="text-[10px] text-text-muted leading-relaxed">
            <strong className="text-text-primary">Source Authority ({alert.source}): </strong>
            AegisFlow preserves official government bulletins as authoritative. This alert represents simulated hydrological/meteorological feeds for demonstration.
          </div>
        </div>

        {/* Operational Intelligence Correlation Panel */}
        {impactScore && (
          <div className="p-3.5 rounded bg-surface-elevated border border-ops-cyan/30 shadow-glow-cyan space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="text-[10px] uppercase font-bold text-ops-cyan flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Operational Intelligence Correlation</span>
              </div>
              <Badge variant={impactScore.priorityLevel === "critical" ? "critical" : "warning"} size="sm">
                Score: {impactScore.impactScore}/100
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-surface border border-border">
                <div className="text-[9px] text-text-muted uppercase">Exposed Population</div>
                <div className="font-bold text-text-primary mt-0.5">
                  {impactScore.populationExposed.toLocaleString("en-IN")}
                </div>
              </div>

              <div className="p-2 rounded bg-surface border border-border">
                <div className="text-[9px] text-text-muted uppercase">Priority Rank</div>
                <div className="font-bold text-ops-crimson mt-0.5">
                  #{impactScore.rank} in Assam
                </div>
              </div>
            </div>

            {/* Correlated Resources */}
            {resourceAllocation && (
              <div className="space-y-1">
                <div className="text-[10px] text-text-muted uppercase font-bold flex items-center gap-1">
                  <Boxes className="w-3 h-3 text-ops-amber" />
                  <span>Recommended Asset Staging:</span>
                </div>
                <div className="text-[11px] text-text-secondary">
                  {resourceAllocation.recommended.boats} Boats • {resourceAllocation.recommended.rescueTeams} Rescue Squads • {resourceAllocation.recommended.foodKits.toLocaleString("en-IN")} Food Kits
                </div>
              </div>
            )}

            {/* Correlated Evacuation Route */}
            {routingResult?.recommendedRoute && (
              <div className="space-y-1">
                <div className="text-[10px] text-text-muted uppercase font-bold flex items-center gap-1">
                  <Route className="w-3 h-3 text-ops-cyan" />
                  <span>Designated Safe Corridor:</span>
                </div>
                <div className="text-[11px] text-text-primary font-bold">
                  {routingResult.recommendedRoute.name} (~{routingResult.recommendedRoute.estimatedMinutes} mins)
                </div>
              </div>
            )}
          </div>
        )}

        {/* Incident Escalation Timeline */}
        {alert.timeline && alert.timeline.length > 0 && (
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-ops-cyan" />
              <span>Escalation Timeline:</span>
            </div>
            <div className="space-y-1.5 border-l-2 border-border ml-2 pl-3">
              {alert.timeline.map((item, i) => (
                <div key={i} className="text-[11px] leading-relaxed">
                  <span className="text-ops-cyan font-bold text-[10px] mr-1.5">
                    {item.time}
                  </span>
                  <span className="text-text-secondary">{item.event}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border">
          <Button
            variant={isAck ? "outline" : "primary"}
            size="sm"
            onClick={() => onToggleAcknowledge(alert.id)}
            className="gap-1.5 font-bold"
          >
            {isAck ? (
              <>
                <Undo2 className="w-3.5 h-3.5 text-text-muted" />
                <span>Mark Unacknowledged</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Acknowledge Alert</span>
              </>
            )}
          </Button>

          {alert.actionLink && (
            <Link href={alert.actionLink}>
              <Button variant="secondary" size="sm" className="gap-1.5">
                <span>
                  {alert.actionLink === "/response-plan"
                    ? "View Response Plan"
                    : alert.actionLink === "/resources"
                    ? "View Resources"
                    : "View Hazard Monitor"}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-ops-cyan" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Drawer>
  );
}
