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
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Situation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border/80">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-mono tracking-tight flex items-center gap-2.5">
              <Waves className="w-5 h-5 text-ops-cyan" />
              <span>Hazard Monitor & Flood Simulator</span>
            </h1>
            <Badge variant="warning" dot={true}>SIMULATION MODE</Badge>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 font-sans">
            Deterministic hydro-meteorological flood simulation engine • Real-time district hazard propagation
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Baseline</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            isLoading={isSimulating}
            onClick={handleRunSimulation}
            className="gap-2 font-bold shadow-sm"
          >
            <Play className="w-4 h-4" />
            <span>{isSimulating ? "Analyzing..." : "Run Simulation"}</span>
          </Button>
        </div>
      </div>

      {/* 2. Simulation Control Panel */}
      <Card className="bg-surface border-border">
        <CardHeader className="bg-surface-subtle/40">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <SlidersHorizontal className="w-4 h-4 text-ops-cyan" />
              <CardTitle>HYDROLOGICAL SIMULATION PARAMETERS</CardTitle>
            </div>

            {/* Scenario Presets Quick Bar */}
            <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
              <span className="text-xs text-text-muted uppercase font-semibold">Presets:</span>
              <button
                onClick={() => handlePresetClick("normal_monsoon")}
                className={`px-3 py-1 rounded-md text-xs font-mono border transition-colors ${
                  simulationState.scenarioPreset === "normal_monsoon"
                    ? "bg-ops-emerald/20 border-ops-emerald text-ops-emerald font-bold"
                    : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
                }`}
              >
                Normal Monsoon
              </button>
              <button
                onClick={() => handlePresetClick("majuli_breach_scenario")}
                className={`px-3 py-1 rounded-md text-xs font-mono border transition-colors ${
                  simulationState.scenarioPreset === "majuli_breach_scenario"
                    ? "bg-ops-cyan/20 border-ops-cyan text-ops-cyan font-bold"
                    : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
                }`}
              >
                Majuli Breach
              </button>
              <button
                onClick={() => handlePresetClick("extreme_rainfall")}
                className={`px-3 py-1 rounded-md text-xs font-mono border transition-colors ${
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

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          {/* Param 1: Rainfall Intensity */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-text-primary uppercase font-bold flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-ops-cyan" />
                <span>1. Rainfall Intensity</span>
              </span>
              <span className="text-ops-cyan font-bold uppercase">{selectedRainfall}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["normal", "heavy", "extreme"] as RainfallIntensity[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedRainfall(level)}
                  className={`py-2 px-2 text-center text-xs rounded-md border transition-all uppercase font-semibold ${
                    selectedRainfall === level
                      ? level === "extreme"
                        ? "bg-ops-crimson/20 border-ops-crimson text-ops-crimson font-bold"
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
            <p className="text-xs text-text-secondary font-sans leading-relaxed">
              {selectedRainfall === "normal" && "Baseline seasonal showers (30 - 60mm / 24h)"}
              {selectedRainfall === "heavy" && "Torrential catchment downpour (120 - 180mm / 24h)"}
              {selectedRainfall === "extreme" && "Severe cloudburst clustering (200 - 280mm / 24h)"}
            </p>
          </div>

          {/* Param 2: River Gauge Level */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-text-primary uppercase font-bold flex items-center gap-2">
                <Waves className="w-4 h-4 text-ops-cyan" />
                <span>2. River Gauge Level</span>
              </span>
              <span className="text-ops-crimson font-bold uppercase text-xs">
                {selectedRiver.replace("_", " ")}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(["below_danger", "near_danger", "above_danger", "critical"] as RiverGaugeLevel[]).map(
                (level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedRiver(level)}
                    className={`py-2 px-1 text-center text-xs rounded-md border transition-all uppercase tracking-tight font-semibold ${
                      selectedRiver === level
                        ? level === "critical"
                          ? "bg-ops-crimson/20 border-ops-crimson text-ops-crimson font-bold"
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
            <p className="text-xs text-text-secondary font-sans leading-relaxed">
              {selectedRiver === "below_danger" && "Levels below warning mark (-0.5m)"}
              {selectedRiver === "near_danger" && "Approaching danger mark across major stations"}
              {selectedRiver === "above_danger" && "Exceeded danger mark (+0.8m), bank overflows"}
              {selectedRiver === "critical" && "Crossed HFL (+2.0m), embankment breach threat"}
            </p>
          </div>

          {/* Param 3: Forecast Horizon */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-text-primary uppercase font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-ops-amber" />
                <span>3. Forecast Horizon</span>
              </span>
              <span className="text-ops-amber font-bold">{selectedHorizon}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(["+6h", "+12h", "+24h", "+48h"] as ForecastHorizon[]).map((horizon) => (
                <button
                  key={horizon}
                  onClick={() => setSelectedHorizon(horizon)}
                  className={`py-2 px-1 text-center text-xs rounded-md border transition-all font-bold ${
                    selectedHorizon === horizon
                      ? "bg-ops-amber/20 border-ops-amber text-ops-amber font-bold"
                      : "bg-surface-elevated border-border text-text-muted hover:text-text-primary"
                  }`}
                >
                  {horizon}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-secondary font-sans leading-relaxed">
              Runoff accumulation and flood surge forecast window
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Hazard Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-border">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-text-muted uppercase font-semibold">
                24h Rainfall
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-ops-cyan mt-1">
                {simulationResult.globalRainfallMm} mm
              </div>
              <div className="text-xs font-mono text-text-secondary mt-1 uppercase">
                {simulationState.rainfallIntensity}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-ops-cyan/10 border border-ops-cyan/30 flex items-center justify-center text-ops-cyan shrink-0">
              <CloudRain className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-text-muted uppercase font-semibold">
                River Delta
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-ops-crimson mt-1">
                +{simulationResult.globalRiverDeltaM}m
              </div>
              <div className="text-xs font-mono text-text-secondary mt-1 uppercase truncate max-w-[120px]">
                {simulationState.riverGaugeLevel.replace("_", " ")}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-ops-crimson/10 border border-ops-crimson/30 flex items-center justify-center text-ops-crimson shrink-0">
              <Waves className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-text-muted uppercase font-semibold">
                Exposed Population
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-ops-amber mt-1">
                {(simulationResult.totalPopulationAffected / 100000).toFixed(2)}L+
              </div>
              <div className="text-xs font-mono text-text-secondary mt-1">
                {simulationResult.totalPopulationAffected.toLocaleString("en-IN")} citizens
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-ops-amber/10 border border-ops-amber/30 flex items-center justify-center text-ops-amber shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-text-muted uppercase font-semibold">
                Sectors in Danger
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-text-primary mt-1">
                {simulationResult.districtsAtRiskCount} <span className="text-sm text-text-muted font-normal">/ 34</span>
              </div>
              <div className="text-xs font-mono text-ops-crimson mt-1 font-semibold">
                {simulationResult.criticalDistrictsCount} Critical
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-ops-cyan shrink-0">
              <Activity className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>


      {/* 4. Main Intelligence Map with Dynamic Inundation Extent */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 flex-wrap gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] sm:text-xs font-semibold text-text-primary uppercase tracking-wider">
              Simulated Flood Inundation Map
            </span>
            <Badge variant="info" size="sm">
              {inundationPolygons.length} Zones
            </Badge>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-text-muted">
            Polygons dynamically expand with rainfall & river surge
          </span>
        </div>

        <AssamOverviewMap
          className="w-full h-[320px] xs:h-[380px] sm:h-[450px] lg:h-[520px]"
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* District Forecast Table (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <Card>
            <CardHeader className="py-2.5 sm:py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm">District Hazard Matrix</CardTitle>
                <Badge variant="neutral" size="sm">
                  Deterministic
                </Badge>
              </div>
              <CardDescription className="text-[10.5px]">
                Calculated hazard scores (0–100) combining rainfall surge, gauge delta, and district terrain.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs min-w-[460px]">
                <thead className="bg-surface-subtle text-text-muted text-[10px] uppercase border-b border-border">
                  <tr>
                    <th className="py-2 px-3">District</th>
                    <th className="py-2 px-3 text-center">Hazard Score</th>
                    <th className="py-2 px-3 text-center">Level</th>
                    <th className="py-2 px-3 text-center">Rain (24h)</th>
                    <th className="py-2 px-3 text-center">River Delta</th>
                    <th className="py-2 px-3 text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {simulationResult.districtHazards.map((item) => {
                    const isHotspot = item.isCriticalHotspot;

                    return (
                      <tr
                        key={item.districtId}
                        onClick={() => {
                          const dist = districts.find((d) => d.id === item.districtId);
                          if (dist) setActiveDistrict(dist);
                        }}
                        className={`hover:bg-surface-elevated transition-colors cursor-pointer ${
                          isHotspot ? "bg-ops-crimson/5 font-semibold" : ""
                        }`}
                      >
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-text-primary">{item.districtName}</span>
                            <span className="text-[10px] text-text-muted">({item.code})</span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-center font-bold">
                          <span
                            className={
                              item.hazardScore >= 80
                                ? "text-ops-crimson"
                                : item.hazardScore >= 60
                                ? "text-ops-amber"
                                : "text-ops-cyan"
                            }
                          >
                            {item.hazardScore}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <Badge
                            variant={
                              item.hazardLevel === "critical"
                                ? "critical"
                                : item.hazardLevel === "high"
                                ? "warning"
                                : item.hazardLevel === "moderate"
                                ? "info"
                                : "safe"
                            }
                            size="sm"
                          >
                            {item.hazardLevel.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-center text-text-secondary">
                          {item.rainfall24hMm} mm
                        </td>
                        <td className="py-2 px-3 text-center font-mono">
                          +{item.riverLevelDeltaM} m
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] text-ops-crimson font-medium">
                            <TrendingUp className="w-3 h-3" />
                            {item.trend}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Hazard Trajectory Chart (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <Card>
            <CardHeader className="py-2.5 sm:py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm">Hazard Trajectory (+48h)</CardTitle>
                <Badge variant="info" size="sm">
                  Predictive Curve
                </Badge>
              </div>
              <CardDescription className="text-[10.5px]">
                Deterministic surge projection over simulated forecast timeline.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 pb-4">
              <HazardTrajectoryChart trajectory={simulationResult.trajectory} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Incident Detail Drawer */}
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
