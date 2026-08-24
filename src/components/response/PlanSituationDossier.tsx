"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ResponsePlan } from "@/types";
import { MapPin, Sparkles, Building2 } from "lucide-react";

interface PlanSituationDossierProps {
  plan: ResponsePlan;
}

export function PlanSituationDossier({ plan }: PlanSituationDossierProps) {
  return (
    <div className="space-y-4">
      {/* Plan Situation Summary Card */}
      <Card className="border-border">
        <CardHeader className="py-3 bg-surface-subtle/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs flex items-center gap-2">
              <MapPin className="w-4 h-4 text-ops-crimson" />
              <span>TARGET SECTOR SITUATION DOSSIER</span>
            </CardTitle>
            <Badge
              variant={plan.priority === "critical" ? "critical" : "warning"}
              size="sm"
            >
              {plan.priority.toUpperCase()} PRIORITY
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/80">
            <div>
              <div className="text-[10px] text-text-muted uppercase">Operational Focus:</div>
              <div className="text-base font-bold text-text-primary uppercase tracking-wide">
                {plan.targetLocationName} ({plan.districtCode})
              </div>
              <div className="text-[10px] text-text-secondary mt-0.5">
                Exposed Population: <strong className="text-text-primary">{plan.situationSummary.exposedPopulation.toLocaleString("en-IN")}</strong> • Primary River: <strong className="text-ops-cyan">{plan.situationSummary.primaryRiver}</strong>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-text-muted uppercase">Composite Impact</div>
              <div className="text-2xl font-black text-ops-crimson tracking-tight">
                {plan.impactScore}<span className="text-xs font-normal text-text-dim">/100</span>
              </div>
            </div>
          </div>

          {/* 4 Factor Mini Strip */}
          <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
            <div className="p-2 rounded bg-surface-elevated border border-border">
              <div className="text-text-muted">Hazard Risk</div>
              <div className="text-xs font-bold text-ops-cyan mt-0.5">{plan.situationSummary.hazardRisk}</div>
            </div>
            <div className="p-2 rounded bg-surface-elevated border border-border">
              <div className="text-text-muted">Exposure</div>
              <div className="text-xs font-bold text-ops-amber mt-0.5">{plan.situationSummary.exposureScore}</div>
            </div>
            <div className="p-2 rounded bg-surface-elevated border border-border">
              <div className="text-text-muted">Vulnerability</div>
              <div className="text-xs font-bold text-ops-crimson mt-0.5">{plan.situationSummary.vulnerabilityScore}</div>
            </div>
            <div className="p-2 rounded bg-surface-elevated border border-border">
              <div className="text-text-muted">Infrastructure</div>
              <div className="text-xs font-bold text-ops-indigo-light mt-0.5">{plan.situationSummary.infrastructureCriticality}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* "WHY THIS PLAN?" Comprehensive Explainability */}
      <Card className="border-ops-cyan/40 bg-surface shadow-glow-cyan">
        <CardHeader className="py-3 bg-ops-cyan/10 border-b border-ops-cyan/20">
          <CardTitle className="text-xs text-ops-cyan flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>WHY THIS PLAN? (DECISION INTELLIGENCE EXPLANATION)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3 font-mono text-xs leading-relaxed text-text-secondary">
          <p className="text-text-primary font-medium text-[11px]">
            {plan.explanation.whyThisPlan}
          </p>

          <div className="p-3 rounded bg-surface-subtle border border-border space-y-1.5 text-[11px]">
            <div className="text-[10px] uppercase font-bold text-text-dim">Decision Chain Rationale:</div>
            <ul className="list-disc list-inside space-y-1 text-text-secondary text-[10px]">
              <li><strong className="text-text-primary">Hydrological Input: </strong>{plan.explanation.decisionTrace.hazard}</li>
              <li><strong className="text-text-primary">Impact Score: </strong>{plan.explanation.decisionTrace.impact}</li>
              <li><strong className="text-text-primary">Logistics Staging: </strong>{plan.explanation.decisionTrace.resources}</li>
              <li><strong className="text-text-primary">Routing Safety: </strong>{plan.explanation.decisionTrace.route}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Destination Shelter & Evacuation Corridor Details */}
      <Card className="border-border">
        <CardHeader className="py-3 bg-surface-subtle/50">
          <CardTitle className="text-xs flex items-center gap-2">
            <Building2 className="w-4 h-4 text-ops-emerald" />
            <span>DESIGNATED RELIEF CAMP & CORRIDOR READINESS</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3 rounded bg-surface-elevated border border-border space-y-1">
            <div className="text-[10px] text-text-muted uppercase">Designated Camp</div>
            <div className="font-bold text-text-primary text-[11px]">{plan.destinationShelter.name}</div>
            <div className="text-[10px] text-text-secondary">
              Capacity: {plan.destinationShelter.currentOccupancy} / {plan.destinationShelter.capacity} ({plan.destinationShelter.availableBeds} Available)
            </div>
            <Badge variant={plan.destinationShelter.status === "full" ? "critical" : "safe"} size="sm">
              {plan.destinationShelter.status.toUpperCase()}
            </Badge>
          </div>

          <div className="p-3 rounded bg-surface-elevated border border-border space-y-1">
            <div className="text-[10px] text-text-muted uppercase">Evacuation Corridor</div>
            <div className="font-bold text-ops-cyan text-[11px] truncate">{plan.evacuationRoute.name}</div>
            <div className="text-[10px] text-text-secondary">
              Transit ETA: ~{plan.evacuationRoute.estimatedMinutes} mins ({plan.evacuationRoute.distanceKm} km)
            </div>
            <Badge
              variant={plan.evacuationRoute.status === "safe" ? "safe" : plan.evacuationRoute.status === "caution" ? "warning" : "critical"}
              size="sm"
            >
              {plan.evacuationRoute.status.toUpperCase().replace(/_/g, " ")}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
