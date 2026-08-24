import {
  RoadSegment,
  RouteOption,
  RoutingEngineResult,
  SimulationState,
  Shelter,
  RiskScore,
} from "@/types";
import { BASELINE_ROAD_NETWORK } from "@/data/roads";

export interface CandidatePathDefinition {
  id: string;
  name: string;
  originDistrictId: string;
  destinationShelterId: string;
  segmentIds: string[];
  baseRationale: string;
}

// Pre-defined topological path topologies in Assam demonstration corridors
const CANDIDATE_PATHS: CandidatePathDefinition[] = [
  // --- Majuli Options (Origin: Kamalabari Lowland -> Garamur Shelter) ---
  {
    id: "route-majuli-arterial",
    name: "Route A: SH-22 Paved Arterial Corridor",
    originDistrictId: "majuli",
    destinationShelterId: "shelter-majuli-garamur",
    segmentIds: ["road-majuli-ferry", "road-majuli-arterial", "road-majuli-shelter-link"],
    baseRationale: "Primary paved state highway. Fastest transit time under dry to moderate weather.",
  },
  {
    id: "route-majuli-embankment",
    name: "Route B: Kamalabari North Elevated Bund",
    originDistrictId: "majuli",
    destinationShelterId: "shelter-majuli-garamur",
    segmentIds: ["road-majuli-ferry", "road-majuli-embankment", "road-majuli-shelter-link"],
    baseRationale: "High-elevation (92.5m) flood bund. Highly resilient against Subansiri overflow breach.",
  },
  {
    id: "route-majuli-bypass",
    name: "Route C: West Flood Spillway Bypass",
    originDistrictId: "majuli",
    destinationShelterId: "shelter-majuli-garamur",
    segmentIds: ["road-majuli-bypass", "road-majuli-west-link"],
    baseRationale: "Secondary rural bypass avoiding central town intersections.",
  },

  // --- Majuli Alternate Destination (Kamalabari Shelter) ---
  {
    id: "route-majuli-local-shelter",
    name: "Route Local: Kamalabari Direct College Access",
    originDistrictId: "majuli",
    destinationShelterId: "shelter-majuli-kamalabari",
    segmentIds: ["road-majuli-ferry"],
    baseRationale: "Short direct access to Kamalabari Cyclone Shelter.",
  },

  // --- Lakhimpur Options ---
  {
    id: "route-lakhimpur-nh",
    name: "Route A: NH-15 Highway Corridor",
    originDistrictId: "lakhimpur",
    destinationShelterId: "shelter-lakhimpur-panigaon",
    segmentIds: ["road-lakhimpur-nh15", "road-lakhimpur-feeder"],
    baseRationale: "Elevated National Highway corridor with reinforced concrete culverts.",
  },
  {
    id: "route-lakhimpur-rural",
    name: "Route B: Ranganadi Embankment Rural Trace",
    originDistrictId: "lakhimpur",
    destinationShelterId: "shelter-lakhimpur-panigaon",
    segmentIds: ["road-lakhimpur-rural"],
    baseRationale: "Unpaved bund trace along Ranganadi riverbank; vulnerable to seepage.",
  },

  // --- Dhemaji ---
  {
    id: "route-dhemaji-nh",
    name: "Route A: NH-515 Silapathar Elevated Highway",
    originDistrictId: "dhemaji",
    destinationShelterId: "shelter-dhemaji-silapathar",
    segmentIds: ["road-dhemaji-nh515"],
    baseRationale: "Heavy-load national highway leading directly to Silapathar Stadium Shelter.",
  },

  // --- Barpeta ---
  {
    id: "route-barpeta-nh",
    name: "Route A: NH-27 Beki Delta Highway",
    originDistrictId: "barpeta",
    destinationShelterId: "shelter-barpeta-bhawanipur",
    segmentIds: ["road-barpeta-nh27"],
    baseRationale: "Main arterial highway across Beki river basin.",
  },
];

/**
 * Computes live road segment status by combining simulation state and manual demo overrides
 */
export function computeLiveRoadNetwork(
  simulationState: SimulationState,
  manualOverrides: Record<string, "open" | "flooded"> = {}
): RoadSegment[] {
  return BASELINE_ROAD_NETWORK.map((road) => {
    // 1. Check if user explicitly toggled this road in demo
    if (manualOverrides[road.id] !== undefined) {
      const overrideStatus = manualOverrides[road.id];
      return {
        ...road,
        status: overrideStatus,
        inundationDepthM: overrideStatus === "flooded" ? 0.9 : 0.0,
        isManualOverride: true,
      };
    }

    // 2. Automatic derivation based on flood simulation
    let status: RoadSegment["status"] = "open";
    let depth = 0.0;

    if (simulationState.rainfallIntensity === "extreme" || simulationState.riverGaugeLevel === "critical") {
      if (road.floodThresholdIntensity === "normal") {
        status = "flooded";
        depth = 1.2;
      } else if (road.floodThresholdIntensity === "heavy") {
        status = "flooded";
        depth = 0.7;
      } else {
        status = "at_risk";
        depth = 0.2;
      }
    } else if (simulationState.rainfallIntensity === "heavy" || simulationState.riverGaugeLevel === "above_danger") {
      if (road.floodThresholdIntensity === "normal") {
        status = "flooded";
        depth = 0.8;
      } else if (road.floodThresholdIntensity === "heavy") {
        status = "at_risk";
        depth = 0.3;
      } else {
        status = "open";
      }
    }

    return {
      ...road,
      status,
      inundationDepthM: depth,
      isManualOverride: false,
    };
  });
}

/**
 * Pure Routing Engine: Computes recommended evacuation route and alternatives using cost functions
 */
export function calculateEvacuationRoutes(
  originDistrictId: string,
  destinationShelterId: string,
  simulationState: SimulationState,
  manualOverrides: Record<string, "open" | "flooded"> = {},
  shelters: Shelter[] = [],
  riskScores: RiskScore[] = []
): RoutingEngineResult {
  // 1. Compute current road network
  const roadNetwork = computeLiveRoadNetwork(simulationState, manualOverrides);
  const roadMap = new Map(roadNetwork.map((r) => [r.id, r]));

  // 2. Resolve origin and destination metadata
  const riskObj = riskScores.find((r) => r.locationId === originDistrictId);
  const originName = riskObj ? `${riskObj.locationName} (${riskObj.code})` : "Majuli Southern Lowlands";
  const evacueesCount = riskObj ? riskObj.populationExposed : 4200;

  const targetShelter = shelters.find((s) => s.id === destinationShelterId);
  const destinationName = targetShelter ? targetShelter.name : "Garamur Central High School Relief Camp";

  // 3. Find candidate paths for this origin + destination pair
  let matchingPaths = CANDIDATE_PATHS.filter(
    (p) => p.originDistrictId === originDistrictId && p.destinationShelterId === destinationShelterId
  );

  // Fallback: If no direct path matches, find any path starting from this district
  if (matchingPaths.length === 0) {
    matchingPaths = CANDIDATE_PATHS.filter((p) => p.originDistrictId === originDistrictId);
  }

  // If still empty (e.g. Nagaon or Dibrugarh), fallback to Majuli candidates
  if (matchingPaths.length === 0) {
    matchingPaths = CANDIDATE_PATHS.slice(0, 3);
  }

  // 4. Evaluate each candidate route option
  const evaluatedOptions: RouteOption[] = matchingPaths.map((candPath) => {
    const segments = candPath.segmentIds.map((id) => roadMap.get(id)).filter(Boolean) as RoadSegment[];

    const blockedSegments = segments.filter((s) => s.status === "flooded" || s.status === "blocked");
    const atRiskSegments = segments.filter((s) => s.status === "at_risk");

    const totalDistanceKm = Number(
      segments.reduce((sum, s) => sum + s.distanceKm, 0).toFixed(1)
    );

    // Travel time increases if segments are at risk
    let estimatedMinutes = segments.reduce((sum, s) => sum + s.baselineMinutes, 0);
    if (atRiskSegments.length > 0) {
      estimatedMinutes = Math.round(estimatedMinutes * (1 + atRiskSegments.length * 0.25));
    }

    // Safety Score: 100 base, -30 per at-risk segment, 0 if blocked
    let safetyScore = 100 - atRiskSegments.length * 28;
    if (blockedSegments.length > 0) {
      safetyScore = 0;
    }
    safetyScore = Math.max(0, Math.min(100, safetyScore));

    // Overall Score (Lower is better, infinity if blocked)
    const overallScore =
      blockedSegments.length > 0
        ? 999999
        : Number((estimatedMinutes * 0.6 + (100 - safetyScore) * 0.4).toFixed(1));

    // Collect all waypoints
    const waypoints: [number, number][] = [];
    segments.forEach((seg) => {
      seg.waypoints.forEach((pt) => waypoints.push(pt));
    });

    const status: RouteOption["status"] =
      blockedSegments.length > 0
        ? "no_safe_route"
        : atRiskSegments.length > 0
        ? "caution"
        : "safe";

    let selectionRationale = candPath.baseRationale;
    if (blockedSegments.length > 0) {
      selectionRationale = `BLOCKED: Road segment ${blockedSegments.map((b) => b.name).join(", ")} is inundated (${blockedSegments[0].inundationDepthM}m). Path impassable.`;
    } else if (atRiskSegments.length > 0) {
      selectionRationale = `CAUTION: Active water seepage on ${atRiskSegments.map((a) => a.name).join(", ")}. Reduced speed required.`;
    }

    return {
      id: candPath.id,
      name: candPath.name,
      isRecommended: false,
      totalDistanceKm,
      estimatedMinutes,
      safetyScore,
      overallScore,
      status,
      segments,
      waypoints,
      selectionRationale,
      bottlenecksCount: atRiskSegments.length,
      blockedSegmentsCount: blockedSegments.length,
    };
  });

  // 5. Sort options by overallScore (lowest score = safest/fastest viable path)
  evaluatedOptions.sort((a, b) => a.overallScore - b.overallScore);

  const viableRoutes = evaluatedOptions.filter((opt) => opt.status !== "no_safe_route");
  const recommendedRoute = viableRoutes.length > 0 ? viableRoutes[0] : null;

  if (recommendedRoute) {
    recommendedRoute.isRecommended = true;
  }

  // Determine overall status
  const overallRouteStatus: RoutingEngineResult["routeStatus"] =
    !recommendedRoute
      ? "no_safe_route"
      : recommendedRoute.status === "caution"
      ? "caution"
      : "safe";

  // 6. Generate Deterministic Explanation
  const allBlockedSegments = roadNetwork.filter((r) => r.status === "flooded" || r.status === "blocked");
  const blockedRoadNames = allBlockedSegments.map((b) => b.name);

  let whyChanged = "";
  if (allBlockedSegments.length > 0 && recommendedRoute) {
    const blockedNamesStr = allBlockedSegments.map((b) => b.name).join(" and ");
    whyChanged = `Route updated because ${blockedNamesStr} is currently marked FLOODED. AegisFlow removed the inundated segment(s) from the graph and redirected convoy traffic along ${recommendedRoute.name} (${recommendedRoute.totalDistanceKm} km, ${recommendedRoute.estimatedMinutes} mins).`;
  } else if (!recommendedRoute) {
    whyChanged = `CRITICAL: All viable road corridors to ${destinationName} are impassable due to extensive inundation (${blockedRoadNames.join(", ")}). Immediate amphibious boat transfer required.`;
  } else {
    whyChanged = `Primary arterial corridor clear. ${recommendedRoute.name} verified as fastest and highest-elevation path to ${destinationName}.`;
  }

  const summary = recommendedRoute
    ? `AegisFlow calculated ${viableRoutes.length} viable evacuation path(s). Recommended route delivers an estimated travel time of ${recommendedRoute.estimatedMinutes} minutes across ${recommendedRoute.totalDistanceKm} km with a safety score of ${recommendedRoute.safetyScore}/100.`
    : `NO SAFE ROAD ROUTE AVAILABLE. All overland transit options to ${destinationName} are submerged.`;

  const safetyAdvice = recommendedRoute
    ? recommendedRoute.status === "caution"
      ? "High-clearance rescue trucks advised. Monitor embankment stability in real-time."
      : "Standard vehicular evacuation permitted. Embankments clear of flood waters."
    : "Activate amphibious rescue boat shuttles immediately.";

  return {
    originId: originDistrictId,
    originName,
    destinationShelterId,
    destinationName,
    recommendedRoute,
    alternativeRoutes: evaluatedOptions.slice(0, 3),
    allSegments: roadNetwork,
    routeStatus: overallRouteStatus,
    explanation: {
      summary,
      whyChanged,
      blockedRoads: blockedRoadNames,
      safetyAdvice,
    },
    evacuationSummary: {
      originName,
      destinationName,
      evacueesCount,
      recommendedRouteName: recommendedRoute ? recommendedRoute.name : "NO SAFE ROUTE",
      travelTimeMinutes: recommendedRoute ? recommendedRoute.estimatedMinutes : 0,
      routeStatus:
        overallRouteStatus === "safe"
          ? "SAFE"
          : overallRouteStatus === "caution"
          ? "CAUTION"
          : "NO SAFE ROUTE",
      recalculatedTimestamp: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    },
  };
}
