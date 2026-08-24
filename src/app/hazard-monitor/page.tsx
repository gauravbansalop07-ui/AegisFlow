"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AssamOverviewMap } from "@/components/map/AssamOverviewMap";
import { HazardTrajectoryChart } from "@/components/charts/HazardTrajectoryChart";
import { IncidentDetailDrawer } from "@/components/response/IncidentDetailDrawer";
import {
  Waves,
  CloudRain,
  SlidersHorizontal,
  RotateCcw,
  Play,
  Activity,
  AlertTriangle,
  Users,
  Compass,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Info,
  Clock,
  Layers,
} from "lucide-react";
import { useAegisFlow } from "@/context/AegisFlowContext";
import {
  RainfallIntensity,
  RiverGaugeLevel,
  ForecastHorizon,
  ScenarioPreset,
  Incident,
  District,
} from "@/types";
import { Tooltip } from "@/components/ui/Tooltip";

export default function HazardMonitorPage() {
  const {
    simulationState,
    simulationResult,
    isSimulating,
    districts,
    incidents,
    shelters,
    gauges,
    inundationPolygons,
    applyScenarioPreset,
    runSimulationBatch,
    resetToBaseline,
    showToast,
  } = useAegisFlow();

  // Local control state before running batch simulation
  const [selectedRainfall, setSelectedRainfall] = useState<RainfallIntensity>(
    simulationState.rainfallIntensity
  );
  const [selectedRiver, setSelectedRiver] = useState<RiverGaugeLevel>(
    simulationState.riverGaugeLevel
  );
  const [selectedHorizon, setSelectedHorizon] = useState<ForecastHorizon>(
    simulationState.forecastHorizon
  );

  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const [activeDistrict, setActiveDistrict] = useState<District | null>(null);

  const handleRunSimulation = async () => {
    await runSimulationBatch({
      rainfallIntensity: selectedRainfall,
      riverGaugeLevel: selectedRiver,
      forecastHorizon: selectedHorizon,
    });
  };

  const handlePresetClick = (preset: ScenarioPreset) => {
    applyScenarioPreset(preset);
    if (preset === "normal_monsoon") {
      setSelectedRainfall("normal");
      setSelectedRiver("below_danger");
      setSelectedHorizon("+6h");
    } else if (preset === "extreme_rainfall") {
      setSelectedRainfall("extreme");
      setSelectedRiver("critical");
      setSelectedHorizon("+48h");
    } else if (preset === "majuli_breach_scenario") {
      setSelectedRainfall("heavy");
      setSelectedRiver("critical");
      setSelectedHorizon("+24h");
    }
  };

  const handleReset = () => {
    resetToBaseline();
    setSelectedRainfall("heavy");
    setSelectedRiver("critical");
    setSelectedHorizon("+24h");
  };

  return (
    <div className="space-y-6">
      {/* 1. Situation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold text-text-primary font-mono uppercase tracking-wider flex items-center gap-2">
              <Waves className="w-5 h-5 text-ops-cyan" />
              <span>Hazard Monitor & Flood Simulator</span>
            </h1>
            <div className="flex items-center gap-1.5">
              <Badge variant="warning" dot={true}>
                SIMULATION MODE
              </Badge>
              <Badge variant="neutral">DEMO DATA</Badge>
              <Tooltip content="Deterministic calculation based on rainfall, river gauges, and terrain sensitivities. Not an operational ML forecast.">
                <span className="cursor-help text-text-muted hover:text-ops-cyan">
                  <Info className="w-3.5 h-3.5" />
                </span>
              </Tooltip>
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-1 font-mono">
            Deterministic hydro-meteorological flood simulation engine • Real-time district hazard propagation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET TO BASELINE</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            isLoading={isSimulating}
            onClick={handleRunSimulation}
            className="gap-1.5 shadow-glow-cyan"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isSimulating ? "ANALYZING..." : "RUN SIMULATION"}</span>
          </Button>
        </div>
      </div>

      {/* 2. Simulation Control Panel */}
      <Card className="bg-surface border-border-strong">
        <CardHeader className="py-3 bg-surface-subtle/70">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-ops-cyan" />
              <CardTitle>FLOOD SIMULATION CONTROLS</CardTitle>
            </div>

            {/* Scenario Presets Quick Bar */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[11px] text-text-muted uppercase">Scenario Presets:</span>
              <button
                onClick={() => handlePresetClick("normal_monsoon")}
                className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                  simulationState.scenarioPreset === "normal_monsoon"
                    ? "bg-ops-emerald/20 border-ops-emerald text-ops-emerald font-bold"
                    : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
                }`}
              >
                Baseline (Normal Monsoon)
              </button>
              <button
                onClick={() => handlePresetClick("majuli_breach_scenario")}
                className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                  simulationState.scenarioPreset === "majuli_breach_scenario"
                    ? "bg-ops-cyan/20 border-ops-cyan text-ops-cyan font-bold"
                    : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
                }`}
              >
                Majuli Inundation
              </button>
              <button
                onClick={() => handlePresetClick("extreme_rainfall")}
                className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                  simulationState.scenarioPreset === "extreme_rainfall"
                    ? "bg-ops-crimson/20 border-ops-crimson text-ops-crimson font-bold"
                    : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
                }`}
              >
                Extreme Rainfall
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          {/* Param 1: Rainfall Intensity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary uppercase font-bold flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-ops-cyan" />
                <span>1. Rainfall Intensity</span>
              </span>
              <span className="text-ops-cyan font-bold uppercase">{selectedRainfall}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(["normal", "heavy", "extreme"] as RainfallIntensity[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedRainfall(level)}
                  className={`py-2 px-1 text-center text-xs rounded border transition-all uppercase ${
                    selectedRainfall === level
                      ? level === "extreme"
                        ? "bg-ops-crimson/20 border-ops-crimson text-ops-crimson font-bold shadow-glow-crimson"
                        : level === "heavy"
                        ? "bg-ops-amber/20 border-ops-amber text-ops-amber font-bold"
                        : "bg-ops-emerald/20 border-ops-emerald text-ops-emerald font-bold"
                      : "bg-surface-elevated border-border text-text-muted hover:text-text-primary"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-text-dim">
              {selectedRainfall === "normal" && "Baseline seasonal showers (30 - 60mm/24h)"}
              {selectedRainfall === "heavy" && "Torrential catchment downpour (120 - 180mm/24h)"}
              {selectedRainfall === "extreme" && "Severe cloudburst clustering (200 - 280mm/24h)"}
            </div>
          </div>

          {/* Param 2: River Gauge Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary uppercase font-bold flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-ops-cyan" />
                <span>2. River Gauge Level</span>
              </span>
              <span className="text-ops-crimson font-bold uppercase">
                {selectedRiver.replace("_", " ")}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(["below_danger", "near_danger", "above_danger", "critical"] as RiverGaugeLevel[]).map(
                (level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedRiver(level)}
                    className={`py-2 px-1 text-center text-[10px] rounded border transition-all uppercase tracking-tight ${
                      selectedRiver === level
                        ? level === "critical"
                          ? "bg-ops-crimson/20 border-ops-crimson text-ops-crimson font-bold shadow-glow-crimson"
                          : level === "above_danger"
                          ? "bg-ops-amber/20 border-ops-amber text-ops-amber font-bold"
                          : level === "near_danger"
                          ? "bg-ops-indigo/20 border-ops-indigo text-ops-indigo-light font-bold"
                          : "bg-ops-emerald/20 border-ops-emerald text-ops-emerald font-bold"
                        : "bg-surface-elevated border-border text-text-muted hover:text-text-primary"
                    }`}
                  >
                    {level === "below_danger"
                      ? "Below"
                      : level === "near_danger"
                      ? "Near"
                      : level === "above_danger"
                      ? "Above"
                      : "Critical"}
                  </button>
                )
              )}
            </div>
            <div className="text-[10px] text-text-dim">
              {selectedRiver === "below_danger" && "River gauge levels below warning marks (-0.5m)"}
              {selectedRiver === "near_danger" && "Approaching danger mark across major tributaries"}
              {selectedRiver === "above_danger" && "Exceeded danger mark (+0.8m), active bank overflows"}
              {selectedRiver === "critical" && "Crossed HFL (+2.0m), embankment breach threat"}
            </div>
          </div>

          {/* Param 3: Forecast Horizon */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary uppercase font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-ops-amber" />
                <span>3. Forecast Horizon</span>
              </span>
              <span className="text-ops-amber font-bold">{selectedHorizon}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(["+6h", "+12h", "+24h", "+48h"] as ForecastHorizon[]).map((horizon) => (
                <button
                  key={horizon}
                  onClick={() => setSelectedHorizon(horizon)}
                  className={`py-2 px-1 text-center text-xs rounded border transition-all font-bold ${
                    selectedHorizon === horizon
                      ? "bg-ops-amber/20 border-ops-amber text-ops-amber shadow-ops-sm"
                      : "bg-surface-elevated border-border text-text-muted hover:text-text-primary"
                  }`}
                >
                  {horizon}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-text-dim">
              Time accumulation multiplier applied across catchment runoff & tributary swelling
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Hazard Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase">
                Simulated 24h Rainfall
              </div>
              <div className="text-2xl font-bold font-mono text-ops-cyan mt-0.5">
                {simulationResult.globalRainfallMm} mm
              </div>
              <div className="text-[10px] font-mono text-text-dim mt-0.5">
                Intensity: {simulationState.rainfallIntensity.toUpperCase()}
              </div>
            </div>
            <div className="w-9 h-9 rounded bg-ops-cyan/10 border border-ops-cyan/30 flex items-center justify-center text-ops-cyan shrink-0">
              <CloudRain className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase">
                River Level Delta
              </div>
              <div className="text-2xl font-bold font-mono text-ops-crimson mt-0.5">
                +{simulationResult.globalRiverDeltaM}m
              </div>
              <div className="text-[10px] font-mono text-text-dim mt-0.5">
                Status: {simulationState.riverGaugeLevel.replace("_", " ").toUpperCase()}
              </div>
            </div>
            <div className="w-9 h-9 rounded bg-ops-crimson/10 border border-ops-crimson/30 flex items-center justify-center text-ops-crimson shrink-0">
              <Waves className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase">
                Estimated Pop. Exposed
              </div>
              <div className="text-2xl font-bold font-mono text-ops-amber mt-0.5">
                {(simulationResult.totalPopulationAffected / 100000).toFixed(2)}L+
              </div>
              <div className="text-[10px] font-mono text-text-dim mt-0.5">
                {simulationResult.totalPopulationAffected.toLocaleString("en-IN")} residents
              </div>
            </div>
            <div className="w-9 h-9 rounded bg-ops-amber/10 border border-ops-amber/30 flex items-center justify-center text-ops-amber shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase">
                Districts In Danger
              </div>
              <div className="text-2xl font-bold font-mono text-text-primary mt-0.5">
                {simulationResult.districtsAtRiskCount} <span className="text-xs text-text-muted font-normal">/ 34</span>
              </div>
              <div className="text-[10px] font-mono text-ops-crimson mt-0.5">
                {simulationResult.criticalDistrictsCount} Critical Hotspots
              </div>
            </div>
            <div className="w-9 h-9 rounded bg-surface-elevated border border-border flex items-center justify-center text-ops-cyan shrink-0">
              <Activity className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Main Intelligence Map with Dynamic Inundation Extent */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-text-primary uppercase tracking-wider">
              Simulated Flood Inundation & River Basin Spread
            </span>
            <Badge variant="info">
              {inundationPolygons.length} Inundation Zones
            </Badge>
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            Polygons dynamically expand based on simulated rainfall & river level
          </span>
        </div>

        <AssamOverviewMap
          className="w-full h-[520px]"
          districts={districts}
          incidents={incidents}
          shelters={shelters}
          gauges={gauges}
          inundationPolygons={inundationPolygons}
          onSelectIncident={(inc) => {
            setActiveDistrict(null);
            setActiveIncident(inc);
          }}
          onSelectDistrict={(dist) => {
            const match = incidents.find((i) => i.districtId === dist.id);
            if (match) {
              setActiveDistrict(null);
              setActiveIncident(match);
            } else {
              setActiveIncident(null);
              setActiveDistrict(dist);
            }
          }}
        />
      </div>

      {/* 5. Bottom Analytics Row: District Forecast Table + Simulated Hazard Trajectory Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* District Forecast Table (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle>District Hazard Forecast Matrix</CardTitle>
                <Badge variant="neutral" size="sm">
                  Deterministic Output
                </Badge>
              </div>
              <CardDescription>
                Calculated hazard scores (0–100) combining rainfall surge, gauge delta, and district terrain vulnerability.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-surface-subtle text-text-muted text-[10px] uppercase border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3">District</th>
                    <th className="py-2.5 px-3">Primary River</th>
                    <th className="py-2.5 px-3 text-center">Hazard Score</th>
                    <th className="py-2.5 px-3 text-center">Trend</th>
                    <th className="py-2.5 px-3 text-center">Exposure</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {simulationResult.districtHazards.map((item) => {
                    const isCrit = item.hazardLevel === "critical";
                    const isHigh = item.hazardLevel === "high";
                    const isMod = item.hazardLevel === "moderate";

                    return (
                      <tr
                        key={item.districtId}
                        onClick={() => {
                          const matchedDist = districts.find((d) => d.id === item.districtId);
                          if (matchedDist) {
                            const matchedInc = incidents.find((i) => i.districtId === item.districtId);
                            if (matchedInc) {
                              setActiveDistrict(null);
                              setActiveIncident(matchedInc);
                            } else {
                              setActiveIncident(null);
                              setActiveDistrict(matchedDist);
                            }
                          }
                        }}
                        className="hover:bg-surface-elevated/80 transition-colors cursor-pointer"
                      >
                        <td className="py-2 px-3 font-semibold text-text-primary">
                          {item.districtName}
                        </td>
                        <td className="py-2 px-3 text-[11px] text-text-secondary">
                          {item.primaryRiver}
                        </td>
                        <td className="py-2 px-3 text-center font-bold">
                          <span
                            className={
                              isCrit
                                ? "text-ops-crimson"
                                : isHigh
                                ? "text-ops-amber"
                                : isMod
                                ? "text-ops-indigo-light"
                                : "text-ops-emerald"
                            }
                          >
                            {item.hazardScore}
                          </span>
                          <span className="text-[10px] text-text-dim">/100</span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          {item.trend === "rising" ? (
                            <span className="inline-flex items-center text-ops-crimson">
                              <TrendingUp className="w-3.5 h-3.5" />
                            </span>
                          ) : item.trend === "falling" ? (
                            <span className="inline-flex items-center text-ops-emerald">
                              <TrendingDown className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-text-muted">
                              <Minus className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center text-[11px] text-text-secondary">
                          {item.exposureCategory}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <Badge
                            variant={isCrit ? "critical" : isHigh ? "warning" : isMod ? "neutral" : "safe"}
                            size="sm"
                          >
                            {item.hazardLevel}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Simulated Hazard Trajectory Line Chart (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-ops-cyan" />
                  <span>SIMULATED HAZARD TRAJECTORY</span>
                </CardTitle>
                <Badge variant="info" size="sm">
                  {simulationState.forecastHorizon}
                </Badge>
              </div>
              <CardDescription>
                Projected hazard evolution from NOW (T+0) to T+48 Hours under active simulation parameters.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-1 pb-3">
              <HazardTrajectoryChart trajectory={simulationResult.trajectory} />
            </CardContent>
          </Card>

          {/* Quick Simulation Insights */}
          <div className="p-3.5 rounded bg-surface-subtle border border-border font-mono text-xs space-y-1.5">
            <div className="text-ops-cyan font-bold text-[11px] uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cross-Module Propagation Status:</span>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Simulation output is synchronized across the centralized state. Navigating to the <strong>Overview Dashboard</strong> will display these exact updated district risk levels, gauges, and exposed populations.
            </p>
          </div>
        </div>
      </div>

      {/* Incident Detail Drawer for drilldown */}
      <IncidentDetailDrawer
        incident={activeIncident}
        district={activeDistrict}
        onClose={() => {
          setActiveIncident(null);
          setActiveDistrict(null);
        }}
      />
    </div>
  );
}
