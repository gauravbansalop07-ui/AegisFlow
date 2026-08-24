"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import {
  District,
  HazardGauge,
  RainfallStation,
  ResourceItem,
  LocationResourceAllocation,
  Shelter,
  EvacuationRoute,
  Alert,
  ResponsePlan,
  SituationReport,
  SimulationState,
  SimulationResult,
  RainfallIntensity,
  RiverGaugeLevel,
  ForecastHorizon,
  ScenarioPreset,
  Incident,
  InundationPolygon,
  RiskScore,
  OptimizationResult,
  RoutingEngineResult,
} from "@/types";
import { ASSAM_DISTRICTS } from "@/data/districts";
import { RIVER_GAUGES, RAINFALL_STATIONS } from "@/data/hazards";
import { INVENTORY_RESOURCES, MANUAL_ALLOCATIONS } from "@/data/resources";
import { SHELTERS } from "@/data/shelters";
import { EVACUATION_ROUTES } from "@/data/routes";
import { INITIAL_ALERTS } from "@/data/alerts";
import { INITIAL_INCIDENTS } from "@/data/incidents";
import { runFloodSimulation } from "@/lib/simulationEngine";
import { calculateAllImpactScores } from "@/lib/scoringModel";
import { runResourceOptimizer } from "@/lib/resourceOptimizer";
import { calculateEvacuationRoutes } from "@/lib/routingEngine";
import { buildRecommendedResponsePlan } from "@/lib/responsePlanBuilder";
import { buildSituationReport } from "@/lib/reportBuilder";

export interface ToastNotification {
  id: string;
  title: string;
  message?: string;
  type: "info" | "success" | "warning" | "error";
  duration?: number;
}

const BASELINE_SIMULATION_STATE: SimulationState = {
  isSimulationMode: true,
  rainfallIntensity: "heavy",
  riverGaugeLevel: "critical",
  forecastHorizon: "+24h",
  scenarioPreset: "majuli_breach_scenario",
  lastUpdatedTimestamp: "02:00 PM (Simulated)",
};

interface AegisFlowContextType {
  simulationState: SimulationState;
  setSimulationState: React.Dispatch<React.SetStateAction<SimulationState>>;
  simulationResult: SimulationResult;
  isSimulating: boolean;

  updateSimulationParam: (
    param: keyof Omit<SimulationState, "lastUpdatedTimestamp">,
    value: any
  ) => void;
  applyScenarioPreset: (scenario: ScenarioPreset) => void;
  runSimulationBatch: (params: Partial<SimulationState>) => Promise<void>;
  resetToBaseline: () => void;

  districts: District[];
  selectedDistrictId: string | null;
  setSelectedDistrictId: (id: string | null) => void;

  incidents: Incident[];
  selectedIncident: Incident | null;
  setSelectedIncident: (incident: Incident | null) => void;

  impactScores: RiskScore[];
  selectedRiskScore: RiskScore | null;
  setSelectedRiskScore: (score: RiskScore | null) => void;

  // Phase 6 Optimizer State
  optimizationResult: OptimizationResult;
  isOptimizedMode: boolean;
  isOptimizing: boolean;
  triggerOptimization: () => Promise<void>;
  resetOptimizationMode: () => void;

  // Phase 7 Dynamic Routing State
  routingResult: RoutingEngineResult;
  selectedOriginId: string;
  setSelectedOriginId: (id: string) => void;
  selectedShelterId: string;
  setSelectedShelterId: (id: string) => void;
  manualRoadOverrides: Record<string, "open" | "flooded">;
  toggleRoadOverride: (roadId: string) => void;
  resetRoadOverrides: () => void;

  // Phase 8 Response Plan & Human-in-the-Loop State
  currentResponsePlan: ResponsePlan | null;
  responsePlanHistory: ResponsePlan[];
  regenerateResponsePlan: (targetDistrictId?: string) => void;
  approveCurrentResponsePlan: (commanderName: string, notes?: string) => void;
  rejectCurrentResponsePlan: (reason: string, notes?: string) => void;
  modifyCurrentResponsePlan: (
    modifiedResources: ResponsePlan["recommendedResources"],
    notes: string
  ) => void;
  selectHistoricalPlan: (planId: string) => void;

  // Phase 9 Alerts State
  gauges: HazardGauge[];
  rainfallStations: RainfallStation[];
  resources: ResourceItem[];
  allocations: LocationResourceAllocation[];
  shelters: Shelter[];
  routes: EvacuationRoute[];
  alerts: Alert[];
  inundationPolygons: InundationPolygon[];

  toggleRouteStatus: (routeId: string) => void;
  acknowledgeAlert: (alertId: string, commanderName?: string) => void;
  unacknowledgeAlert: (alertId: string) => void;
  toggleAlertStatus: (alertId: string) => void;

  // Phase 10 Situation Reports State
  currentReport: SituationReport | null;
  reportHistory: SituationReport[];
  generateIncidentReport: () => void;
  selectHistoricalReport: (reportId: string) => void;

  // Phase 11 Guided Demo State
  isDemoMode: boolean;
  demoStep: number;
  startDemo: () => void;
  exitDemo: () => void;
  skipDemo: () => void;
  setDemoStep: (step: number) => void;

  toasts: ToastNotification[];
  showToast: (toast: Omit<ToastNotification, "id">) => void;
  dismissToast: (id: string) => void;
}

const AegisFlowContext = createContext<AegisFlowContextType | undefined>(undefined);

export function AegisFlowProvider({ children }: { children: React.ReactNode }) {
  const [simulationState, setSimulationState] = useState<SimulationState>(BASELINE_SIMULATION_STATE);
  const [isSimulating, setIsSimulating] = useState(false);

  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>("majuli");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedRiskScore, setSelectedRiskScore] = useState<RiskScore | null>(null);

  // Phase 6 Optimizer Mode
  const [isOptimizedMode, setIsOptimizedMode] = useState<boolean>(true);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  // Phase 7 Dynamic Routing State
  const [selectedOriginId, setSelectedOriginId] = useState<string>("majuli");
  const [selectedShelterId, setSelectedShelterId] = useState<string>("shelter-majuli-garamur");
  const [manualRoadOverrides, setManualRoadOverrides] = useState<Record<string, "open" | "flooded">>({});

  // Phase 11 Demo State
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);

  const [baseDistricts] = useState<District[]>(ASSAM_DISTRICTS);
  const [baseGauges] = useState<HazardGauge[]>(RIVER_GAUGES);
  const [rainfallStations] = useState<RainfallStation[]>(RAINFALL_STATIONS);
  const [resources] = useState<ResourceItem[]>(INVENTORY_RESOURCES);
  const [allocations] = useState<LocationResourceAllocation[]>(MANUAL_ALLOCATIONS);
  const [shelters] = useState<Shelter[]>(SHELTERS);
  const [routes, setRoutes] = useState<EvacuationRoute[]>(EVACUATION_ROUTES);

  // 1. Live deterministic simulation output
  const simulationResult = useMemo(
    () => runFloodSimulation(simulationState, baseDistricts, baseGauges),
    [simulationState, baseDistricts, baseGauges]
  );

  // 2. Live Impact Risk Scores
  const impactScores = useMemo(
    () => calculateAllImpactScores(baseDistricts, simulationResult.districtHazards),
    [baseDistricts, simulationResult.districtHazards]
  );

  // 3. Live Resource Optimization Result
  const optimizationResult = useMemo(
    () => runResourceOptimizer(impactScores),
    [impactScores]
  );

  // 4. Live Dynamic Evacuation Routing Result
  const routingResult = useMemo(
    () =>
      calculateEvacuationRoutes(
        selectedOriginId,
        selectedShelterId,
        simulationState,
        manualRoadOverrides,
        shelters,
        impactScores
      ),
    [
      selectedOriginId,
      selectedShelterId,
      simulationState,
      manualRoadOverrides,
      shelters,
      impactScores,
    ]
  );

  // 5. Update district risk levels reactively
  const districts = useMemo(() => {
    return baseDistricts.map((d) => {
      const risk = impactScores.find((r) => r.locationId === d.id);
      return {
        ...d,
        currentRiskLevel: risk?.priorityLevel || d.currentRiskLevel || "moderate",
      };
    });
  }, [baseDistricts, impactScores]);

  const gauges = simulationResult.gauges;
  const inundationPolygons = simulationResult.inundationPolygons;

  const incidents = useMemo(() => {
    return INITIAL_INCIDENTS.map((inc) => {
      const risk = impactScores.find((r) => r.locationId === inc.districtId);
      const hazard = simulationResult.districtHazards.find((h) => h.districtId === inc.districtId);
      if (risk && hazard) {
        return {
          ...inc,
          severity: risk.priorityLevel,
          affectedPopulationEst: risk.populationExposed,
          condition:
            risk.priorityLevel === "critical"
              ? `Impact ${risk.impactScore}/100 • +${hazard.riverLevelDeltaM}m above Danger Line (${hazard.rainfall24hMm}mm)`
              : risk.priorityLevel === "high"
              ? `Impact ${risk.impactScore}/100 • High Risk (${hazard.rainfall24hMm}mm rainfall)`
              : `Impact ${risk.impactScore}/100 • Stable corridor`,
          actionRequired: risk.recommendedAction,
        };
      }
      return inc;
    });
  }, [impactScores, simulationResult]);

  // Phase 8 Response Plan & History State
  const [responsePlanHistory, setResponsePlanHistory] = useState<ResponsePlan[]>([]);
  const [currentResponsePlan, setCurrentResponsePlan] = useState<ResponsePlan | null>(null);
  const [planCounter, setPlanCounter] = useState<number>(1);

  // Automatically initialize first plan on mount
  useEffect(() => {
    if (!currentResponsePlan && impactScores.length > 0) {
      const initialPlan = buildRecommendedResponsePlan(
        selectedOriginId,
        impactScores,
        optimizationResult,
        routingResult,
        shelters,
        simulationState,
        1
      );
      setCurrentResponsePlan(initialPlan);
      setResponsePlanHistory([initialPlan]);
      setPlanCounter(2);
    }
  }, [impactScores, optimizationResult, routingResult, shelters, selectedOriginId, simulationState]);

  // Detect situation changes while a plan is pending approval
  useEffect(() => {
    if (
      currentResponsePlan &&
      currentResponsePlan.status === "pending_approval" &&
      currentResponsePlan.simulationTimestamp !== simulationState.lastUpdatedTimestamp
    ) {
      setCurrentResponsePlan((prev) => (prev ? { ...prev, isOutdated: true } : null));
    }
  }, [simulationState, currentResponsePlan]);

  // Phase 9 Alerts State with Dynamic Escalation
  const [alertsAcknowledgeState, setAlertsAcknowledgeState] = useState<
    Record<string, { isAck: boolean; ackTime?: string; ackBy?: string }>
  >({});

  const alerts: Alert[] = useMemo(() => {
    return INITIAL_ALERTS.map((baseAlert) => {
      const ackInfo = alertsAcknowledgeState[baseAlert.id];
      let severity = baseAlert.severity;
      let desc = baseAlert.description;

      if (baseAlert.id === "alert-001") {
        if (simulationState.riverGaugeLevel === "critical") {
          severity = "critical";
          desc = "River gauge at Neamatighat crossed Highest Flood Level (87.42m vs HFL 87.37m). Rate of rise 4cm/hr. Extreme inundation threat for southern lowlands.";
        } else if (simulationState.riverGaugeLevel === "above_danger") {
          severity = "high";
          desc = "River gauge at Neamatighat crossed Danger Line (87.10m). Water spreading into low embankments.";
        } else if (simulationState.riverGaugeLevel === "near_danger") {
          severity = "moderate";
          desc = "Brahmaputra water level near warning line (86.20m). Steady discharge observed.";
        } else {
          severity = "low";
          desc = "Brahmaputra flowing comfortably within natural banks (84.80m).";
        }
      } else if (baseAlert.id === "alert-003") {
        if (simulationState.rainfallIntensity === "extreme") {
          severity = "critical";
          desc = "IMD Doppler radar indicates cloudburst clusters (>280mm in 24h) stationary over Upper Assam. Severe flash runoff active.";
        } else if (simulationState.rainfallIntensity === "heavy") {
          severity = "high";
          desc = "Radar echoes indicate 180-240mm heavy-to-extreme rainfall cloud clusters stationary over Upper Assam over next 12-24 hours.";
        } else {
          severity = "moderate";
          desc = "Scattered moderate showers recorded (45mm). River catchments coping normally.";
        }
      }

      return {
        ...baseAlert,
        severity,
        description: desc,
        status: ackInfo?.isAck ? "acknowledged" : "active",
        acknowledgedAt: ackInfo?.ackTime,
        acknowledgedBy: ackInfo?.ackBy,
      };
    });
  }, [simulationState, alertsAcknowledgeState]);

  // Phase 10 Situation Reports State
  const [reportHistory, setReportHistory] = useState<SituationReport[]>([]);
  const [currentReport, setCurrentReport] = useState<SituationReport | null>(null);
  const [reportCounter, setReportCounter] = useState<number>(1);

  // Initialize initial report snapshot
  useEffect(() => {
    if (!currentReport && impactScores.length > 0) {
      const initialRep = buildSituationReport(
        simulationState,
        simulationResult,
        impactScores,
        optimizationResult,
        routingResult,
        currentResponsePlan,
        responsePlanHistory,
        alerts,
        1
      );
      setCurrentReport(initialRep);
      setReportHistory([initialRep]);
      setReportCounter(2);
    }
  }, [impactScores, simulationResult, optimizationResult, routingResult, currentResponsePlan, responsePlanHistory, alerts, simulationState]);

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (toast: Omit<ToastNotification, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastNotification = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 4000;
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateSimulationParam = (
    param: keyof Omit<SimulationState, "lastUpdatedTimestamp">,
    value: any
  ) => {
    setSimulationState((prev) => ({
      ...prev,
      [param]: value,
      lastUpdatedTimestamp: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    }));
  };

  const applyScenarioPreset = (scenario: ScenarioPreset) => {
    let rainfall: RainfallIntensity = "heavy";
    let river: RiverGaugeLevel = "critical";
    let horizon: ForecastHorizon = "+24h";

    if (scenario === "normal_monsoon") {
      rainfall = "normal";
      river = "below_danger";
      horizon = "+6h";
    } else if (scenario === "extreme_rainfall") {
      rainfall = "extreme";
      river = "critical";
      horizon = "+48h";
    } else if (scenario === "majuli_breach_scenario") {
      rainfall = "heavy";
      river = "critical";
      horizon = "+24h";
    } else if (scenario === "barak_flash_flood") {
      rainfall = "extreme";
      river = "above_danger";
      horizon = "+12h";
    }

    setSimulationState({
      isSimulationMode: true,
      rainfallIntensity: rainfall,
      riverGaugeLevel: river,
      forecastHorizon: horizon,
      scenarioPreset: scenario,
      lastUpdatedTimestamp: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    });

    showToast({
      title: "Scenario Preset Applied",
      message: `Scenario '${scenario.replace(/_/g, " ")}' loaded into simulation engine.`,
      type: "info",
    });
  };

  const runSimulationBatch = async (params: Partial<SimulationState>) => {
    setIsSimulating(true);
    await new Promise((r) => setTimeout(r, 650));

    setSimulationState((prev) => ({
      ...prev,
      ...params,
      lastUpdatedTimestamp: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    }));

    setIsSimulating(false);

    showToast({
      title: "Simulation Engine Executed",
      message: "Hydro-GIS telemetry, alerts, impact scores, and evacuation routes updated.",
      type: "success",
    });
  };

  const resetToBaseline = () => {
    setSimulationState(BASELINE_SIMULATION_STATE);
    setIsOptimizedMode(true);
    setManualRoadOverrides({});
    setAlertsAcknowledgeState({});
    setSelectedOriginId("majuli");
    showToast({
      title: "Simulation Reset",
      message: "Restored baseline Assam monsoon flood situation and official alert feed.",
      type: "info",
    });
  };

  const toggleRoadOverride = (roadId: string) => {
    setManualRoadOverrides((prev) => {
      const current = prev[roadId];
      const next = current === "flooded" ? "open" : "flooded";
      return {
        ...prev,
        [roadId]: next,
      };
    });

    showToast({
      title: "Road Access Toggled",
      message: "Road network graph recalculated. Dynamic routes updated.",
      type: "warning",
    });
  };

  const resetRoadOverrides = () => {
    setManualRoadOverrides({});
    showToast({
      title: "Road Overrides Reset",
      message: "Restored telemetry-derived road network status.",
      type: "info",
    });
  };

  const triggerOptimization = async () => {
    setIsOptimizing(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsOptimizedMode(true);
    setIsOptimizing(false);

    showToast({
      title: "Resource Optimization Complete",
      message: `Reallocated scarce assets to top priority hotspots (+${optimizationResult.metrics.optimizationGainPercent}% coverage gain).`,
      type: "success",
    });
  };

  const resetOptimizationMode = () => {
    setIsOptimizedMode(false);
    showToast({
      title: "Switched to Manual Baseline",
      message: "Displaying unoptimized conventional resource deployment.",
      type: "info",
    });
  };

  const toggleRouteStatus = (routeId: string) => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id === routeId) {
          const nextStatus = r.status === "open" ? "flooded" : "open";
          return {
            ...r,
            status: nextStatus,
            isRecommended: nextStatus === "open",
            inundationDepthM: nextStatus === "flooded" ? 1.4 : 0.1,
          };
        }
        return r;
      })
    );
  };

  const acknowledgeAlert = (
    alertId: string,
    commanderName: string = "Gaurav Bansal (Incident Commander)"
  ) => {
    const nowStr = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    setAlertsAcknowledgeState((prev) => ({
      ...prev,
      [alertId]: {
        isAck: true,
        ackTime: nowStr,
        ackBy: commanderName,
      },
    }));

    showToast({
      title: "Official Alert Acknowledged",
      message: `Warning status updated to Acknowledged by ${commanderName}.`,
      type: "info",
    });
  };

  const unacknowledgeAlert = (alertId: string) => {
    setAlertsAcknowledgeState((prev) => ({
      ...prev,
      [alertId]: {
        isAck: false,
      },
    }));

    showToast({
      title: "Alert Returned to Active",
      message: "Warning marked as unacknowledged.",
      type: "warning",
    });
  };

  const toggleAlertStatus = (alertId: string) => {
    const isCurrentlyAck = alertsAcknowledgeState[alertId]?.isAck;
    if (isCurrentlyAck) {
      unacknowledgeAlert(alertId);
    } else {
      acknowledgeAlert(alertId);
    }
  };

  // Phase 8 Plan Actions
  const regenerateResponsePlan = (targetDistrictId?: string) => {
    const targetId = targetDistrictId || selectedOriginId;
    const newPlan = buildRecommendedResponsePlan(
      targetId,
      impactScores,
      optimizationResult,
      routingResult,
      shelters,
      simulationState,
      planCounter
    );

    setCurrentResponsePlan(newPlan);
    setResponsePlanHistory((prev) => [newPlan, ...prev.filter((p) => p.id !== newPlan.id)]);
    setPlanCounter((c) => c + 1);

    showToast({
      title: "Response Plan Regenerated",
      message: `${newPlan.planCode} synthesized from live hydro-GIS telemetry.`,
      type: "info",
    });
  };

  const approveCurrentResponsePlan = (
    commanderName: string = "Gaurav Bansal (Incident Commander)",
    notes?: string
  ) => {
    if (!currentResponsePlan) return;

    const nowStr = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const approvedPlan: ResponsePlan = {
      ...currentResponsePlan,
      status: "approved",
      approvedAt: nowStr,
      approvedBy: commanderName,
      commanderNote: notes,
      isOutdated: false,
      auditLog: [
        ...currentResponsePlan.auditLog,
        {
          id: `audit-${Date.now()}-approved`,
          timestamp: nowStr,
          action: "Commander Approval Recorded",
          actor: commanderName,
          details: notes || "Signed off with zero operational objections.",
        },
      ],
    };

    setCurrentResponsePlan(approvedPlan);
    setResponsePlanHistory((prev) =>
      prev.map((p) => (p.id === approvedPlan.id ? approvedPlan : p))
    );

    showToast({
      title: "Response Plan Approved",
      message: `${approvedPlan.planCode} authorized by ${commanderName}. Approval recorded in audit ledger.`,
      type: "success",
    });
  };

  const rejectCurrentResponsePlan = (reason: string, notes?: string) => {
    if (!currentResponsePlan) return;

    const nowStr = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const rejectedPlan: ResponsePlan = {
      ...currentResponsePlan,
      status: "rejected",
      rejectedAt: nowStr,
      rejectionReason: reason,
      commanderNote: notes,
      isOutdated: false,
      auditLog: [
        ...currentResponsePlan.auditLog,
        {
          id: `audit-${Date.now()}-rejected`,
          timestamp: nowStr,
          action: `Response Plan Rejected (${reason})`,
          actor: "Incident Commander",
          details: notes || "Returned to decision support queue.",
        },
      ],
    };

    setCurrentResponsePlan(rejectedPlan);
    setResponsePlanHistory((prev) =>
      prev.map((p) => (p.id === rejectedPlan.id ? rejectedPlan : p))
    );

    showToast({
      title: "Response Plan Rejected",
      message: `${rejectedPlan.planCode} returned: ${reason}. No assets deployed.`,
      type: "warning",
    });
  };

  const modifyCurrentResponsePlan = (
    modifiedResources: ResponsePlan["recommendedResources"],
    notes: string
  ) => {
    if (!currentResponsePlan) return;

    const nowStr = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const modifiedPlan: ResponsePlan = {
      ...currentResponsePlan,
      status: "modified",
      recommendedResources: modifiedResources,
      commanderNote: notes,
      modifiedAt: nowStr,
      isOutdated: false,
      auditLog: [
        ...currentResponsePlan.auditLog,
        {
          id: `audit-${Date.now()}-modified`,
          timestamp: nowStr,
          action: "Plan Parameters Modified by Commander",
          actor: "Incident Commander",
          details: notes,
        },
      ],
    };

    setCurrentResponsePlan(modifiedPlan);
    setResponsePlanHistory((prev) =>
      prev.map((p) => (p.id === modifiedPlan.id ? modifiedPlan : p))
    );

    showToast({
      title: "Plan Modified",
      message: `${modifiedPlan.planCode} updated. Awaiting formal commander approval.`,
      type: "info",
    });
  };

  const selectHistoricalPlan = (planId: string) => {
    const historical = responsePlanHistory.find((p) => p.id === planId);
    if (historical) {
      setCurrentResponsePlan(historical);
      showToast({
        title: "Historical Plan Loaded",
        message: `Viewing ${historical.planCode} (${historical.status.toUpperCase()}).`,
        type: "info",
      });
    }
  };

  // Phase 10 Situation Report Actions
  const generateIncidentReport = () => {
    const newReport = buildSituationReport(
      simulationState,
      simulationResult,
      impactScores,
      optimizationResult,
      routingResult,
      currentResponsePlan,
      responsePlanHistory,
      alerts,
      reportCounter
    );

    setCurrentReport(newReport);
    setReportHistory((prev) => [newReport, ...prev.filter((r) => r.id !== newReport.id)]);
    setReportCounter((c) => c + 1);

    showToast({
      title: "Incident Report Generated",
      message: `${newReport.reportCode} (${newReport.reportSessionId}) archived in operational dossier.`,
      type: "success",
    });
  };

  const selectHistoricalReport = (reportId: string) => {
    const historical = reportHistory.find((r) => r.id === reportId);
    if (historical) {
      setCurrentReport(historical);
      showToast({
        title: "Historical Dossier Loaded",
        message: `Viewing ${historical.reportCode} (${historical.generatedAt}).`,
        type: "info",
      });
    }
  };

  // Phase 11 Guided Demo Actions
  const startDemo = () => {
    resetToBaseline();
    setIsDemoMode(true);
    setDemoStep(1);
    showToast({
      title: "Guided Tour Initialized",
      message: "Starting 5-minute end-to-end operational decision flow.",
      type: "info",
    });
  };

  const exitDemo = () => {
    setIsDemoMode(false);
    setDemoStep(1);
    resetToBaseline();
    showToast({
      title: "Demo Exited & Reset",
      message: "Baseline Assam monsoon flood state restored.",
      type: "info",
    });
  };

  const skipDemo = () => {
    setIsDemoMode(false);
    showToast({
      title: "Demo Dismissed",
      message: "Current application state preserved for free exploration.",
      type: "info",
    });
  };

  const value = useMemo(
    () => ({
      simulationState,
      setSimulationState,
      simulationResult,
      isSimulating,
      updateSimulationParam,
      applyScenarioPreset,
      runSimulationBatch,
      resetToBaseline,
      districts,
      selectedDistrictId,
      setSelectedDistrictId,
      incidents,
      selectedIncident,
      setSelectedIncident,
      impactScores,
      selectedRiskScore,
      setSelectedRiskScore,
      optimizationResult,
      isOptimizedMode,
      isOptimizing,
      triggerOptimization,
      resetOptimizationMode,
      routingResult,
      selectedOriginId,
      setSelectedOriginId,
      selectedShelterId,
      setSelectedShelterId,
      manualRoadOverrides,
      toggleRoadOverride,
      resetRoadOverrides,
      currentResponsePlan,
      responsePlanHistory,
      regenerateResponsePlan,
      approveCurrentResponsePlan,
      rejectCurrentResponsePlan,
      modifyCurrentResponsePlan,
      selectHistoricalPlan,
      gauges,
      rainfallStations,
      resources,
      allocations,
      shelters,
      routes,
      alerts,
      inundationPolygons,
      toggleRouteStatus,
      acknowledgeAlert,
      unacknowledgeAlert,
      toggleAlertStatus,
      currentReport,
      reportHistory,
      generateIncidentReport,
      selectHistoricalReport,
      isDemoMode,
      demoStep,
      startDemo,
      exitDemo,
      skipDemo,
      setDemoStep,
      toasts,
      showToast,
      dismissToast,
    }),
    [
      simulationState,
      simulationResult,
      isSimulating,
      districts,
      selectedDistrictId,
      incidents,
      selectedIncident,
      impactScores,
      selectedRiskScore,
      optimizationResult,
      isOptimizedMode,
      isOptimizing,
      routingResult,
      selectedOriginId,
      selectedShelterId,
      manualRoadOverrides,
      currentResponsePlan,
      responsePlanHistory,
      gauges,
      rainfallStations,
      resources,
      allocations,
      shelters,
      routes,
      alerts,
      inundationPolygons,
      currentReport,
      reportHistory,
      isDemoMode,
      demoStep,
      toasts,
    ]
  );

  return <AegisFlowContext.Provider value={value}>{children}</AegisFlowContext.Provider>;
}

export function useAegisFlow() {
  const context = useContext(AegisFlowContext);
  if (!context) {
    throw new Error("useAegisFlow must be used within an AegisFlowProvider");
  }
  return context;
}
