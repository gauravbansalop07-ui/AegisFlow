"use client";

import React from "react";
import { useAegisFlow } from "@/context/AegisFlowContext";
import { AlertTriangle, SlidersHorizontal, RotateCcw } from "lucide-react";
import Link from "next/link";

export function SimulationBar() {
  const { simulationState, applyScenarioPreset, resetToBaseline } = useAegisFlow();

  return (
    <div className="bg-surface-subtle/80 border-b border-border px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between text-xs font-mono gap-3 shrink-0">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-ops-amber font-semibold">
          <AlertTriangle className="w-4 h-4 text-ops-amber shrink-0" />
          <span className="text-xs font-bold">SIMULATION ACTIVE</span>
        </div>
        <span className="text-text-dim hidden xs:inline">•</span>
        <div className="text-text-secondary flex items-center gap-2 flex-wrap">
          <span className="hidden sm:inline">Scenario:</span>
          <span className="text-text-primary uppercase font-bold bg-surface-elevated px-2 py-0.5 rounded border border-border text-xs">
            {simulationState.scenarioPreset.replace(/_/g, " ")}
          </span>
          <span className="text-xs text-text-muted hidden md:inline">
            (Rain: <strong className="text-ops-cyan uppercase">{simulationState.rainfallIntensity}</strong> • River: <strong className="text-ops-crimson uppercase">{simulationState.riverGaugeLevel.replace(/_/g, " ")}</strong>)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-text-muted text-xs hidden sm:inline uppercase font-semibold">Presets:</span>
        <button
          onClick={() => applyScenarioPreset("majuli_breach_scenario")}
          className={`px-2.5 py-1 rounded-md text-xs transition-colors border ${
            simulationState.scenarioPreset === "majuli_breach_scenario"
              ? "bg-ops-cyan/20 border-ops-cyan text-ops-cyan font-bold"
              : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
          }`}
        >
          Majuli Breach
        </button>
        <button
          onClick={() => applyScenarioPreset("extreme_rainfall")}
          className={`px-2.5 py-1 rounded-md text-xs transition-colors border ${
            simulationState.scenarioPreset === "extreme_rainfall"
              ? "bg-ops-crimson/20 border-ops-crimson text-ops-crimson font-bold"
              : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
          }`}
        >
          Extreme
        </button>
        <button
          onClick={() => applyScenarioPreset("normal_monsoon")}
          className={`px-2.5 py-1 rounded-md text-xs transition-colors border hidden xs:inline-block ${
            simulationState.scenarioPreset === "normal_monsoon"
              ? "bg-ops-emerald/20 border-ops-emerald text-ops-emerald font-bold"
              : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
          }`}
        >
          Baseline
        </button>

        <button
          onClick={resetToBaseline}
          title="Reset simulation parameters to baseline"
          className="p-1.5 rounded-md bg-surface-elevated border border-border text-text-muted hover:text-text-primary hover:border-ops-cyan transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <Link
          href="/hazard-monitor"
          className="ml-1 inline-flex items-center gap-1 text-ops-cyan hover:underline text-xs font-semibold"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tune</span>
        </Link>
      </div>
    </div>
  );
}

