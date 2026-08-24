import {
  SimulationState,
  SimulationResult,
  DistrictHazardResult,
  HazardGauge,
  InundationPolygon,
  SimulationTrajectoryPoint,
  SeverityLevel,
  District,
} from "@/types";
import { ASSAM_DISTRICTS } from "@/data/districts";
import { RIVER_GAUGES } from "@/data/hazards";

// Normalized deterministic simulation weights
const RAINFALL_FACTORS: Record<string, number> = {
  normal: 0.3,
  heavy: 0.65,
  extreme: 1.0,
};

const RIVER_FACTORS: Record<string, number> = {
  below_danger: 0.25,
  near_danger: 0.5,
  above_danger: 0.75,
  critical: 1.0,
};

const HORIZON_MULTIPLIERS: Record<string, number> = {
  "+6h": 0.9,
  "+12h": 1.0,
  "+24h": 1.1,
  "+48h": 1.25,
};

// District geographical hazard sensitivity multipliers (Terrain elevation & river proximity)
const DISTRICT_SENSITIVITIES: Record<string, number> = {
  majuli: 1.35, // Low-lying river island surrounded by Brahmaputra
  lakhimpur: 1.22, // Flash flood prone Subansiri / Ranganadi plain
  dhemaji: 1.18, // Foothill catchment runoff
  dibrugarh: 1.05, // Riverbank erosion zone
  barpeta: 1.02, // Lower Assam Manas/Beki delta
  cachar: 0.92, // Barak valley basin
  jorhat: 0.88, // Moderate elevation
  nagaon: 0.72, // Kopili floodplains
  kamrup_metro: 0.48, // Protected urban center with drainage
};

// Simulated Flood Extent Polygons across lowlands
const INUNDATION_ZONE_DEFINITIONS = [
  {
    id: "zone-majuli-lowlands",
    name: "Majuli Island Riverine Inundation Belt",
    coordinates: [
      [27.02, 94.15],
      [26.98, 94.35],
      [26.91, 94.32],
      [26.89, 94.18],
      [26.94, 94.08],
    ] as [number, number][],
    baseAreaSqKm: 340,
  },
  {
    id: "zone-lakhimpur-subansiri",
    name: "Subansiri-Ranganadi Flood Plain",
    coordinates: [
      [27.35, 94.05],
      [27.32, 94.22],
      [27.15, 94.18],
      [27.05, 94.02],
      [27.18, 93.95],
    ] as [number, number][],
    baseAreaSqKm: 420,
  },
  {
    id: "zone-dhemaji-catchment",
    name: "Dhemaji Jiabharali Inundation Plain",
    coordinates: [
      [27.62, 94.75],
      [27.55, 94.88],
      [27.42, 94.65],
      [27.45, 94.48],
      [27.58, 94.55],
    ] as [number, number][],
    baseAreaSqKm: 290,
  },
  {
    id: "zone-barpeta-beki",
    name: "Barpeta Beki Delta Lowlands",
    coordinates: [
      [26.52, 90.98],
      [26.48, 91.15],
      [26.28, 91.1],
      [26.22, 90.92],
      [26.38, 90.85],
    ] as [number, number][],
    baseAreaSqKm: 380,
  },
  {
    id: "zone-nagaon-kopili",
    name: "Kopili River Overflow Corridor",
    coordinates: [
      [26.35, 92.75],
      [26.28, 92.92],
      [26.12, 92.85],
      [26.15, 92.68],
      [26.25, 92.62],
    ] as [number, number][],
    baseAreaSqKm: 210,
  },
];

export function runFloodSimulation(
  params: SimulationState,
  baseDistricts: District[] = ASSAM_DISTRICTS,
  baseGauges: HazardGauge[] = RIVER_GAUGES
): SimulationResult {
  const rainWeight = RAINFALL_FACTORS[params.rainfallIntensity] ?? 0.65;
  const riverWeight = RIVER_FACTORS[params.riverGaugeLevel] ?? 0.75;
  const horizonMult = HORIZON_MULTIPLIERS[params.forecastHorizon] ?? 1.1;

  // Global composite hazard severity score (0 - 100)
  const globalSeverityScore = Math.min(
    100,
    Math.max(
      15,
      Math.round((rainWeight * 46 + riverWeight * 44 + 10) * horizonMult)
    )
  );

  // Global aggregate metrics
  const globalRainfallMm = Math.round(rainWeight * 190 * horizonMult);
  const globalRiverDeltaM = parseFloat(
    ((riverWeight * 2.2 - 0.2) * (horizonMult > 1 ? horizonMult * 0.95 : 1)).toFixed(2)
  );

  // 1. Calculate Per-District Hazard Severity
  const districtHazards: DistrictHazardResult[] = baseDistricts.map((district) => {
    const sensitivity = DISTRICT_SENSITIVITIES[district.id] ?? 0.9;
    const computedScore = Math.min(
      100,
      Math.max(
        10,
        Math.round(
          (rainWeight * 42 + riverWeight * 42 + 16) * sensitivity * horizonMult
        )
      )
    );

    let hazardLevel: SeverityLevel = "low";
    if (computedScore >= 80) hazardLevel = "critical";
    else if (computedScore >= 60) hazardLevel = "high";
    else if (computedScore >= 40) hazardLevel = "moderate";
    else if (computedScore >= 20) hazardLevel = "low";
    else hazardLevel = "safe";

    let exposureCategory: DistrictHazardResult["exposureCategory"] = "Low";
    if (computedScore >= 80) exposureCategory = "Very High";
    else if (computedScore >= 65) exposureCategory = "High";
    else if (computedScore >= 45) exposureCategory = "Moderate";
    else if (computedScore >= 25) exposureCategory = "Low";
    else exposureCategory = "Minimal";

    const trend =
      horizonMult >= 1.1 && riverWeight >= 0.65
        ? "rising"
        : rainWeight <= 0.3
        ? "falling"
        : "steady";

    const estimatedPopulationExposed = Math.round(
      district.population * (computedScore / 100) * 0.18
    );

    const districtRainfall = Math.round(
      globalRainfallMm * (sensitivity > 1 ? sensitivity * 0.95 : 0.85)
    );

    const riverDelta = parseFloat((globalRiverDeltaM * sensitivity * 0.9).toFixed(2));

    return {
      districtId: district.id,
      districtName: district.name,
      code: district.code,
      coordinates: district.coordinates,
      hazardScore: computedScore,
      hazardLevel,
      trend,
      exposureCategory,
      estimatedPopulationExposed,
      rainfall24hMm: districtRainfall,
      riverLevelDeltaM: riverDelta,
      primaryRiver: district.primaryRiver,
      isCriticalHotspot: computedScore >= 75,
    };
  });

  // Sort district hazards by score descending
  districtHazards.sort((a, b) => b.hazardScore - a.hazardScore);

  // 2. Simulate River Gauges based on river level state & rainfall
  const simulatedGauges: HazardGauge[] = baseGauges.map((g) => {
    const sensitivity = DISTRICT_SENSITIVITIES[g.districtId] ?? 1.0;
    const levelDelta = globalRiverDeltaM * sensitivity;
    const currentLevelM = parseFloat((g.dangerLevelM + levelDelta).toFixed(2));

    let status: HazardGauge["status"] = "near_danger";
    if (currentLevelM > g.highestFloodLevelM || levelDelta >= 1.2) {
      status = "critical";
    } else if (currentLevelM >= g.dangerLevelM) {
      status = "above_danger";
    } else if (currentLevelM >= g.warningLevelM) {
      status = "near_danger";
    } else {
      status = "below_danger";
    }

    const dischargeMultiplier = (rainWeight * 0.5 + riverWeight * 0.5) * horizonMult;
    const dischargeCusecs = Math.round(g.dischargeCusecs * dischargeMultiplier);

    const trend =
      riverWeight >= 0.75
        ? "rising"
        : riverWeight <= 0.35
        ? "falling"
        : "steady";

    return {
      ...g,
      currentLevelM,
      status,
      trend,
      dischargeCusecs,
    };
  });

  // 3. Dynamic Inundation Polygons
  const inundationPolygons: InundationPolygon[] = INUNDATION_ZONE_DEFINITIONS.map(
    (zone) => {
      let severity: SeverityLevel = "low";
      if (globalSeverityScore >= 78) severity = "critical";
      else if (globalSeverityScore >= 58) severity = "high";
      else if (globalSeverityScore >= 38) severity = "moderate";
      else severity = "safe";

      const inundationDepthM = parseFloat(
        ((globalSeverityScore / 100) * 2.8).toFixed(1)
      );

      const waterSurfaceAreaSqKm = Math.round(
        zone.baseAreaSqKm * (globalSeverityScore / 100) * 1.3
      );

      return {
        id: zone.id,
        name: zone.name,
        coordinates: zone.coordinates,
        severity,
        inundationDepthM,
        waterSurfaceAreaSqKm,
      };
    }
  );

  // 4. Macro Totals
  const totalPopulationAffected = districtHazards.reduce(
    (sum, d) => sum + d.estimatedPopulationExposed,
    0
  );

  const districtsAtRiskCount = districtHazards.filter(
    (d) => d.hazardLevel === "critical" || d.hazardLevel === "high" || d.hazardLevel === "moderate"
  ).length;

  const criticalDistrictsCount = districtHazards.filter(
    (d) => d.hazardLevel === "critical"
  ).length;

  // Casualties simulated based on severity
  const simulatedCasualties = Math.round(
    28 + (globalSeverityScore / 100) * 85 * (horizonMult > 1 ? 1.1 : 0.8)
  );

  const reliefCampsRequired = Math.round(
    580 + (globalSeverityScore / 100) * 920
  );

  const resourcesDeployedCount = Math.round(
    450 + (globalSeverityScore / 100) * 780
  );

  // 5. Build 5-point Simulated Hazard Trajectory (+0h to +48h)
  const trajectory: SimulationTrajectoryPoint[] = [
    {
      timeLabel: "NOW (T+0)",
      horizon: "+0h",
      hazardSeverity: Math.max(20, Math.round(globalSeverityScore * 0.78)),
      rainfallMm: Math.round(globalRainfallMm * 0.75),
      riverLevelM: parseFloat((globalRiverDeltaM * 0.7).toFixed(1)),
      riskCategory: "moderate",
    },
    {
      timeLabel: "T+6 Hours",
      horizon: "+6h",
      hazardSeverity: Math.max(25, Math.round(globalSeverityScore * 0.88)),
      rainfallMm: Math.round(globalRainfallMm * 0.88),
      riverLevelM: parseFloat((globalRiverDeltaM * 0.85).toFixed(1)),
      riskCategory: globalSeverityScore >= 70 ? "high" : "moderate",
    },
    {
      timeLabel: "T+12 Hours",
      horizon: "+12h",
      hazardSeverity: Math.max(30, Math.round(globalSeverityScore * 0.96)),
      rainfallMm: Math.round(globalRainfallMm * 0.98),
      riverLevelM: parseFloat((globalRiverDeltaM * 0.98).toFixed(1)),
      riskCategory: globalSeverityScore >= 75 ? "high" : "moderate",
    },
    {
      timeLabel: "T+24 Hours",
      horizon: "+24h",
      hazardSeverity: Math.min(100, Math.round(globalSeverityScore * 1.06)),
      rainfallMm: Math.round(globalRainfallMm * 1.1),
      riverLevelM: parseFloat((globalRiverDeltaM * 1.12).toFixed(1)),
      riskCategory: globalSeverityScore >= 70 ? "critical" : "high",
    },
    {
      timeLabel: "T+48 Hours",
      horizon: "+48h",
      hazardSeverity: Math.min(100, Math.round(globalSeverityScore * 1.18)),
      rainfallMm: Math.round(globalRainfallMm * 1.25),
      riverLevelM: parseFloat((globalRiverDeltaM * 1.28).toFixed(1)),
      riskCategory: globalSeverityScore >= 60 ? "critical" : "high",
    },
  ];

  return {
    parameters: params,
    globalSeverityScore,
    globalRainfallMm,
    globalRiverDeltaM,
    totalPopulationAffected,
    districtsAtRiskCount,
    criticalDistrictsCount,
    simulatedCasualties,
    reliefCampsRequired,
    resourcesDeployedCount,
    districtHazards,
    gauges: simulatedGauges,
    inundationPolygons,
    trajectory,
  };
}
