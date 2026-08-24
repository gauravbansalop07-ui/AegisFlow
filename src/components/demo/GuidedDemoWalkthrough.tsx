"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAegisFlow } from "@/context/AegisFlowContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Play,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  ShieldAlert,
  Boxes,
  Route,
  UserCheck,
  FileSpreadsheet,
  BellRing,
  AlertTriangle,
} from "lucide-react";

interface DemoStepConfig {
  step: number;
  route: string;
  badge: string;
  title: string;
  narration: string;
  highlightNote: string;
  autoAction?: (context: any) => Promise<void> | void;
}

const DEMO_STEPS: DemoStepConfig[] = [
  {
    step: 1,
    route: "/",
    badge: "01 / 09 • CURRENT SITUATION",
    title: "Unified Operational Picture",
    narration:
      "AegisFlow provides Commander Gaurav Bansal and the Emergency Operations Center a single operational picture of the current flood situation in Assam. Commanders immediately observe exposed populations, critical river gauges, and active incidents.",
    highlightNote: "Review Situation KPIs, interactive Assam Hydro-GIS map, and Critical Incident dossier.",
    autoAction: (ctx) => {
      ctx.setSelectedDistrictId(null);
    },
  },
  {
    step: 2,
    route: "/hazard-monitor",
    badge: "02 / 09 • HAZARD SIMULATION",
    title: "Deterministic Flood Forecast",
    narration:
      "Instead of waiting for the situation to deteriorate, commanders simulate how the hazard may evolve over the next 24 hours under extreme rainfall and critical river surges.",
    highlightNote: "Extreme Rainfall (195mm/24h) and Critical River (+2.4m) forecast applied to hydro-GIS model.",
    autoAction: async (ctx) => {
      ctx.applyScenarioPreset("extreme_rainfall");
      await ctx.runSimulationBatch({
        rainfallIntensity: "extreme",
        riverGaugeLevel: "critical",
        forecastHorizon: "+24h",
      });
    },
  },
  {
    step: 3,
    route: "/risk-prioritization",
    badge: "03 / 09 • IMPACT PRIORITIZATION",
    title: "Mathematical Impact Risk Model",
    narration:
      "AegisFlow does not simply rank locations by flood depth. It combines hazard, population exposure, demographic vulnerability, and infrastructure criticality to determine where intervention matters most.",
    highlightNote: "Observe Majuli prioritized as #1 Critical Hotspot due to island isolation and kutcha housing fragility.",
  },
  {
    step: 4,
    route: "/resources",
    badge: "04 / 09 • RESOURCE OPTIMIZATION",
    title: "Priority-Weighted Asset Allocation",
    narration:
      "Given strictly limited rescue boats and medical teams, AegisFlow shifts inventory from lower-risk depots to highest-impact locations, delivering a +14% operational efficiency gain over manual baseline.",
    highlightNote: "Notice scarce inflatable rescue boats staged directly toward Majuli and Lakhimpur.",
    autoAction: async (ctx) => {
      await ctx.triggerOptimization();
    },
  },
  {
    step: 5,
    route: "/response-plan",
    badge: "05 / 09 • ACCESS-AWARE ROUTING",
    title: "Safe Evacuation Corridor",
    narration:
      "AegisFlow identifies the safest available evacuation corridor to the designated flood shelter (Garamur Higher Secondary Relief Camp), evaluating road surface accessibility.",
    highlightNote: "Primary route selected via SH-12 Garamur Highway (14.2 km, ~26 mins, rated SAFE).",
    autoAction: (ctx) => {
      ctx.setSelectedOriginId("majuli");
      ctx.resetRoadOverrides();
    },
  },
  {
    step: 6,
    route: "/response-plan",
    badge: "06 / 09 • DYNAMIC RE-ROUTING",
    title: "Road Breach & Instant Recalculation",
    narration:
      "When a critical bridge or road segment becomes breached by floodwaters, AegisFlow removes it from the topological graph and instantly shifts to the safest alternative route.",
    highlightNote: "SH-12 marked FLOODED (+1.4m water). System auto-reroutes via Kamalabari Interior Embankment.",
    autoAction: (ctx) => {
      ctx.toggleRoadOverride("road-sh12");
    },
  },
  {
    step: 7,
    route: "/response-plan",
    badge: "07 / 09 • HUMAN-IN-THE-LOOP",
    title: "Commander Authorization",
    narration:
      "AegisFlow never autonomously deploys resources. Commander Gaurav Bansal evaluates the full decision trace, examines 'Why This Plan?', and formally authorizes the response.",
    highlightNote: "Review Decision Trace Flow and click 'Approve Response Plan' to record Commander Gaurav Bansal's signature in the audit ledger.",
  },
  {
    step: 8,
    route: "/reports",
    badge: "08 / 09 • SITUATION REPORT",
    title: "Accountable Operations Briefing",
    narration:
      "The entire operational cycle—from simulated telemetry to risk scores, resource allocations, route contingencies, and commander approvals—is locked into an immutable briefing dossier.",
    highlightNote: "Review Executive Summary, KPI audit, and export printable situation report.",
    autoAction: (ctx) => {
      ctx.generateIncidentReport();
    },
  },
  {
    step: 9,
    route: "/alerts",
    badge: "09 / 09 • OFFICIAL INTELLIGENCE",
    title: "Multi-Agency Alert Integration",
    narration:
      "Official-source warnings from CWC, IMD, and ASDMA remain authoritative and are correlated directly with AegisFlow's operational decision support.",
    highlightNote: "Official flood bulletins synchronized with live river gauge crests.",
  },
];

export function GuidedDemoWalkthrough() {
  const router = useRouter();
  const pathname = usePathname();
  const context = useAegisFlow();
  const { isDemoMode, demoStep, setDemoStep, exitDemo, skipDemo, isSimulating, isOptimizing } = context;

  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const [hasActionFailed, setHasActionFailed] = useState(false);

  const currentConfig = DEMO_STEPS[demoStep - 1] || DEMO_STEPS[0];
  const isLastStep = demoStep === DEMO_STEPS.length;
  const isFirstStep = demoStep === 1;

  const handleNext = useCallback(() => {
    if (isLastStep) {
      exitDemo();
      router.push("/");
    } else {
      setDemoStep(demoStep + 1);
    }
  }, [isLastStep, demoStep, setDemoStep, exitDemo, router]);

  const handlePrev = useCallback(() => {
    if (!isFirstStep) {
      setDemoStep(demoStep - 1);
    }
  }, [isFirstStep, demoStep, setDemoStep]);

  // Keyboard navigation support for easy presenter control
  useEffect(() => {
    if (!isDemoMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        exitDemo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDemoMode, handleNext, handlePrev, exitDemo]);

  // Run step setup and navigation
  useEffect(() => {
    if (!isDemoMode) return;

    const executeStep = async () => {
      setIsExecutingAction(true);
      setHasActionFailed(false);

      try {
        if (pathname !== currentConfig.route) {
          router.push(currentConfig.route);
        }

        if (currentConfig.autoAction) {
          await currentConfig.autoAction(context);
        }
      } catch (err) {
        console.error("Demo step transition error:", err);
        setHasActionFailed(true);
      } finally {
        setIsExecutingAction(false);
      }
    };

    executeStep();
  }, [demoStep, isDemoMode]);

  if (!isDemoMode) return null;

  const handleRetry = async () => {
    setIsExecutingAction(true);
    setHasActionFailed(false);
    try {
      if (pathname !== currentConfig.route) {
        router.push(currentConfig.route);
      }
      if (currentConfig.autoAction) {
        await currentConfig.autoAction(context);
      }
    } catch (err) {
      setHasActionFailed(true);
    } finally {
      setIsExecutingAction(false);
    }
  };

  const progressPercent = (demoStep / DEMO_STEPS.length) * 100;
  const isBusy = isExecutingAction || isSimulating || isOptimizing;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-lg w-full font-mono text-xs animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-surface/95 backdrop-blur-md border-2 border-ops-cyan rounded-lg shadow-2xl overflow-hidden shadow-ops-cyan/15">
        {/* Top Progress Bar */}
        <div className="h-1.5 w-full bg-surface-elevated">
          <div
            className="h-full bg-ops-cyan transition-all duration-300 shadow-glow-cyan"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Header Bar */}
        <div className="px-4 py-2.5 bg-surface-elevated flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-ops-cyan animate-ping" />
            <Badge variant="info" size="sm" className="font-bold">
              {currentConfig.badge}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-text-muted hidden sm:inline">
              [← / → Keys]
            </span>
            <button
              onClick={skipDemo}
              className="px-2 py-0.5 rounded text-[10px] text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors"
            >
              Skip
            </button>
            <button
              onClick={exitDemo}
              className="p-1 rounded text-text-muted hover:text-ops-crimson hover:bg-surface-subtle transition-colors"
              title="Exit & Reset Demo (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 space-y-3 bg-surface">
          <div>
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-ops-cyan" />
              <span>{currentConfig.title}</span>
            </h3>
            <p className="text-[11.5px] text-text-secondary leading-relaxed mt-1">
              {currentConfig.narration}
            </p>
          </div>

          {/* Highlight Callout */}
          <div className="p-2.5 rounded bg-ops-cyan/10 border border-ops-cyan/30 text-[11px] text-text-primary space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-ops-cyan text-[10px] uppercase">
              <Info className="w-3.5 h-3.5" />
              <span>Live Demonstration Action:</span>
            </div>
            <div className="text-text-primary text-[10.5px] leading-snug">
              {currentConfig.highlightNote}
            </div>
          </div>

          {/* Error / Busy Banner */}
          {hasActionFailed && (
            <div className="p-2 rounded bg-ops-crimson/15 border border-ops-crimson/40 text-[10.5px] flex items-center justify-between text-ops-crimson">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Demo action failed</span>
              </div>
              <button
                onClick={handleRetry}
                className="underline font-bold hover:text-white"
              >
                Retry Step
              </button>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <button
              onClick={exitDemo}
              className="text-[10px] text-text-muted hover:text-ops-crimson flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Exit & Reset</span>
            </button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={isFirstStep || isBusy}
                className="gap-1 text-xs py-1 px-2.5 h-7"
              >
                <ChevronLeft className="w-3 h-3" />
                <span>Prev</span>
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                disabled={isBusy}
                className="gap-1.5 text-xs py-1 px-3 h-7 font-bold shadow-glow-cyan"
              >
                {isBusy ? (
                  <span>Syncing State...</span>
                ) : isLastStep ? (
                  <>
                    <span>Finish Demo</span>
                    <CheckCircle2 className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ChevronRight className="w-3 h-3" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
