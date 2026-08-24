import {
  SituationReport,
  SimulationState,
  SimulationResult,
  RiskScore,
  OptimizationResult,
  RoutingEngineResult,
  ResponsePlan,
  Alert,
} from "@/types";

/**
 * Generates deterministic executive summary text based on real state values
 */
export function buildExecutiveSummary(
  simulationState: SimulationState,
  simulationResult: SimulationResult,
  topRisk: RiskScore,
  optimizationResult: OptimizationResult,
  routingResult: RoutingEngineResult,
  currentPlan: ResponsePlan | null,
  activeAlertsCount: number
): string {
  const rainText = simulationState.rainfallIntensity.toUpperCase();
  const riverText = simulationState.riverGaugeLevel.replace(/_/g, " ").toUpperCase();
  const topLoc = topRisk.locationName;
  const topScore = topRisk.impactScore;
  const optGain = optimizationResult.metrics.optimizationGainPercent;
  const isRouteSafe = routingResult.routeStatus === "safe";
  const planStatus = currentPlan ? currentPlan.status.toUpperCase().replace(/_/g, " ") : "NO ACTIVE PLAN";

  return `Current meteorological and hydrological telemetry indicates ${rainText} rainfall intensity with river gauges at ${riverText} thresholds across ${simulationResult.districtsAtRiskCount} affected Assam districts (${simulationResult.totalPopulationAffected.toLocaleString("en-IN")} estimated exposed population). Mathematical impact modeling prioritizes ${topLoc} (Score: ${topScore}/100, Priority: ${topRisk.priorityLevel.toUpperCase()}) due to extreme population exposure and vulnerable housing stock. The resource optimizer has staged scarce inventory toward priority sectors (+${optGain}% coverage gain). Overland evacuation routing via ${routingResult.recommendedRoute?.name || "designated corridor"} is currently rated ${routingResult.routeStatus.toUpperCase()}. Operational intelligence reports ${activeAlertsCount} active critical/high official bulletins, and Response Plan (${currentPlan?.planCode || "PLAN #001"}) status stands at ${planStatus}.`;
}

/**
 * Pure Situation Report Builder
 */
export function buildSituationReport(
  simulationState: SimulationState,
  simulationResult: SimulationResult,
  impactScores: RiskScore[],
  optimizationResult: OptimizationResult,
  routingResult: RoutingEngineResult,
  currentPlan: ResponsePlan | null,
  planHistory: ResponsePlan[],
  alerts: Alert[],
  reportIndex: number = 1
): SituationReport {
  const reportCode = `REPORT #${String(reportIndex).padStart(3, "0")}`;
  const reportSessionId = `AEGIS-ASSAM-2026-${String(reportIndex).padStart(3, "0")}`;
  const nowStr = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const topRisk = impactScores[0] || {
    locationId: "majuli",
    locationName: "Majuli",
    districtName: "Majuli",
    code: "MJL",
    hazardRisk: 92,
    populationExposed: 42000,
    populationExposureScore: 78,
    demographicVulnerability: 91,
    infrastructureCriticality: 84,
    compositeImpactFactor: 85,
    impactScore: 88,
    priorityLevel: "critical" as const,
    rank: 1,
    recommendedAction: "Pre-emptive evacuation of vulnerable riverine sectors",
    explanation: {
      summary: "Prioritized due to severe embankment breach threat and isolated island geography.",
      primaryDriver: "Island isolation & Kutcha housing ratio",
      factorBreakdown: "",
      actionJustification: "",
    },
    metrics: { elderlyRatio: 16.4, kutchaHousingRatio: 78.2, hospitalCount: 3, criticalBridges: 2, primaryRiver: "Brahmaputra", baselineElevationM: 84.5 },
    coordinates: [26.95, 94.2],
  };

  const highestHazard = simulationResult.districtHazards.reduce(
    (prev, current) => (prev.hazardScore > current.hazardScore ? prev : current),
    simulationResult.districtHazards[0]
  );

  const activeAlerts = alerts.filter((a) => a.status === "active");
  const approvedPlansCount = planHistory.filter((p) => p.status === "approved").length;

  const executiveSummary = buildExecutiveSummary(
    simulationState,
    simulationResult,
    topRisk,
    optimizationResult,
    routingResult,
    currentPlan,
    activeAlerts.length
  );

  // Top 5 Priority Locations
  const topPriorityLocations = impactScores.slice(0, 5).map((r) => ({
    rank: r.rank,
    locationName: r.locationName,
    districtCode: r.code,
    impactScore: r.impactScore,
    priorityLevel: r.priorityLevel,
    populationExposed: r.populationExposed,
    recommendedAction: r.recommendedAction,
  }));

  // Resource Inventory Status Items
  const resourceItems = optimizationResult.shortfalls.map((s) => ({
    name: s.name,
    totalInventory: s.availableInventory + s.allocated,
    deployed: s.allocated,
    available: Math.max(0, s.availableInventory),
    shortfall: s.shortfall,
  }));

  // Evacuation Operations
  const evacOps = {
    originName: routingResult.originName,
    destinationShelterName: routingResult.destinationName,
    routeName: routingResult.recommendedRoute?.name || "NO ROUTE AVAILABLE",
    distanceKm: routingResult.recommendedRoute?.totalDistanceKm || 0,
    estimatedMinutes: routingResult.recommendedRoute?.estimatedMinutes || 0,
    safetyStatus: (routingResult.routeStatus === "safe"
      ? "SAFE"
      : routingResult.routeStatus === "caution"
      ? "CAUTION"
      : "NO SAFE ROUTE") as "SAFE" | "CAUTION" | "NO SAFE ROUTE",
    isPassable: !!routingResult.recommendedRoute && routingResult.routeStatus !== "no_safe_route",
  };

  // Alerts Summary
  const alertsSummary = {
    criticalCount: alerts.filter((a) => a.severity === "critical").length,
    highCount: alerts.filter((a) => a.severity === "high").length,
    moderateCount: alerts.filter((a) => a.severity === "moderate").length,
    advisoryCount: alerts.filter((a) => a.severity === "low" || a.severity === "safe").length,
    acknowledgedCount: alerts.filter((a) => a.status === "acknowledged").length,
    unacknowledgedCount: activeAlerts.length,
    recentAlerts: alerts.slice(0, 4).map((a) => ({
      source: a.source,
      severity: a.severity,
      locationName: a.locationName,
      title: a.title,
      status: a.status,
    })),
  };

  // Response Plan Audit
  const responsePlanAudit = planHistory.map((p) => ({
    planCode: p.planCode,
    targetLocationName: p.targetLocationName,
    impactScore: p.impactScore,
    status: p.status.toUpperCase().replace(/_/g, " "),
    createdAt: p.createdAt,
    decision:
      p.status === "approved"
        ? `Authorized by ${p.approvedBy || "Commander"}`
        : p.status === "rejected"
        ? `Rejected: ${p.rejectionReason || "Tactical Concern"}`
        : p.status === "modified"
        ? "Modified Parameters"
        : "Pending Authorization",
  }));

  // Decision Timeline Events
  const timelineEvents = [
    {
      time: simulationState.lastUpdatedTimestamp,
      event: `Telemetry synchronized (${simulationState.rainfallIntensity.toUpperCase()} rain, ${simulationState.riverGaugeLevel.replace(/_/g, " ").toUpperCase()} river).`,
      source: "CWC / IMD Telemetry Feed",
    },
    {
      time: nowStr,
      event: `Impact model identified ${topRisk.locationName} as State Priority #1 (Score: ${topRisk.impactScore}/100).`,
      source: "AegisFlow Risk Scoring Model",
    },
    {
      time: nowStr,
      event: `Resource allocation optimizer balanced inventory (+${optimizationResult.metrics.optimizationGainPercent}% coverage gain).`,
      source: "Logistics Optimization Engine",
    },
    {
      time: nowStr,
      event: `Access-aware routing evaluated ${routingResult.allSegments.length} road links; selected ${evacOps.routeName} (${evacOps.safetyStatus}).`,
      source: "Dynamic Evacuation Router",
    },
  ];

  if (currentPlan && currentPlan.status === "approved") {
    timelineEvents.push({
      time: currentPlan.approvedAt || nowStr,
      event: `${currentPlan.planCode} signed off by ${currentPlan.approvedBy || "Incident Commander"}.`,
      source: "Command Authorization Ledger",
    });
  }

  return {
    id: `report-${Date.now()}`,
    reportCode,
    reportSessionId,
    generatedAt: `${dateStr} • ${nowStr} IST`,
    simulationTimestamp: simulationState.lastUpdatedTimestamp,
    scenario: simulationState.scenarioPreset.replace(/_/g, " ").toUpperCase(),
    operationalStatus: "ACTIVE",
    executiveSummary,
    kpis: {
      populationAffected: simulationResult.totalPopulationAffected,
      districtsAtRiskCount: simulationResult.districtsAtRiskCount,
      criticalLocationsCount: simulationResult.criticalDistrictsCount,
      resourcesDeployedCount: simulationResult.resourcesDeployedCount,
      activeAlertsCount: activeAlerts.length,
      approvedPlansCount,
    },
    hazardSummary: {
      rainfallIntensity: simulationState.rainfallIntensity.toUpperCase(),
      riverGaugeLevel: simulationState.riverGaugeLevel.replace(/_/g, " ").toUpperCase(),
      forecastHorizon: simulationState.forecastHorizon,
      highestHazardDistrict: highestHazard ? highestHazard.districtName : "Majuli",
      highestHazardScore: highestHazard ? highestHazard.hazardScore : 92,
    },
    topPriorityLocations,
    highestPriorityBreakdown: {
      locationName: topRisk.locationName,
      hazardRisk: topRisk.hazardRisk,
      exposure: topRisk.populationExposureScore,
      vulnerability: topRisk.demographicVulnerability,
      infrastructure: topRisk.infrastructureCriticality,
      impactScore: topRisk.impactScore,
      whyPrioritized: topRisk.explanation.summary || "Severe island isolation, critical flood crest, and fragile kutcha dwelling density.",
    },
    resourceStatus: {
      summaryGainPercent: optimizationResult.metrics.optimizationGainPercent,
      items: resourceItems,
      criticalConstraints: optimizationResult.explanation.criticalConstraints || "Finite motorized boat reserves limit simultaneous deployment to secondary hotspots.",
    },
    evacuationOperations: evacOps,
    alertsSummary,
    responsePlanAudit,
    timelineEvents,
  };
}

/**
 * Helper to export report as clean Markdown text
 */
export function generateReportMarkdown(report: SituationReport): string {
  return `# AEGISFLOW OPERATIONAL SITUATION REPORT
**Report ID:** ${report.reportSessionId} | **Code:** ${report.reportCode}
**Generated:** ${report.generatedAt} | **Scenario:** ${report.scenario}
**Operational Status:** ${report.operationalStatus} (SIMULATION MODE - DEMO DATA)

---

## 1. EXECUTIVE SUMMARY
${report.executiveSummary}

---

## 2. SITUATION KPIs
- **Exposed Population:** ${report.kpis.populationAffected.toLocaleString("en-IN")}
- **Districts at Risk:** ${report.kpis.districtsAtRiskCount}
- **Critical Hotspots:** ${report.kpis.criticalLocationsCount}
- **Resources Deployed:** ${report.kpis.resourcesDeployedCount} Units
- **Active Official Alerts:** ${report.kpis.activeAlertsCount}
- **Commander-Approved Plans:** ${report.kpis.approvedPlansCount}

---

## 3. TOP PRIORITY HOTSPOTS
| Rank | Location | District | Impact Score | Priority | Exposed Pop | Recommended Action |
|---|---|---|---|---|---|---|
${report.topPriorityLocations
  .map(
    (l) =>
      `| #${l.rank} | ${l.locationName} | ${l.districtCode} | ${l.impactScore}/100 | ${l.priorityLevel.toUpperCase()} | ${l.populationExposed.toLocaleString("en-IN")} | ${l.recommendedAction} |`
  )
  .join("\n")}

### Priority #1 Factor Breakdown (${report.highestPriorityBreakdown.locationName})
- Hazard Risk: ${report.highestPriorityBreakdown.hazardRisk}/100
- Population Exposure: ${report.highestPriorityBreakdown.exposure}/100
- Demographic Vulnerability: ${report.highestPriorityBreakdown.vulnerability}/100
- Infrastructure Criticality: ${report.highestPriorityBreakdown.infrastructure}/100
- **Composite Impact Score:** ${report.highestPriorityBreakdown.impactScore}/100
- **Rationale:** ${report.highestPriorityBreakdown.whyPrioritized}

---

## 4. LOGISTICS & ASSET ALLOCATION
*Optimization Gain: +${report.resourceStatus.summaryGainPercent}% coverage efficiency over unoptimized baseline.*

| Asset Category | Total Inventory | Deployed | Available | Deficit Shortfall |
|---|---|---|---|---|
${report.resourceStatus.items
  .map((i) => `| ${i.name} | ${i.totalInventory} | ${i.deployed} | ${i.available} | ${i.shortfall} |`)
  .join("\n")}

**Bottleneck Constraints:** ${report.resourceStatus.criticalConstraints}

---

## 5. EVACUATION OPERATIONS
- **Evacuation Origin:** ${report.evacuationOperations.originName}
- **Designated Shelter:** ${report.evacuationOperations.destinationShelterName}
- **Recommended Route:** ${report.evacuationOperations.routeName} (${report.evacuationOperations.distanceKm} km, ~${report.evacuationOperations.estimatedMinutes} mins)
- **Safety Rating:** ${report.evacuationOperations.safetyStatus}

---

## 6. RESPONSE PLAN & DECISION AUDIT
| Plan Code | Target | Impact Score | Decision Status | Timestamp | Logged Action |
|---|---|---|---|---|---|
${report.responsePlanAudit
  .map((p) => `| ${p.planCode} | ${p.targetLocationName} | ${p.impactScore} | ${p.status} | ${p.createdAt} | ${p.decision} |`)
  .join("\n")}

---

## 7. DATA INTEGRITY & DISCLAIMER
- Hazard & Gauge Data: SIMULATED (CWC / IMD Baselines)
- Risk Scoring Model: DETERMINISTIC Impact Equation
- Resource Optimizer: DETERMINISTIC Priority Staging
- Evacuation Routing: SIMULATED Topological Graph
- Alerts Feed: SIMULATED Multi-Agency Official Feeds

*AegisFlow decision-support prototype. Output intended for human-in-the-loop disaster management evaluation.*
`;
}
