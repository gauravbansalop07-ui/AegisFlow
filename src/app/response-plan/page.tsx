"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AssamOverviewMap } from "@/components/map/AssamOverviewMap";
import { RouteInspectorDrawer } from "@/components/response/RouteInspectorDrawer";
import { ApprovePlanModal } from "@/components/response/ApprovePlanModal";
import { RejectModifyPlanModal } from "@/components/response/RejectModifyPlanModal";
import { DecisionTraceFlow } from "@/components/response/DecisionTraceFlow";
import { PlanSituationDossier } from "@/components/response/PlanSituationDossier";
import { PlanDirectivesList } from "@/components/response/PlanDirectivesList";
import { PlanHistoryAndAudit } from "@/components/response/PlanHistoryAndAudit";
import {
  ShieldCheck,
  ShieldAlert,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  Boxes,
  HeartPulse,
  Truck,
  Ship,
  UserCheck,
  XCircle,
  Shield,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useAegisFlow } from "@/context/AegisFlowContext";
import { RouteOption } from "@/types";
import { Tooltip } from "@/components/ui/Tooltip";

export default function ResponsePlanPage() {
  const {
    currentResponsePlan,
    responsePlanHistory,
    regenerateResponsePlan,
    approveCurrentResponsePlan,
    rejectCurrentResponsePlan,
    modifyCurrentResponsePlan,
    selectHistoricalPlan,
    routingResult,
    selectedOriginId,
    toggleRoadOverride,
    districts,
    incidents,
    shelters,
    gauges,
    inundationPolygons,
  } = useAegisFlow();

  const [inspectedRoute, setInspectedRoute] = useState<RouteOption | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const plan = currentResponsePlan;

  if (!plan) {
    return (
      <div className="p-8 text-center font-mono text-xs text-text-muted">
        SYNTHESIZING RESPONSE PLAN FROM DECISION PIPELINE...
      </div>
    );
  }

  const isApproved = plan.status === "approved";
  const isRejected = plan.status === "rejected";
  const isModified = plan.status === "modified";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Header & Situation Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-border">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-text-primary font-mono uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-ops-cyan" />
              <span>Recommended Response Plan</span>
            </h1>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge
                variant={isApproved ? "safe" : isRejected ? "critical" : isModified ? "neutral" : "warning"}
                dot={true}
                size="sm"
              >
                {plan.status.toUpperCase().replace(/_/g, " ")}
              </Badge>
              <Badge variant="info" size="sm">{plan.planCode}</Badge>
              <Badge variant="neutral" size="sm">HITL</Badge>
              <Tooltip content="Integrates hazard simulation, risk scoring, optimization, and routing into an actionable response plan.">
                <span className="cursor-help text-text-muted hover:text-ops-cyan">
                  <Info className="w-3.5 h-3.5" />
                </span>
              </Tooltip>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-text-secondary mt-1 font-mono">
            Human-In-The-Loop Command Console • Authorized response actions for {plan.targetLocationName} ({plan.districtCode})
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 font-mono flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => regenerateResponsePlan()}
            className="gap-1.5 text-xs py-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-ops-cyan" />
            <span>Regenerate</span>
          </Button>

          <Link href="/hazard-monitor">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-ops-cyan" />
              <span>Tune</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Outdated Situation Alert Banner */}
      {plan.isOutdated && (
        <div className="p-3 sm:p-3.5 rounded bg-ops-amber/15 border border-ops-amber/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="text-ops-amber text-[11px] sm:text-xs">
            <strong className="text-text-primary uppercase">Situation Telemetry Changed: </strong>
            Flood conditions were modified after this plan was synthesized.
          </div>

          <Button
            variant="warning"
            size="sm"
            onClick={() => regenerateResponsePlan()}
            className="shrink-0 gap-1.5 text-xs py-1.5 w-full sm:w-auto justify-center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>REGENERATE PLAN</span>
          </Button>
        </div>
      )}

      {/* 2. Decision Trace Visual Flow Strip */}
      <div className="overflow-x-auto">
        <DecisionTraceFlow plan={plan} />
      </div>

      {/* 3. Main Console Layout: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* LEFT COLUMN: Situation & Plan Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          <PlanSituationDossier plan={plan} />
          <PlanDirectivesList actions={plan.recommendedActions} />
        </div>

        {/* RIGHT COLUMN: Resources, Map, and Road Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          {/* Authorized Resource Deployment Staging Card */}
          <Card className="border-border">
            <CardHeader className="py-2.5 sm:py-3 bg-surface-subtle/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-ops-amber" />
                  <span>AUTHORIZED ALLOTMENT</span>
                </CardTitle>
                <Badge variant="info" size="sm">Optimizer</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-3.5 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 sm:p-2.5 rounded bg-surface-elevated border border-border flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1.5 text-[11px]">
                    <Ship className="w-3.5 h-3.5 text-ops-cyan" />
                    <span>Boats</span>
                  </span>
                  <strong className="text-ops-cyan text-sm">{plan.recommendedResources.boats}</strong>
                </div>

                <div className="p-2 sm:p-2.5 rounded bg-surface-elevated border border-border flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1.5 text-[11px]">
                    <Boxes className="w-3.5 h-3.5 text-ops-amber" />
                    <span>Food Kits</span>
                  </span>
                  <strong className="text-ops-amber text-sm">{plan.recommendedResources.foodKits.toLocaleString("en-IN")}</strong>
                </div>

                <div className="p-2 sm:p-2.5 rounded bg-surface-elevated border border-border flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1.5 text-[11px]">
                    <Shield className="w-3.5 h-3.5 text-ops-crimson" />
                    <span>Rescue</span>
                  </span>
                  <strong className="text-ops-crimson text-sm">{plan.recommendedResources.rescueTeams}</strong>
                </div>

                <div className="p-2 sm:p-2.5 rounded bg-surface-elevated border border-border flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1.5 text-[11px]">
                    <HeartPulse className="w-3.5 h-3.5 text-ops-emerald" />
                    <span>Medical</span>
                  </span>
                  <strong className="text-ops-emerald text-sm">{plan.recommendedResources.medicalTeams}</strong>
                </div>

                <div className="col-span-2 p-2 sm:p-2.5 rounded bg-surface-elevated border border-border flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1.5 text-[11px]">
                    <Truck className="w-3.5 h-3.5 text-ops-indigo-light" />
                    <span>ATVs</span>
                  </span>
                  <strong className="text-ops-indigo-light text-sm">{plan.recommendedResources.vehicles} Vehicles</strong>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evacuation Intelligence GIS Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 flex-wrap gap-1">
              <span className="font-mono text-[11px] sm:text-xs font-semibold text-text-primary uppercase tracking-wider">
                Evacuation Corridor Map
              </span>
              <span className="text-[10px] font-mono text-text-muted">
                Pulsing Cyan: Route
              </span>
            </div>

            <AssamOverviewMap
              className="w-full h-[280px] xs:h-[320px] sm:h-[380px]"
              districts={districts}
              incidents={incidents}
              shelters={shelters}
              gauges={gauges}
              inundationPolygons={inundationPolygons}
              routingResult={routingResult}
            />
          </div>

          {/* Road Cut-Off Simulator Panel */}
          <Card className="border-border">
            <CardHeader className="py-2.5 bg-surface-subtle/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-ops-cyan" />
                  <span>ROAD BREACH SIMULATOR</span>
                </CardTitle>
                <Badge variant="warning" size="sm">Widget</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-2.5 sm:p-3 space-y-2 font-mono text-xs">
              {routingResult.allSegments
                .filter((r) => r.districtId === selectedOriginId || r.districtId === "majuli")
                .slice(0, 3)
                .map((road) => {
                  const isFlooded = road.status === "flooded" || road.status === "blocked";

                  return (
                    <div
                      key={road.id}
                      className="p-2 rounded bg-surface-elevated border border-border flex items-center justify-between text-[11px]"
                    >
                      <span className="truncate max-w-[170px] text-text-primary font-bold">
                        {road.name}
                      </span>

                      <button
                        onClick={() => toggleRoadOverride(road.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all border ${
                          isFlooded
                            ? "bg-ops-emerald/20 text-ops-emerald border-ops-emerald/40"
                            : "bg-ops-crimson/20 text-ops-crimson border-ops-crimson/40"
                        }`}
                      >
                        {isFlooded ? "Restore" : "Flood"}
                      </button>
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 4. Plan Validation Errors Box */}
      {!plan.validation.isValid && (
        <div className="p-3 sm:p-4 rounded bg-ops-crimson/15 border border-ops-crimson/50 space-y-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-ops-crimson font-bold uppercase text-[11px] sm:text-xs">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Validation Failed — Sign-off Blocked</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-text-secondary text-[10.5px] sm:text-[11px]">
            {plan.validation.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 5. Commander Decision Authorization Footer Bar */}
      <Card className="bg-surface-subtle border-border-strong font-mono text-xs">
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded flex items-center justify-center shrink-0 border ${
                isApproved
                  ? "bg-ops-emerald/20 border-ops-emerald/50 text-ops-emerald shadow-glow-emerald"
                  : isRejected
                  ? "bg-ops-crimson/20 border-ops-crimson/50 text-ops-crimson"
                  : "bg-ops-amber/20 border-ops-amber/50 text-ops-amber shadow-glow-amber"
              }`}
            >
              {isApproved ? <CheckCircle2 className="w-5 h-5" /> : isRejected ? <XCircle className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wide">
                  Decision Status:
                </span>
                <Badge
                  variant={isApproved ? "safe" : isRejected ? "critical" : isModified ? "neutral" : "warning"}
                  size="sm"
                >
                  {plan.status.toUpperCase().replace(/_/g, " ")}
                </Badge>
              </div>
              <p className="text-[10.5px] sm:text-[11px] text-text-secondary mt-0.5 leading-snug">
                {isApproved
                  ? `Authorized by ${plan.approvedBy} at ${plan.approvedAt}. Action recorded in audit ledger.`
                  : isRejected
                  ? `Returned by commander at ${plan.rejectedAt}: ${plan.rejectionReason}.`
                  : `Awaiting explicit commander review. Verification required prior to staging sign-off.`}
              </p>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRejectModalOpen(true)}
              className="gap-1.5 border-border hover:border-ops-crimson hover:text-ops-crimson text-xs py-2 flex-1 sm:flex-initial justify-center"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>REJECT</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              disabled={!plan.validation.isValid || isApproved}
              onClick={() => setIsApproveModalOpen(true)}
              className={`gap-1.5 font-bold shadow-glow-emerald text-xs py-2 flex-1 sm:flex-initial justify-center ${
                isApproved ? "bg-ops-emerald/40 cursor-not-allowed" : "bg-ops-emerald hover:bg-ops-emerald/90 text-background"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isApproved ? "APPROVED" : "APPROVE RESPONSE PLAN"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 6. Decision Audit Log & Response Plan History Table */}
      <PlanHistoryAndAudit
        currentPlanId={plan.id}
        auditLog={plan.auditLog}
        history={responsePlanHistory}
        onSelectPlan={(planId) => selectHistoricalPlan(planId)}
      />

      {/* Confirmation & Interventions Modals */}
      <ApprovePlanModal
        isOpen={isApproveModalOpen}
        plan={plan}
        onClose={() => setIsApproveModalOpen(false)}
        onConfirm={(commanderName, notes) => {
          approveCurrentResponsePlan(commanderName, notes);
          setIsApproveModalOpen(false);
        }}
      />

      <RejectModifyPlanModal
        isOpen={isRejectModalOpen}
        plan={plan}
        onClose={() => setIsRejectModalOpen(false)}
        onReject={(reason, notes) => {
          rejectCurrentResponsePlan(reason, notes);
          setIsRejectModalOpen(false);
        }}
        onModify={(modifiedResources, notes) => {
          modifyCurrentResponsePlan(modifiedResources, notes);
          setIsRejectModalOpen(false);
        }}
      />

      {/* Route Inspector Drawer */}
      <RouteInspectorDrawer
        routeOption={inspectedRoute}
        onClose={() => setInspectedRoute(null)}
      />
    </div>
  );
}
