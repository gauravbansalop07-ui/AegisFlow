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
    <div className="space-y-6">
      {/* 1. Header & Situation Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold text-text-primary font-mono uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-ops-cyan" />
              <span>Recommended Response Plan</span>
            </h1>
            <div className="flex items-center gap-1.5">
              <Badge
                variant={isApproved ? "safe" : isRejected ? "critical" : isModified ? "neutral" : "warning"}
                dot={true}
              >
                {plan.status.toUpperCase().replace(/_/g, " ")}
              </Badge>
              <Badge variant="info">{plan.planCode}</Badge>
              <Badge variant="neutral">HITL PROTOCOL</Badge>
              <Tooltip content="AegisFlow Decision Support: Integrates hazard simulation, impact risk scoring, resource optimization, and dynamic routing into an actionable response plan requiring explicit human commander sign-off.">
                <span className="cursor-help text-text-muted hover:text-ops-cyan">
                  <Info className="w-3.5 h-3.5" />
                </span>
              </Tooltip>
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-1 font-mono">
            Human-In-The-Loop Command Console • Authorized response actions for {plan.targetLocationName} ({plan.districtCode})
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 font-mono">
          <Button
            variant="outline"
            size="sm"
            onClick={() => regenerateResponsePlan()}
            className="gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-ops-cyan" />
            <span>Regenerate Plan</span>
          </Button>

          <Link href="/hazard-monitor">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-ops-cyan" />
              <span>Tune Simulation</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Outdated Situation Alert Banner */}
      {plan.isOutdated && (
        <div className="p-3.5 rounded bg-ops-amber/15 border border-ops-amber/40 flex items-center justify-between gap-4 font-mono text-xs">
          <div className="text-ops-amber">
            <strong className="text-text-primary uppercase">Situation Telemetry Changed: </strong>
            Flood conditions were modified after this plan was synthesized.
          </div>

          <Button
            variant="warning"
            size="sm"
            onClick={() => regenerateResponsePlan()}
            className="shrink-0 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>REGENERATE PLAN</span>
          </Button>
        </div>
      )}

      {/* 2. Decision Trace Visual Flow Strip */}
      <DecisionTraceFlow plan={plan} />

      {/* 3. Main Console Layout: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Situation & Plan Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <PlanSituationDossier plan={plan} />
          <PlanDirectivesList actions={plan.recommendedActions} />
        </div>

        {/* RIGHT COLUMN: Resources, Map, and Road Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Authorized Resource Deployment Staging Card */}
          <Card className="border-border">
            <CardHeader className="py-3 bg-surface-subtle/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-ops-amber" />
                  <span>AUTHORIZED RESOURCE ALLOTMENT</span>
                </CardTitle>
                <Badge variant="info" size="sm">Optimizer Output</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3.5 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded bg-surface-elevated border border-border flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1.5">
                    <Ship className="w-3.5 h-3.5 text-ops-cyan" />
                    <span>Boats</span>
                  </span>
                  <strong className="text-ops-cyan text-sm">{plan.recommendedResources.boats}</strong>
                </div>

                <div className="p-2.5 rounded bg-surface-elevated border border-border flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5 text-ops-amber" />
                    <span>Food Kits</span>
                  </span>
                  <strong className="text-ops-amber text-sm">{plan.recommendedResources.foodKits.toLocaleString("en-IN")}</strong>
                </div>

                <div className="p-2.5 rounded bg-surface-elevated border border-border flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-ops-crimson" />
                    <span>Rescue Teams</span>
                  </span>
                  <strong className="text-ops-crimson text-sm">{plan.recommendedResources.rescueTeams}</strong>
                </div>

                <div className="p-2.5 rounded bg-surface-elevated border border-border flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-ops-emerald" />
                    <span>Medical Teams</span>
                  </span>
                  <strong className="text-ops-emerald text-sm">{plan.recommendedResources.medicalTeams}</strong>
                </div>

                <div className="col-span-2 p-2.5 rounded bg-surface-elevated border border-border flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-ops-indigo-light" />
                    <span>High-Clearance ATVs</span>
                  </span>
                  <strong className="text-ops-indigo-light text-sm">{plan.recommendedResources.vehicles} Vehicles</strong>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evacuation Intelligence GIS Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="font-mono text-xs font-semibold text-text-primary uppercase tracking-wider">
                Evacuation Corridor GIS Map
              </span>
              <span className="text-[10px] font-mono text-text-muted">
                Pulsing Cyan: Authorized Route
              </span>
            </div>

            <AssamOverviewMap
              className="w-full h-[380px]"
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
                <Badge variant="warning" size="sm">Demo Widget</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-2 font-mono text-xs">
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
        <div className="p-4 rounded bg-ops-crimson/15 border border-ops-crimson/50 space-y-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-ops-crimson font-bold uppercase">
            <ShieldAlert className="w-4 h-4" />
            <span>Response Plan Validation Failed — Commander Sign-off Blocked</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-text-secondary text-[11px]">
            {plan.validation.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
          <p className="text-[10px] text-text-muted">
            Safety protocol requires restoring road connectivity or selecting an alternate relief shelter before approval can be recorded.
          </p>
        </div>
      )}

      {/* 5. Commander Decision Authorization Footer Bar */}
      <Card className="bg-surface-subtle border-border-strong font-mono text-xs">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded flex items-center justify-center shrink-0 border ${
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
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wide">
                  Incident Commander Decision Status:
                </span>
                <Badge
                  variant={isApproved ? "safe" : isRejected ? "critical" : isModified ? "neutral" : "warning"}
                  size="sm"
                >
                  {plan.status.toUpperCase().replace(/_/g, " ")}
                </Badge>
              </div>
              <p className="text-[11px] text-text-secondary mt-0.5">
                {isApproved
                  ? `Authorized by ${plan.approvedBy} at ${plan.approvedAt}. Action recorded in audit ledger.`
                  : isRejected
                  ? `Returned by commander at ${plan.rejectedAt}: ${plan.rejectionReason}.`
                  : `Awaiting explicit commander review. Verification required prior to staging sign-off.`}
              </p>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsRejectModalOpen(true)}
              className="gap-1.5 border-border hover:border-ops-crimson hover:text-ops-crimson"
            >
              <XCircle className="w-4 h-4" />
              <span>REJECT / MODIFY</span>
            </Button>

            <Button
              variant="primary"
              size="md"
              disabled={!plan.validation.isValid || isApproved}
              onClick={() => setIsApproveModalOpen(true)}
              className={`gap-2 font-bold shadow-glow-emerald ${
                isApproved ? "bg-ops-emerald/40 cursor-not-allowed" : "bg-ops-emerald hover:bg-ops-emerald/90 text-background"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isApproved ? "PLAN ALREADY APPROVED" : "APPROVE RESPONSE PLAN"}</span>
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
