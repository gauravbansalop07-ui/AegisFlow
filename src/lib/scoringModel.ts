import {
  District,
  DistrictHazardResult,
  RiskScore,
  SeverityLevel,
} from "@/types";

export const RISK_WEIGHTS = {
  exposure: 0.4,
  vulnerability: 0.35,
  infrastructure: 0.25,
} as const;

// Infrastructure baseline criticality data for Assam districts
const DISTRICT_INFRA_DATA: Record<
  string,
  {
    bridgeFragility: number; // 0 - 100
    hospitalDependency: number; // 0 - 100
    evacuationCorridorBottleneck: number; // 0 - 100
  }
> = {
  majuli: {
    bridgeFragility: 94, // No all-weather bridge connectivity; boat ferry dependent
    hospitalDependency: 88, // Only 3 CHCs for entire island
    evacuationCorridorBottleneck: 92, // Single elevated embankment bund
  },
  lakhimpur: {
    bridgeFragility: 82,
    hospitalDependency: 74,
    evacuationCorridorBottleneck: 78,
  },
  dhemaji: {
    bridgeFragility: 86,
    hospitalDependency: 80,
    evacuationCorridorBottleneck: 84,
  },
  dibrugarh: {
    bridgeFragility: 65,
    hospitalDependency: 55,
    evacuationCorridorBottleneck: 62,
  },
  barpeta: {
    bridgeFragility: 76,
    hospitalDependency: 68,
    evacuationCorridorBottleneck: 72,
  },
  cachar: {
    bridgeFragility: 68,
    hospitalDependency: 62,
    evacuationCorridorBottleneck: 65,
  },
  jorhat: {
    bridgeFragility: 48,
    hospitalDependency: 42,
    evacuationCorridorBottleneck: 45,
  },
  nagaon: {
    bridgeFragility: 52,
    hospitalDependency: 46,
    evacuationCorridorBottleneck: 50,
  },
  kamrup_metro: {
    bridgeFragility: 25, // Multiple bridges, super-specialty hospitals, elevated highways
    hospitalDependency: 20,
    evacuationCorridorBottleneck: 30,
  },
};

/**
 * Calculates normalized demographic vulnerability score (0 - 100)
 */
export function calculateDemographicVulnerability(district: District): number {
  // Weighted combination of kutcha housing ratio, elderly ratio, and baseline vulnerability
  const kutchaFactor = district.kutchaHousingRatio; // 0 - 100
  const elderlyFactor = Math.min(100, district.elderlyRatio * 5.8); // normalize 15% -> ~87
  const baselineFactor = district.vulnerabilityIndex;

  const score = Math.round(
    kutchaFactor * 0.45 + elderlyFactor * 0.25 + baselineFactor * 0.3
  );

  return Math.min(100, Math.max(15, score));
}

/**
 * Calculates normalized population exposure score (0 - 100)
 */
export function calculatePopulationExposureScore(
  district: District,
  exposedHeadcount: number
): number {
  // Density & relative exposure index
  const density = district.population / district.areaSqKm;
  const relativeExposedRatio = (exposedHeadcount / district.population) * 100;

  const score = Math.round(relativeExposedRatio * 3.8 + (density / 800) * 25);
  return Math.min(100, Math.max(12, score));
}

/**
 * Calculates normalized infrastructure criticality score (0 - 100)
 */
export function calculateInfrastructureCriticality(district: District): number {
  const infra = DISTRICT_INFRA_DATA[district.id] || {
    bridgeFragility: 60,
    hospitalDependency: 60,
    evacuationCorridorBottleneck: 60,
  };

  const score = Math.round(
    infra.bridgeFragility * 0.4 +
      infra.hospitalDependency * 0.35 +
      infra.evacuationCorridorBottleneck * 0.25
  );

  return Math.min(100, Math.max(10, score));
}

/**
 * Classifies numerical Impact Score into official EOC Priority Tier
 */
export function classifyImpactScore(score: number): SeverityLevel {
  if (score >= 81) return "critical";
  if (score >= 61) return "high";
  if (score >= 41) return "moderate";
  if (score >= 21) return "low";
  return "safe";
}

/**
 * Generates deterministic explainability narrative based on mathematical score factors
 */
export function generateRiskExplanation(
  locationName: string,
  hazardRisk: number,
  exposureScore: number,
  vulnScore: number,
  infraScore: number,
  impactScore: number,
  district: District
): RiskScore["explanation"] {
  let primaryDriver = "";
  if (hazardRisk >= 80 && vulnScore >= 80) {
    primaryDriver = `Compound hazard surge (${hazardRisk}/100) and acute demographic fragility (${vulnScore}/100)`;
  } else if (vulnScore > hazardRisk) {
    primaryDriver = `High structural & demographic vulnerability (${vulnScore}/100) outstripping baseline flood gauge`;
  } else if (infraScore >= 75) {
    primaryDriver = `Critical infrastructure bottlenecks & bridge cutoff risk (${infraScore}/100)`;
  } else {
    primaryDriver = `Hydrological flood spread across ${district.primaryRiver} corridor`;
  }

  const factorBreakdown = `Hazard: ${hazardRisk}/100 • Exposure: ${exposureScore}/100 (40% wt) • Vulnerability: ${vulnScore}/100 (35% wt, ${district.kutchaHousingRatio}% kutcha dwellings) • Infrastructure: ${infraScore}/100 (25% wt).`;

  let actionJustification = "";
  if (impactScore >= 81) {
    actionJustification = `Pre-emptive boat staging and priority evacuation of vulnerable sectors required immediately. High kutcha density indicates structural collapse risk before flood peak.`;
  } else if (impactScore >= 61) {
    actionJustification = `Pre-position rescue teams and dry rations at forward depots. Alert health centres for emergency medical staging.`;
  } else if (impactScore >= 41) {
    actionJustification = `Maintain active radar surveillance and verify high-ground shelter readiness.`;
  } else {
    actionJustification = `Standard telemetry monitoring. No immediate resource mobilization needed.`;
  }

  const summary = `Impact Score of ${impactScore}/100 generated by ${primaryDriver}. Prioritized based on human vulnerability and infrastructure risk rather than land area alone.`;

  return {
    summary,
    primaryDriver,
    factorBreakdown,
    actionJustification,
  };
}

/**
 * Returns deterministic recommended operational command action
 */
export function getRecommendedAction(
  priority: SeverityLevel,
  locationName: string
): string {
  switch (priority) {
    case "critical":
      return `Deploy rescue boats & initiate pre-emptive evacuation for vulnerable sectors`;
    case "high":
      return `Pre-position SDRF rescue squads & stage medical kits at designated shelters`;
    case "moderate":
      return `Verify high-ground relief camp readiness & monitor river embankments`;
    case "low":
      return `Continue routine hydrological surveillance and keep sandbag reserves ready`;
    case "safe":
    default:
      return `Maintain baseline monitoring; infrastructure operating normally`;
  }
}

/**
 * Main Pure Function: Computes Impact Risk Scores for all districts
 */
export function calculateAllImpactScores(
  districts: District[],
  districtHazards: DistrictHazardResult[]
): RiskScore[] {
  const results: RiskScore[] = districts.map((district) => {
    // 1. Get Hazard Risk from Phase 3 simulation
    const hazardObj = districtHazards.find((h) => h.districtId === district.id);
    const hazardRisk = hazardObj ? hazardObj.hazardScore : 45;
    const exposedHeadcount = hazardObj
      ? hazardObj.estimatedPopulationExposed
      : Math.round(district.population * 0.15);

    // 2. Calculate Normalized Factor Scores (0 - 100)
    const exposureScore = calculatePopulationExposureScore(
      district,
      exposedHeadcount
    );
    const vulnerabilityScore = calculateDemographicVulnerability(district);
    const infrastructureCriticality = calculateInfrastructureCriticality(
      district
    );

    // 3. Calculate Composite Impact Factor (0 - 100)
    const compositeImpactFactor = Math.min(
      100,
      Math.max(
        10,
        Math.round(
          exposureScore * RISK_WEIGHTS.exposure +
            vulnerabilityScore * RISK_WEIGHTS.vulnerability +
            infrastructureCriticality * RISK_WEIGHTS.infrastructure
        )
      )
    );

    // 4. Calculate Final Normalized Impact Score (0 - 100)
    // Formula: Impact Score = Hazard Risk * (Composite Factor / 100)
    const rawImpactScore = (hazardRisk * compositeImpactFactor) / 100;
    const impactScore = Math.min(
      100,
      Math.max(10, Math.round(rawImpactScore))
    );

    // 5. Classify Priority
    const priorityLevel = classifyImpactScore(impactScore);

    // 6. Generate Explanation & Action
    const explanation = generateRiskExplanation(
      district.name,
      hazardRisk,
      exposureScore,
      vulnerabilityScore,
      infrastructureCriticality,
      impactScore,
      district
    );

    const recommendedAction = getRecommendedAction(
      priorityLevel,
      district.name
    );

    return {
      locationId: district.id,
      locationName: district.name,
      districtName: district.name,
      code: district.code,
      coordinates: district.coordinates,
      hazardRisk,
      populationExposed: exposedHeadcount,
      populationExposureScore: exposureScore,
      demographicVulnerability: vulnerabilityScore,
      infrastructureCriticality,
      compositeImpactFactor,
      impactScore,
      priorityLevel,
      rank: 1, // Will be set after sorting
      recommendedAction,
      explanation,
      metrics: {
        elderlyRatio: district.elderlyRatio,
        kutchaHousingRatio: district.kutchaHousingRatio,
        hospitalCount: district.hospitalCount,
        criticalBridges: district.criticalBridges,
        primaryRiver: district.primaryRiver,
        baselineElevationM: district.baselineElevationM,
      },
    };
  });

  // Sort by Impact Score descending and assign ranks
  results.sort((a, b) => b.impactScore - a.impactScore);

  return results.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}
