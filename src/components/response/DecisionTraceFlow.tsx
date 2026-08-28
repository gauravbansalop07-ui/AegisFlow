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
    <div className="p-4 rounded-lg bg-surface border border-border font-mono text-xs overflow-x-auto shadow-sm">
      <div className="flex items-center justify-between min-w-[840px] gap-3">
        {/* Step 1: Hazard */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-ops-cyan/20 border border-ops-cyan text-ops-cyan flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <div className="text-[10px] text-text-muted uppercase font-semibold">Hazard State</div>
            <div className="font-bold text-text-primary text-xs">CWC Critical Surge</div>
          </div>
        </div>

        <span className="text-text-muted text-sm font-sans">&rarr;</span>

        {/* Step 2: Impact Score */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-ops-crimson/20 border border-ops-crimson text-ops-crimson flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <div className="text-[10px] text-text-muted uppercase font-semibold">Impact Score</div>
            <div className="font-bold text-ops-crimson text-xs">{plan.impactScore}/100 Critical</div>
          </div>
        </div>

        <span className="text-text-muted text-sm font-sans">&rarr;</span>

        {/* Step 3: Priority Target */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-ops-amber/20 border border-ops-amber text-ops-amber flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <div className="text-[10px] text-text-muted uppercase font-semibold">Priority Target</div>
            <div className="font-bold text-text-primary text-xs">{plan.targetLocationName}</div>
          </div>
        </div>

        <span className="text-text-muted text-sm font-sans">&rarr;</span>

        {/* Step 4: Optimized Resources */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-ops-indigo/20 border border-ops-indigo text-ops-indigo-light flex items-center justify-center font-bold text-xs">
            4
          </div>
          <div>
            <div className="text-[10px] text-text-muted uppercase font-semibold">Allocated Assets</div>
            <div className="font-bold text-text-primary text-xs">
              {plan.recommendedResources.boats} Boats • {plan.recommendedResources.rescueTeams} Rescue
            </div>
          </div>
        </div>

        <span className="text-text-muted text-sm font-sans">&rarr;</span>

        {/* Step 5: Safe Route */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-ops-emerald/20 border border-ops-emerald text-ops-emerald flex items-center justify-center font-bold text-xs">
            5
          </div>
          <div>
            <div className="text-[10px] text-text-muted uppercase font-semibold">Evac Corridor</div>
            <div className="font-bold text-ops-emerald text-xs">
              {plan.evacuationRoute.isPassable ? `Safe (~${plan.evacuationRoute.estimatedMinutes}m)` : "Impassable"}
            </div>
          </div>
        </div>

        <span className="text-text-muted text-sm font-sans">&rarr;</span>

        {/* Step 6: Commander Decision */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              isApproved
                ? "bg-ops-emerald/20 border border-ops-emerald text-ops-emerald"
                : isRejected
                ? "bg-ops-crimson/20 border border-ops-crimson text-ops-crimson"
                : "bg-ops-amber/20 border border-ops-amber text-ops-amber"
            }`}
          >
            6
          </div>
          <div>
            <div className="text-[10px] text-text-muted uppercase font-semibold">Commander Decision</div>
            <div
              className={`font-bold text-xs ${
                isApproved
                  ? "text-ops-emerald"
                  : isRejected
                  ? "text-ops-crimson"
                  : "text-ops-amber"
              }`}
            >
              {plan.status.toUpperCase().replace(/_/g, " ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
