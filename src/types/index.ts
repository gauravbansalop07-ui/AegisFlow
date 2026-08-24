export type SeverityLevel = "safe" | "low" | "moderate" | "high" | "critical";

export type RainfallIntensity = "normal" | "heavy" | "extreme";
export type RiverGaugeLevel = "below_danger" | "near_danger" | "above_danger" | "critical";
export type ForecastHorizon = "+6h" | "+12h" | "+24h" | "+48h";
export type ScenarioPreset = "normal_monsoon" | "majuli_breach_scenario" | "extreme_rainfall" | "barak_flash_flood" | "statewide_deluge";

export interface District {
  id: string;
  name: string;
  code: string;
  coordinates: [number, number]; // [lat, lng]
  population: number;
  areaSqKm: number;
  vulnerabilityIndex: number; // 0 - 100 baseline
  elderlyRatio: number; // percentage
  kutchaHousingRatio: number; // percentage
  hospitalCount: number;
  criticalBridges: number;
  primaryRiver: string;
  baselineElevationM: number;
  currentRiskLevel?: SeverityLevel;
}

export interface Incident {
  id: string;
  title: string;
  locationName: string;
  districtId: string;
  districtName: string;
  severity: SeverityLevel;
  condition: string;
  actionRequired: string;
  timestamp: string;
  description: string;
  coordinates: [number, number];
  gaugeId?: string;
  rainfallStationId?: string;
  affectedPopulationEst?: number;
  availableResourcesSummary?: string;
}

export interface HazardGauge {
  id: string;
  riverName: string;
  stationName: string;
  districtId: string;
  coordinates: [number, number];
  currentLevelM: number;
  warningLevelM: number;
  dangerLevelM: number;
  highestFloodLevelM: number;
  status: RiverGaugeLevel;
  trend: "rising" | "steady" | "falling";
  dischargeCusecs: number;
}

export interface RainfallStation {
  id: string;
  stationName: string;
  districtId: string;
  coordinates: [number, number];
  rainfall24hMm: number;
  rainfallForecastMm: number;
  status: RainfallIntensity;
}

export interface ResourceItem {
  id: string;
  type: "boats" | "food_kits" | "medical_teams" | "rescue_teams" | "vehicles";
  name: string;
  totalInventory: number;
  currentlyDeployed: number;
  available: number;
  unit: string;
}

export interface LocationResourceAllocation {
  districtId: string;
  locationName: string;
  boats: number;
  foodKits: number;
  medicalTeams: number;
  rescueTeams: number;
  vehicles: number;
  sourceDepot?: string;
  estimatedTransitTimeMinutes?: number;
}

export interface LocationResourceDemand {
  districtId: string;
  locationName: string;
  districtName: string;
  impactScore: number;
  priorityLevel: SeverityLevel;
  populationExposed: number;
  demand: {
    boats: number;
    foodKits: number;
    medicalTeams: number;
    rescueTeams: number;
    vehicles: number;
  };
}

export interface LocationResourceAllocationDetailed {
  districtId: string;
  locationName: string;
  districtName: string;
  priorityLevel: SeverityLevel;
  impactScore: number;
  populationExposed: number;
  rank: number;
  manual: {
    boats: number;
    foodKits: number;
    medicalTeams: number;
    rescueTeams: number;
    vehicles: number;
  };
  recommended: {
    boats: number;
    foodKits: number;
    medicalTeams: number;
    rescueTeams: number;
    vehicles: number;
  };
  delta: {
    boats: number;
    foodKits: number;
    medicalTeams: number;
    rescueTeams: number;
    vehicles: number;
  };
  shortfall: {
    boats: number;
    foodKits: number;
    medicalTeams: number;
    rescueTeams: number;
    vehicles: number;
  };
  rationale: string;
}

export interface ResourceShortfallItem {
  type: "boats" | "food_kits" | "medical_teams" | "rescue_teams" | "vehicles";
  name: string;
  unit: string;
  totalRequired: number;
  availableInventory: number;
  allocated: number;
  shortfall: number;
}

export interface OptimizationResult {
  allocations: LocationResourceAllocationDetailed[];
  shortfalls: ResourceShortfallItem[];
  metrics: {
    manualPriorityCoverage: number;
    optimizedPriorityCoverage: number;
    optimizationGainPercent: number;
    totalInventoryAllocatedPercent: number;
    criticalShortfallCount: number;
  };
  explanation: {
    summary: string;
    keyShifts: string[];
    criticalConstraints: string;
  };
}

export interface Shelter {
  id: string;
  name: string;
  districtId: string;
  locationName: string;
  coordinates: [number, number];
  capacity: number;
  currentOccupancy: number;
  status: "active" | "standby" | "full";
  elevationCategory: "high_ground" | "elevated_embankment" | "standard";
  medicalSupportAvailable: boolean;
  powerBackupAvailable: boolean;
}

export type RoadStatus = "open" | "at_risk" | "flooded" | "blocked";

export interface RoadSegment {
  id: string;
  name: string;
  code: string;
  districtId: string;
  fromNodeId: string;
  toNodeId: string;
  fromName: string;
  toName: string;
  distanceKm: number;
  baselineMinutes: number;
  roadType: "NH" | "SH" | "Elevated Bund" | "Rural Highway" | "Island Embankment";
  waypoints: [number, number][];
  floodThresholdIntensity: "normal" | "heavy" | "extreme";
  elevationM: number;
  inundationDepthM: number;
  status: RoadStatus;
  isManualOverride?: boolean;
}

export interface RouteOption {
  id: string;
  name: string;
  isRecommended: boolean;
  totalDistanceKm: number;
  estimatedMinutes: number;
  safetyScore: number;
  overallScore: number;
  status: "safe" | "caution" | "no_safe_route";
  segments: RoadSegment[];
  waypoints: [number, number][];
  selectionRationale: string;
  bottlenecksCount: number;
  blockedSegmentsCount: number;
}

export interface RoutingEngineResult {
  originId: string;
  originName: string;
  destinationShelterId: string;
  destinationName: string;
  recommendedRoute: RouteOption | null;
  alternativeRoutes: RouteOption[];
  allSegments: RoadSegment[];
  routeStatus: "safe" | "caution" | "no_safe_route";
  explanation: {
    summary: string;
    whyChanged: string;
    blockedRoads: string[];
    safetyAdvice: string;
  };
  evacuationSummary: {
    originName: string;
    destinationName: string;
    evacueesCount: number;
    recommendedRouteName: string;
    travelTimeMinutes: number;
    routeStatus: "SAFE" | "CAUTION" | "NO SAFE ROUTE";
    recalculatedTimestamp: string;
  };
}

export interface EvacuationRoute {
  id: string;
  name: string;
  origin: string;
  originCoordinates: [number, number];
  destinationShelterId: string;
  destinationName: string;
  destinationCoordinates: [number, number];
  waypoints: [number, number][];
  distanceKm: number;
  baselineTimeMinutes: number;
  status: "open" | "flooded" | "caution";
  inundationDepthM: number;
  roadType: "NH" | "SH" | "Elevated Bund" | "Rural Bypass";
  isRecommended: boolean;
  selectionReason?: string;
}

export interface RiskScore {
  locationId: string;
  locationName: string;
  districtName: string;
  code: string;
  coordinates: [number, number];
  hazardRisk: number; // 0 - 100
  populationExposed: number;
  populationExposureScore: number;
  demographicVulnerability: number;
  infrastructureCriticality: number;
  compositeImpactFactor: number;
  impactScore: number;
  priorityLevel: SeverityLevel;
  rank: number;
  recommendedAction: string;
  explanation: {
    summary: string;
    primaryDriver: string;
    factorBreakdown: string;
    actionJustification: string;
  };
  metrics: {
    elderlyRatio: number;
    kutchaHousingRatio: number;
    hospitalCount: number;
    criticalBridges: number;
    primaryRiver: string;
    baselineElevationM: number;
  };
}

export type ResponsePlanStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "modified";

export interface ResponsePlanAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details?: string;
}

export interface ResponsePlan {
  id: string;
  planCode: string;
  createdAt: string;
  simulationTimestamp: string;
  targetLocationId: string;
  targetLocationName: string;
  districtName: string;
  districtCode: string;
  priority: SeverityLevel;
  impactScore: number;
  situationSummary: {
    hazardLevel: SeverityLevel;
    hazardRisk: number;
    exposureScore: number;
    vulnerabilityScore: number;
    infrastructureCriticality: number;
    primaryRiver: string;
    exposedPopulation: number;
  };
  recommendedActions: string[];
  recommendedResources: {
    boats: number;
    foodKits: number;
    medicalTeams: number;
    rescueTeams: number;
    vehicles: number;
  };
  evacuationRoute: {
    id: string;
    name: string;
    origin: string;
    destinationShelterId: string;
    destinationShelterName: string;
    distanceKm: number;
    estimatedMinutes: number;
    safetyScore: number;
    status: "safe" | "caution" | "no_safe_route";
    bottlenecksCount: number;
    isPassable: boolean;
  };
  destinationShelter: {
    id: string;
    name: string;
    locationName: string;
    capacity: number;
    currentOccupancy: number;
    availableBeds: number;
    status: "active" | "standby" | "full";
    elevationCategory: string;
    medicalSupport: boolean;
  };
  explanation: {
    summary: string;
    whyThisPlan: string;
    decisionTrace: {
      hazard: string;
      impact: string;
      priority: string;
      resources: string;
      route: string;
      commanderStatus: string;
    };
  };
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  status: ResponsePlanStatus;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  commanderNote?: string;
  modifiedAt?: string;
  auditLog: ResponsePlanAuditEntry[];
  isOutdated?: boolean;
}

export interface AlertTimelineEvent {
  time: string;
  event: string;
}

export interface Alert {
  id: string;
  title: string;
  severity: SeverityLevel;
  districtId: string;
  locationName: string;
  timestamp: string;
  source: "CWC Hydrological Warning" | "IMD Doppler Radar" | "ASDMA Operations" | "District Collectorate";
  description: string;
  recommendedAction: string;
  status: "active" | "acknowledged";
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  actionLink?: string;
  coordinates: [number, number];
  timeline?: AlertTimelineEvent[];
}

export interface SituationReport {
  id: string;
  reportCode: string;
  reportSessionId: string;
  generatedAt: string;
  simulationTimestamp: string;
  scenario: string;
  operationalStatus: "ACTIVE" | "STANDBY" | "CONCLUDED";
  executiveSummary: string;
  kpis: {
    populationAffected: number;
    districtsAtRiskCount: number;
    criticalLocationsCount: number;
    resourcesDeployedCount: number;
    activeAlertsCount: number;
    approvedPlansCount: number;
  };
  hazardSummary: {
    rainfallIntensity: string;
    riverGaugeLevel: string;
    forecastHorizon: string;
    highestHazardDistrict: string;
    highestHazardScore: number;
  };
  topPriorityLocations: {
    rank: number;
    locationName: string;
    districtCode: string;
    impactScore: number;
    priorityLevel: SeverityLevel;
    populationExposed: number;
    recommendedAction: string;
  }[];
  highestPriorityBreakdown: {
    locationName: string;
    hazardRisk: number;
    exposure: number;
    vulnerability: number;
    infrastructure: number;
    impactScore: number;
    whyPrioritized: string;
  };
  resourceStatus: {
    summaryGainPercent: number;
    items: {
      name: string;
      totalInventory: number;
      deployed: number;
      available: number;
      shortfall: number;
    }[];
    criticalConstraints: string;
  };
  evacuationOperations: {
    originName: string;
    destinationShelterName: string;
    routeName: string;
    distanceKm: number;
    estimatedMinutes: number;
    safetyStatus: "SAFE" | "CAUTION" | "NO SAFE ROUTE";
    isPassable: boolean;
  };
  alertsSummary: {
    criticalCount: number;
    highCount: number;
    moderateCount: number;
    advisoryCount: number;
    acknowledgedCount: number;
    unacknowledgedCount: number;
    recentAlerts: {
      source: string;
      severity: SeverityLevel;
      locationName: string;
      title: string;
      status: string;
    }[];
  };
  responsePlanAudit: {
    planCode: string;
    targetLocationName: string;
    impactScore: number;
    status: string;
    createdAt: string;
    decision: string;
  }[];
  timelineEvents: {
    time: string;
    event: string;
    source: string;
  }[];
}

export interface SimulationState {
  isSimulationMode: boolean;
  rainfallIntensity: RainfallIntensity;
  riverGaugeLevel: RiverGaugeLevel;
  forecastHorizon: ForecastHorizon;
  scenarioPreset: ScenarioPreset;
  lastUpdatedTimestamp: string;
}

export interface DistrictHazardResult {
  districtId: string;
  districtName: string;
  code: string;
  coordinates: [number, number];
  hazardScore: number;
  hazardLevel: SeverityLevel;
  trend: "rising" | "steady" | "falling";
  exposureCategory: "Very High" | "High" | "Moderate" | "Low" | "Minimal";
  estimatedPopulationExposed: number;
  rainfall24hMm: number;
  riverLevelDeltaM: number;
  primaryRiver: string;
  isCriticalHotspot: boolean;
}

export interface InundationPolygon {
  id: string;
  name: string;
  coordinates: [number, number][];
  severity: SeverityLevel;
  inundationDepthM: number;
  waterSurfaceAreaSqKm: number;
}

export interface SimulationTrajectoryPoint {
  timeLabel: string;
  horizon: string;
  hazardSeverity: number;
  rainfallMm: number;
  riverLevelM: number;
  riskCategory: SeverityLevel;
}

export interface SimulationResult {
  parameters: SimulationState;
  globalSeverityScore: number;
  globalRainfallMm: number;
  globalRiverDeltaM: number;
  totalPopulationAffected: number;
  districtsAtRiskCount: number;
  criticalDistrictsCount: number;
  simulatedCasualties: number;
  reliefCampsRequired: number;
  resourcesDeployedCount: number;
  districtHazards: DistrictHazardResult[];
  gauges: HazardGauge[];
  inundationPolygons: InundationPolygon[];
  trajectory: SimulationTrajectoryPoint[];
}
