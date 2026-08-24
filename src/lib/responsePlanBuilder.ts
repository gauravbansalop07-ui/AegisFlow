import {
  ResponsePlan,
  RiskScore,
  OptimizationResult,
  RoutingEngineResult,
  Shelter,
  SimulationState,
} from "@/types";

/**
 * Generates deterministic action directives based on priority and factor scores
 */
export function generateRecommendedActions(
  riskScore: RiskScore,
  resourceAlloc: { boats: number; foodKits: number; medicalTeams: number; rescueTeams: number; vehicles: number },
  shelterName: string
): string[] {
  const actions: string[] = [];

  if (riskScore.priorityLevel === "critical") {
    actions.push(
      `Initiate pre-emptive evacuation for ${riskScore.populationExposed.toLocaleString("en-IN")} residents in vulnerable kutcha housing sectors.`
    );
    actions.push(
      `Deploy ${resourceAlloc.boats} motorized rescue boats and ${resourceAlloc.rescueTeams} NDRF battalions to forward water staging points.`
    );
    actions.push(
      `Dispatch ${resourceAlloc.foodKits.toLocaleString("en-IN")} emergency dry ration kits and stage ${resourceAlloc.medicalTeams} mobile disaster medical teams at ${shelterName}.`
    );
    actions.push(
      `Secure elevated embankment bund corridor and maintain continuous radio telemetry with CWC hydro stations.`
    );
  } else if (riskScore.priorityLevel === "high") {
    actions.push(
      `Pre-position ${resourceAlloc.rescueTeams} SDRF rescue squads and ${resourceAlloc.boats} boats at forward depot.`
    );
    actions.push(
      `Stock ${shelterName} with ${resourceAlloc.foodKits.toLocaleString("en-IN")} ration kits and medical supplies.`
    );
    actions.push(
      `Issue public evacuation warnings across low-lying floodplains along ${riskScore.metrics.primaryRiver}.`
    );
    actions.push(
      `Inspect bridge piers and culverts along designated evacuation highway.`
    );
  } else {
    actions.push(
      `Maintain standard telemetry surveillance along ${riskScore.metrics.primaryRiver} corridor.`
    );
    actions.push(
      `Keep ${resourceAlloc.vehicles} all-terrain transport vehicles on standby at local municipal depot.`
    );
    actions.push(
      `Verify relief camp standby capacity at ${shelterName}.`
    );
  }

  return actions;
}

/**
 * Pure Response Plan Builder: Assembles complete ResponsePlan from multi-module pipeline
 */
export function buildRecommendedResponsePlan(
  targetDistrictId: string,
  impactScores: RiskScore[],
  optimizationResult: OptimizationResult,
  routingResult: RoutingEngineResult,
  shelters: Shelter[],
  simulationState: SimulationState,
  planNumber: number = 1
): ResponsePlan {
  // 1. Resolve Target District from Impact Scores
  const targetRisk =
    impactScores.find((r) => r.locationId === targetDistrictId) ||
    impactScores[0] || {
      locationId: "majuli",
      locationName: "Majuli",
      districtName: "Majuli",
      code: "MJL",
      hazardRisk: 88,
      populationExposed: 42000,
      populationExposureScore: 78,
      demographicVulnerability: 91,
      infrastructureCriticality: 84,
      compositeImpactFactor: 85,
      impactScore: 88,
      priorityLevel: "critical" as const,
      rank: 1,
      recommendedAction: "Deploy boats and evacuate",
      explanation: { summary: "", primaryDriver: "", factorBreakdown: "", actionJustification: "" },
      metrics: { elderlyRatio: 16.4, kutchaHousingRatio: 78.2, hospitalCount: 3, criticalBridges: 2, primaryRiver: "Brahmaputra", baselineElevationM: 84.5 },
      coordinates: [26.95, 94.2],
    };

  // 2. Resolve Resource Allocation
  const allocObj = optimizationResult.allocations.find(
    (a) => a.districtId === targetRisk.locationId
  );
  const recommendedResources = allocObj
    ? allocObj.recommended
    : { boats: 6, foodKits: 1600, medicalTeams: 2, rescueTeams: 4, vehicles: 4 };

  // 3. Resolve Destination Shelter
  const destShelter =
    shelters.find((s) => s.id === routingResult.destinationShelterId) ||
    shelters[0] || {
      id: "shelter-majuli-garamur",
      name: "Garamur Central High School Relief Camp",
      locationName: "Garamur",
      coordinates: [26.968, 94.221] as [number, number],
      capacity: 2500,
      currentOccupancy: 1850,
      status: "active" as const,
      elevationCategory: "high_ground" as const,
      medicalSupportAvailable: true,
      powerBackupAvailable: true,
    };

  const availableBeds = Math.max(0, destShelter.capacity - destShelter.currentOccupancy);

  // 4. Resolve Evacuation Route
  const routeOpt = routingResult.recommendedRoute;
  const isRoutePassable = !!routeOpt && routeOpt.status !== "no_safe_route";

  const evacuationRoute = {
    id: routeOpt ? routeOpt.id : "no-route",
    name: routeOpt ? routeOpt.name : "NO PASSABLE ROUTE",
    origin: routingResult.originName,
    destinationShelterId: destShelter.id,
    destinationShelterName: destShelter.name,
    distanceKm: routeOpt ? routeOpt.totalDistanceKm : 0,
    estimatedMinutes: routeOpt ? routeOpt.estimatedMinutes : 0,
    safetyScore: routeOpt ? routeOpt.safetyScore : 0,
    status: (routeOpt ? routeOpt.status : "no_safe_route") as "safe" | "caution" | "no_safe_route",
    bottlenecksCount: routeOpt ? routeOpt.bottlenecksCount : 0,
    isPassable: isRoutePassable,
  };

  // 5. Generate Recommended Actions
  const recommendedActions = generateRecommendedActions(
    targetRisk,
    recommendedResources,
    destShelter.name
  );

  // 6. Validate Plan Constraints
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRoutePassable) {
    errors.push(
      "Cannot approve plan: All designated overland road corridors to this shelter are submerged. Road access must be restored or amphibious boat shuttles mobilized."
    );
  }

  if (destShelter.status === "full" || availableBeds === 0) {
    errors.push(
      `Cannot approve plan: Selected shelter (${destShelter.name}) has exceeded maximum capacity (${destShelter.capacity} beds full). Select an alternate relief camp.`
    );
  }

  if (routeOpt && routeOpt.status === "caution") {
    warnings.push(
      "Caution: Route contains at-risk road segments subject to flash runoff. High-clearance rescue convoy required."
    );
  }

  if (availableBeds < targetRisk.populationExposed * 0.1) {
    warnings.push(
      `Capacity warning: Available shelter beds (${availableBeds}) may require secondary spillover staging.`
    );
  }

  const isValid = errors.length === 0;

  // 7. Decision Trace & Explainability
  const planCode = `PLAN #${String(planNumber).padStart(3, "0")}`;
  const nowStr = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const decisionTrace = {
    hazard: `Hydro-telemetry indicates ${targetRisk.metrics.primaryRiver} flood surge (${simulationState.rainfallIntensity.toUpperCase()} rain, ${simulationState.riverGaugeLevel.replace(/_/g, " ").toUpperCase()} river).`,
    impact: `Mathematical Impact Score computed at ${targetRisk.impactScore}/100 (Exposure: ${targetRisk.populationExposureScore}, Vulnerability: ${targetRisk.demographicVulnerability}, Infra: ${targetRisk.infrastructureCriticality}).`,
    priority: `Ranked #${targetRisk.rank} in State Priority Queue (${targetRisk.priorityLevel.toUpperCase()}).`,
    resources: `Optimizer allocated ${recommendedResources.boats} Boats, ${recommendedResources.foodKits.toLocaleString("en-IN")} Ration Kits, ${recommendedResources.rescueTeams} Rescue Teams under finite inventory constraints.`,
    route: isRoutePassable
      ? `Dynamic routing selected ${evacuationRoute.name} (${evacuationRoute.distanceKm} km, ${evacuationRoute.estimatedMinutes} mins, Safety: ${evacuationRoute.safetyScore}/100).`
      : `CRITICAL: No passable overland corridor.`,
    commanderStatus: "Awaiting explicit Incident Commander review and sign-off.",
  };

  const whyThisPlan = `${targetRisk.locationName} has been prioritized because it currently has an Impact Score of ${targetRisk.impactScore}/100, driven by critical flood hazard, ${targetRisk.metrics.kutchaHousingRatio}% kutcha dwelling exposure, and island isolation. AegisFlow recommends deploying ${recommendedResources.boats} boats and ${recommendedResources.rescueTeams} rescue battalions while routing evacuations toward ${destShelter.name} via ${evacuationRoute.name}.`;

  const summary = `Comprehensive response plan targeting ${targetRisk.locationName} (${targetRisk.priorityLevel.toUpperCase()} priority, Score: ${targetRisk.impactScore}/100). Mobilizes staged equipment and directs safe transit to ${destShelter.name}.`;

  return {
    id: `plan-${targetRisk.locationId}-${Date.now()}`,
    planCode,
    createdAt: nowStr,
    simulationTimestamp: simulationState.lastUpdatedTimestamp,
    targetLocationId: targetRisk.locationId,
    targetLocationName: targetRisk.locationName,
    districtName: targetRisk.districtName,
    districtCode: targetRisk.code,
    priority: targetRisk.priorityLevel,
    impactScore: targetRisk.impactScore,
    situationSummary: {
      hazardLevel: targetRisk.priorityLevel,
      hazardRisk: targetRisk.hazardRisk,
      exposureScore: targetRisk.populationExposureScore,
      vulnerabilityScore: targetRisk.demographicVulnerability,
      infrastructureCriticality: targetRisk.infrastructureCriticality,
      primaryRiver: targetRisk.metrics.primaryRiver,
      exposedPopulation: targetRisk.populationExposed,
    },
    recommendedActions,
    recommendedResources,
    evacuationRoute,
    destinationShelter: {
      id: destShelter.id,
      name: destShelter.name,
      locationName: destShelter.locationName,
      capacity: destShelter.capacity,
      currentOccupancy: destShelter.currentOccupancy,
      availableBeds,
      status: destShelter.status,
      elevationCategory: destShelter.elevationCategory,
      medicalSupport: destShelter.medicalSupportAvailable,
    },
    explanation: {
      summary,
      whyThisPlan,
      decisionTrace,
    },
    validation: {
      isValid,
      errors,
      warnings,
    },
    status: "pending_approval",
    auditLog: [
      {
        id: `audit-${Date.now()}-1`,
        timestamp: nowStr,
        action: "Response Plan Generated by Decision Intelligence Pipeline",
        actor: "AegisFlow Decision Engine",
        details: `Synthesized hazard state, impact score (${targetRisk.impactScore}), resource optimization, and dynamic route.`,
      },
    ],
    isOutdated: false,
  };
}
