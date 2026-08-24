"use client";

import React from "react";
import { useAegisFlow } from "@/context/AegisFlowContext";
import { AlertTriangle, SlidersHorizontal, RotateCcw } from "lucide-react";
import Link from "next/link";

export function SimulationBar() {
  const { simulationState, applyScenarioPreset, resetToBaseline } = useAegisFlow();

  return (
    <div className="bg-surface-subtle border-b border-border/80 px-3 sm:px-6 py-1.5 sm:py-2 flex flex-wrap items-center justify-between text-[11px] sm:text-xs font-mono gap-2 shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-ops-amber font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-ops-amber animate-pulse shrink-0" />
          <span className="text-[10px] sm:text-xs">DEMO SIMULATION</span>
        </div>
        <span className="text-text-dim hidden xs:inline">|</span>
        <div className="text-text-secondary flex items-center gap-1.5 flex-wrap">
          <span className="hidden sm:inline">Preset:</span>
          <span className="text-text-primary uppercase font-bold bg-surface-elevated px-1.5 py-0.5 rounded border border-border text-[10px] sm:text-xs">
            {simulationState.scenarioPreset.replace(/_/g, " ")}
          </span>
          <span className="text-[10px] text-text-dim hidden md:inline">
            (Rain: <strong className="text-ops-cyan uppercase">{simulationState.rainfallIntensity}</strong> • River: <strong className="text-ops-crimson uppercase">{simulationState.riverGaugeLevel.replace(/_/g, " ")}</strong>)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-text-muted text-[10px] hidden sm:inline">Presets:</span>
        <button
          onClick={() => applyScenarioPreset("majuli_breach_scenario")}
          className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] transition-colors border ${
            simulationState.scenarioPreset === "majuli_breach_scenario"
              ? "bg-ops-cyan/20 border-ops-cyan text-ops-cyan font-bold"
              : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
          }`}
        >
          Majuli
        </button>
        <button
          onClick={() => applyScenarioPreset("extreme_rainfall")}
          className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] transition-colors border ${
            simulationState.scenarioPreset === "extreme_rainfall"
              ? "bg-ops-crimson/20 border-ops-crimson text-ops-crimson font-bold"
              : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
          }`}
        >
          Extreme
        </button>
        <button
          onClick={() => applyScenarioPreset("normal_monsoon")}
          className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] transition-colors border hidden xs:inline-block ${
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
          className="p-1 rounded bg-surface-elevated border border-border text-text-muted hover:text-text-primary hover:border-ops-cyan transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>

        <Link
          href="/hazard-monitor"
          className="ml-1 inline-flex items-center gap-1 text-ops-cyan hover:underline text-[10px] sm:text-[11px] font-bold"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span className="hidden sm:inline">Tune</span>
        </Link>
      </div>
    </div>
  );
}
