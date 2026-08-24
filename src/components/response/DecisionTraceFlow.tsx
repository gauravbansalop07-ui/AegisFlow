"use client";

import React from "react";
import { ResponsePlan } from "@/types";

interface DecisionTraceFlowProps {
  plan: ResponsePlan;
}

export function DecisionTraceFlow({ plan }: DecisionTraceFlowProps) {
  const isApproved = plan.status === "approved";
  const isRejected = plan.status === "rejected";

  return (
    <div className="p-3 rounded bg-surface-subtle border border-border font-mono text-xs overflow-x-auto">
      <div className="flex items-center justify-between min-w-[760px] gap-2">
        {/* Step 1: Hazard */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-ops-cyan/20 border border-ops-cyan text-ops-cyan flex items-center justify-center font-bold text-[10px]">
            1
          </div>
          <div>
            <div className="text-[9px] text-text-muted uppercase">Hazard State</div>
            <div className="font-bold text-text-primary text-[11px]">CWC Critical Surge</div>
          </div>
        </div>

        <span className="text-text-dim">&rarr;</span>

        {/* Step 2: Impact Score */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-ops-crimson/20 border border-ops-crimson text-ops-crimson flex items-center justify-center font-bold text-[10px]">
            2
          </div>
          <div>
            <div className="text-[9px] text-text-muted uppercase">Impact Score</div>
            <div className="font-bold text-ops-crimson text-[11px]">{plan.impactScore}/100 Critical</div>
          </div>
        </div>

        <span className="text-text-dim">&rarr;</span>

        {/* Step 3: Priority Target */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-ops-amber/20 border border-ops-amber text-ops-amber flex items-center justify-center font-bold text-[10px]">
            3
          </div>
          <div>
            <div className="text-[9px] text-text-muted uppercase">Priority Target</div>
            <div className="font-bold text-text-primary text-[11px]">{plan.targetLocationName}</div>
          </div>
        </div>

        <span className="text-text-dim">&rarr;</span>

        {/* Step 4: Optimized Resources */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-ops-indigo/20 border border-ops-indigo text-ops-indigo-light flex items-center justify-center font-bold text-[10px]">
            4
          </div>
          <div>
            <div className="text-[9px] text-text-muted uppercase">Allocated Assets</div>
            <div className="font-bold text-text-primary text-[11px]">
              {plan.recommendedResources.boats} Boats • {plan.recommendedResources.rescueTeams} Rescue
            </div>
          </div>
        </div>

        <span className="text-text-dim">&rarr;</span>

        {/* Step 5: Safe Route */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-ops-emerald/20 border border-ops-emerald text-ops-emerald flex items-center justify-center font-bold text-[10px]">
            5
          </div>
          <div>
            <div className="text-[9px] text-text-muted uppercase">Evac Corridor</div>
            <div className="font-bold text-ops-emerald text-[11px]">
              {plan.evacuationRoute.isPassable ? `Safe (~${plan.evacuationRoute.estimatedMinutes}m)` : "Impassable"}
            </div>
          </div>
        </div>

        <span className="text-text-dim">&rarr;</span>

        {/* Step 6: Commander Decision */}
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
              isApproved
                ? "bg-ops-emerald/20 border border-ops-emerald text-ops-emerald"
                : "bg-ops-amber/20 border border-ops-amber text-ops-amber"
            }`}
          >
            6
          </div>
          <div>
            <div className="text-[9px] text-text-muted uppercase">Commander Decision</div>
            <div
              className={`font-bold text-[11px] ${
                isApproved ? "text-ops-emerald" : isRejected ? "text-ops-crimson" : "text-ops-amber"
              }`}
            >
              {isApproved ? "Authorized" : isRejected ? "Rejected" : "Pending Sign-off"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
