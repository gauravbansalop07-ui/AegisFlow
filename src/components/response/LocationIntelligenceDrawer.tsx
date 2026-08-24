"use client";

import React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RiskScore } from "@/types";
import {
  ShieldAlert,
  Users,
  Building,
  Waves,
  ArrowRight,
  Sparkles,
  Home,
  HeartPulse,
  Route,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useAegisFlow } from "@/context/AegisFlowContext";

interface LocationIntelligenceDrawerProps {
  riskScore: RiskScore | null;
  onClose: () => void;
}

export function LocationIntelligenceDrawer({
  riskScore,
  onClose,
}: LocationIntelligenceDrawerProps) {
  const { showToast } = useAegisFlow();

  if (!riskScore) return null;

  const isCrit = riskScore.priorityLevel === "critical";
  const isHigh = riskScore.priorityLevel === "high";

  return (
    <Drawer
      isOpen={!!riskScore}
      onClose={onClose}
      title="LOCATION RISK INTELLIGENCE"
      subtitle={`${riskScore.locationName} (${riskScore.code}) • Rank #${riskScore.rank} in Priority Queue`}
      width="lg"
    >
      <div className="space-y-5 font-mono text-xs">
        {/* Header Hero Score Card */}
        <div
          className={`p-4 rounded border flex items-center justify-between gap-4 ${
            isCrit
              ? "bg-ops-crimson/10 border-ops-crimson/40 shadow-glow-crimson"
              : isHigh
              ? "bg-ops-amber/10 border-ops-amber/40"
              : "bg-surface-elevated border-border"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant={isCrit ? "critical" : isHigh ? "warning" : "safe"}
                dot={isCrit}
              >
                {riskScore.priorityLevel} PRIORITY
              </Badge>
              <span className="text-[10px] text-text-dim">
                Rank #{riskScore.rank} of 9 Districts
              </span>
            </div>
            <h3 className="text-base font-bold text-text-primary uppercase tracking-wide">
              {riskScore.locationName}
            </h3>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Primary River: <strong className="text-ops-cyan">{riskScore.metrics.primaryRiver}</strong>
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[10px] text-text-muted uppercase">Impact Score</div>
            <div
              className={`text-3xl font-black tracking-tight ${
                isCrit
                  ? "text-ops-crimson"
                  : isHigh
                  ? "text-ops-amber"
                  : "text-ops-cyan"
              }`}
            >
              {riskScore.impactScore}
              <span className="text-xs font-normal text-text-dim">/100</span>
            </div>
          </div>
        </div>

        {/* 4 Factor Breakdown Bars */}
        <div className="space-y-3 p-3.5 rounded bg-surface-subtle border border-border">
          <div className="flex items-center justify-between text-[11px] font-bold text-text-primary uppercase border-b border-border/80 pb-1.5">
            <span>Mathematical Factor Breakdown</span>
            <span className="text-[10px] text-text-muted font-normal">Formula: Hazard × Composite Impact</span>
          </div>

          {/* Bar 1: Hazard Risk */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-text-secondary">
                <Waves className="w-3.5 h-3.5 text-ops-cyan" />
                <span>Hazard Risk (Phase 3 Simulation)</span>
              </span>
              <strong className="text-text-primary">{riskScore.hazardRisk}/100</strong>
            </div>
            <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden border border-border/60">
              <div
                className="h-full bg-ops-cyan rounded-full transition-all"
                style={{ width: `${riskScore.hazardRisk}%` }}
              />
            </div>
          </div>

          {/* Bar 2: Population Exposure */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-text-secondary">
                <Users className="w-3.5 h-3.5 text-ops-amber" />
                <span>Population Exposure (40% Weight)</span>
              </span>
              <strong className="text-text-primary">{riskScore.populationExposureScore}/100</strong>
            </div>
            <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden border border-border/60">
              <div
                className="h-full bg-ops-amber rounded-full transition-all"
                style={{ width: `${riskScore.populationExposureScore}%` }}
              />
            </div>
          </div>

          {/* Bar 3: Demographic Vulnerability */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-text-secondary">
                <Home className="w-3.5 h-3.5 text-ops-crimson" />
                <span>Demographic Vulnerability (35% Weight)</span>
              </span>
              <strong className="text-text-primary">{riskScore.demographicVulnerability}/100</strong>
            </div>
            <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden border border-border/60">
              <div
                className="h-full bg-ops-crimson rounded-full transition-all"
                style={{ width: `${riskScore.demographicVulnerability}%` }}
              />
            </div>
          </div>

          {/* Bar 4: Infrastructure Criticality */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-text-secondary">
                <Building className="w-3.5 h-3.5 text-ops-indigo-light" />
                <span>Infrastructure Criticality (25% Weight)</span>
              </span>
              <strong className="text-text-primary">{riskScore.infrastructureCriticality}/100</strong>
            </div>
            <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden border border-border/60">
              <div
                className="h-full bg-ops-indigo rounded-full transition-all"
                style={{ width: `${riskScore.infrastructureCriticality}%` }}
              />
            </div>
          </div>
        </div>

        {/* "WHY THIS LOCATION WAS PRIORITIZED" Section */}
        <div className="space-y-2">
          <div className="text-[11px] uppercase font-bold text-ops-cyan flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WHY THIS LOCATION WAS PRIORITIZED</span>
          </div>

          <div className="p-3.5 rounded bg-surface-elevated border border-border space-y-2 leading-relaxed text-[11px] text-text-secondary">
            <div className="text-text-primary font-bold">
              {riskScore.explanation.summary}
            </div>
            <div className="p-2 rounded bg-surface-subtle border border-border/60 text-text-dim text-[10px]">
              {riskScore.explanation.factorBreakdown}
            </div>
            <div>
              <strong className="text-text-primary">Operational Implication: </strong>
              {riskScore.explanation.actionJustification}
            </div>
          </div>
        </div>

        {/* Local Structural Fragility Indicators */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase text-text-dim font-bold tracking-wider">
            Demographic & Asset Fragility Metrics
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded bg-surface-elevated border border-border">
              <div className="text-[9px] text-text-muted">Kutcha Dwellings</div>
              <div className="text-xs font-bold text-ops-crimson mt-0.5">
                {riskScore.metrics.kutchaHousingRatio}%
              </div>
            </div>
            <div className="p-2 rounded bg-surface-elevated border border-border">
              <div className="text-[9px] text-text-muted">Elderly Ratio</div>
              <div className="text-xs font-bold text-text-primary mt-0.5">
                {riskScore.metrics.elderlyRatio}%
              </div>
            </div>
            <div className="p-2 rounded bg-surface-elevated border border-border">
              <div className="text-[9px] text-text-muted">Hospitals</div>
              <div className="text-xs font-bold text-ops-amber mt-0.5">
                {riskScore.metrics.hospitalCount}
              </div>
            </div>
            <div className="p-2 rounded bg-surface-elevated border border-border">
              <div className="text-[9px] text-text-muted">Bridges</div>
              <div className="text-xs font-bold text-ops-indigo-light mt-0.5">
                {riskScore.metrics.criticalBridges}
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Command Directive */}
        <div className="p-3.5 rounded bg-ops-cyan/10 border border-ops-cyan/30 space-y-1">
          <div className="text-[10px] uppercase font-bold text-ops-cyan flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Recommended EOC Directive</span>
          </div>
          <div className="text-xs text-text-primary font-semibold">
            {riskScore.recommendedAction}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center gap-3">
          <Link href="/response-plan" className="flex-1" onClick={onClose}>
            <Button variant="primary" size="md" className="w-full gap-2">
              <span>Activate Response Workflow</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="md"
            onClick={() => {
              showToast({
                title: "Priority Location Tagged",
                message: `${riskScore.locationName} set as primary focus for response plan generator.`,
                type: "info",
              });
              onClose();
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-ops-cyan" />
            Tag Focus
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
