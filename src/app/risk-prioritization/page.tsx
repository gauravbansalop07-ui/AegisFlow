"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LocationIntelligenceDrawer } from "@/components/response/LocationIntelligenceDrawer";
import {
  ShieldAlert,
  Search,
  ArrowUpDown,
  Filter,
  Users,
  Sparkles,
  ChevronRight,
  Info,
  Layers,
  ArrowRight,
  AlertTriangle,
  Compass,
} from "lucide-react";
import Link from "next/link";
import { useAegisFlow } from "@/context/AegisFlowContext";
import { RiskScore, SeverityLevel } from "@/types";
import { Tooltip } from "@/components/ui/Tooltip";
import { RISK_WEIGHTS } from "@/lib/scoringModel";

type SortField =
  | "impactScore"
  | "hazardRisk"
  | "populationExposureScore"
  | "demographicVulnerability"
  | "infrastructureCriticality";

export default function RiskPrioritizationPage() {
  const { impactScores, districts, simulationState, showToast } = useAegisFlow();

  const [selectedRiskScore, setSelectedRiskScore] = useState<RiskScore | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("impactScore");
  const [sortAsc, setSortAsc] = useState(false);

  // Filter and sort the priority queue
  const filteredAndSortedScores = useMemo(() => {
    return impactScores
      .filter((item) => {
        const matchesSearch =
          item.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.districtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.code.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPriority =
          priorityFilter === "all" || item.priorityLevel === priorityFilter;

        const matchesDistrict =
          districtFilter === "all" || item.locationId === districtFilter;

        return matchesSearch && matchesPriority && matchesDistrict;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (sortAsc) return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });
  }, [impactScores, searchQuery, priorityFilter, districtFilter, sortField, sortAsc]);

  // Aggregate summary counts
  const criticalCount = impactScores.filter((s) => s.priorityLevel === "critical").length;
  const highCount = impactScores.filter((s) => s.priorityLevel === "high").length;
  const moderateCount = impactScores.filter((s) => s.priorityLevel === "moderate").length;
  const safeCount = impactScores.filter(
    (s) => s.priorityLevel === "safe" || s.priorityLevel === "low"
  ).length;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Locations for USP Demo
  const majuliScore = impactScores.find((s) => s.locationId === "majuli") || impactScores[0];
  const nagaonScore = impactScores.find((s) => s.locationId === "nagaon") || impactScores[impactScores.length - 1];

  return (
    <div className="space-y-6">
      {/* 1. Header & Situation Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold text-text-primary font-mono uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-ops-crimson" />
              <span>Risk Prioritization & Decision Intelligence</span>
            </h1>
            <div className="flex items-center gap-1.5">
              <Badge variant="info">DECISION INTELLIGENCE</Badge>
              <Badge variant="neutral">SIMULATED MODEL</Badge>
              <Tooltip content="Deterministic mathematical risk model: Hazard Risk × (0.40 Exposure + 0.35 Vulnerability + 0.25 Infrastructure).">
                <span className="cursor-help text-text-muted hover:text-ops-cyan">
                  <Info className="w-3.5 h-3.5" />
                </span>
              </Tooltip>
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-1 font-mono">
            Vulnerability-weighted priority queue • Resolves where flood waters intersect critical human and infrastructural exposure
          </p>
        </div>

        {/* Model Weights Banner */}
        <div className="flex items-center gap-2 text-xs font-mono bg-surface-elevated px-3 py-1.5 rounded border border-border">
          <span className="text-text-muted text-[10px] uppercase">Weights:</span>
          <span className="text-ops-amber font-bold">Exposure ({Math.round(RISK_WEIGHTS.exposure * 100)}%)</span>
          <span className="text-text-dim">•</span>
          <span className="text-ops-crimson font-bold">Vulnerability ({Math.round(RISK_WEIGHTS.vulnerability * 100)}%)</span>
          <span className="text-text-dim">•</span>
          <span className="text-ops-indigo-light font-bold">Infra ({Math.round(RISK_WEIGHTS.infrastructure * 100)}%)</span>
        </div>
      </div>

      {/* 2. Priority Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Critical */}
        <Card
          className="cursor-pointer hover:border-ops-crimson transition-all"
          onClick={() => setPriorityFilter(priorityFilter === "critical" ? "all" : "critical")}
        >
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                Critical Priority (81 - 100)
              </div>
              <div className="text-2xl font-bold font-mono text-ops-crimson mt-0.5">
                {criticalCount} <span className="text-xs text-text-muted font-normal">Districts</span>
              </div>
              <div className="text-[10px] font-mono text-text-secondary mt-0.5">
                Immediate evacuation required
              </div>
            </div>
            <div className="w-9 h-9 rounded bg-ops-crimson/10 border border-ops-crimson/30 flex items-center justify-center text-ops-crimson shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        {/* High */}
        <Card
          className="cursor-pointer hover:border-ops-amber transition-all"
          onClick={() => setPriorityFilter(priorityFilter === "high" ? "all" : "high")}
        >
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                High Priority (61 - 80)
              </div>
              <div className="text-2xl font-bold font-mono text-ops-amber mt-0.5">
                {highCount} <span className="text-xs text-text-muted font-normal">Districts</span>
              </div>
              <div className="text-[10px] font-mono text-text-secondary mt-0.5">
                Pre-position rescue squads
              </div>
            </div>
            <div className="w-9 h-9 rounded bg-ops-amber/10 border border-ops-amber/30 flex items-center justify-center text-ops-amber shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        {/* Moderate */}
        <Card
          className="cursor-pointer hover:border-ops-indigo transition-all"
          onClick={() => setPriorityFilter(priorityFilter === "moderate" ? "all" : "moderate")}
        >
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                Moderate Priority (41 - 60)
              </div>
              <div className="text-2xl font-bold font-mono text-ops-indigo-light mt-0.5">
                {moderateCount} <span className="text-xs text-text-muted font-normal">Districts</span>
              </div>
              <div className="text-[10px] font-mono text-text-secondary mt-0.5">
                Active shelter standby
              </div>
            </div>
            <div className="w-9 h-9 rounded bg-ops-indigo/10 border border-ops-indigo/30 flex items-center justify-center text-ops-indigo-light shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        {/* Safe / Low */}
        <Card
          className="cursor-pointer hover:border-ops-emerald transition-all"
          onClick={() => setPriorityFilter(priorityFilter === "safe" ? "all" : "safe")}
        >
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                Safe / Low (&lt; 40)
              </div>
              <div className="text-2xl font-bold font-mono text-ops-emerald mt-0.5">
                {safeCount} <span className="text-xs text-text-muted font-normal">Districts</span>
              </div>
              <div className="text-[10px] font-mono text-text-secondary mt-0.5">
                Routine surveillance
              </div>
            </div>
            <div className="w-9 h-9 rounded bg-ops-emerald/10 border border-ops-emerald/30 flex items-center justify-center text-ops-emerald shrink-0">
              <Compass className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Priority Queue Table with Sorting & Filters */}
      <Card>
        <CardHeader className="py-3 bg-surface-subtle/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span>OPERATIONAL PRIORITY QUEUE</span>
                <Badge variant="info">
                  {filteredAndSortedScores.length} Ranked Locations
                </Badge>
              </CardTitle>
              <CardDescription>
                Ranked strictly by Impact Score. Click any location row to inspect factor breakdown and explainability.
              </CardDescription>
            </div>

            {/* Filters and Search Bar */}
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search settlement or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-surface-elevated text-xs font-mono text-text-primary pl-8 pr-3 py-1.5 rounded border border-border focus:border-ops-cyan focus:outline-none w-48"
                />
              </div>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-surface-elevated text-xs font-mono text-text-primary px-2.5 py-1.5 rounded border border-border focus:border-ops-cyan focus:outline-none uppercase"
              >
                <option value="all">Priority: All</option>
                <option value="critical">Critical Only</option>
                <option value="high">High Only</option>
                <option value="moderate">Moderate Only</option>
                <option value="safe">Safe / Low Only</option>
              </select>

              {/* District Filter */}
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="bg-surface-elevated text-xs font-mono text-text-primary px-2.5 py-1.5 rounded border border-border focus:border-ops-cyan focus:outline-none"
              >
                <option value="all">District: All</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface-subtle text-text-muted text-[10px] uppercase border-b border-border select-none">
              <tr>
                <th className="py-2.5 px-3 text-center">Rank</th>
                <th className="py-2.5 px-3">Location / Settlement</th>
                <th className="py-2.5 px-3">District</th>
                <th
                  onClick={() => handleSort("hazardRisk")}
                  className="py-2.5 px-3 text-center cursor-pointer hover:text-ops-cyan"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Hazard Risk</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("populationExposureScore")}
                  className="py-2.5 px-3 text-center cursor-pointer hover:text-ops-cyan"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Exposure (40%)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("demographicVulnerability")}
                  className="py-2.5 px-3 text-center cursor-pointer hover:text-ops-cyan"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Vuln (35%)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("infrastructureCriticality")}
                  className="py-2.5 px-3 text-center cursor-pointer hover:text-ops-cyan"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Infra (25%)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("impactScore")}
                  className="py-2.5 px-3 text-center cursor-pointer hover:text-ops-cyan text-ops-cyan font-bold"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Impact Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center">Priority</th>
                <th className="py-2.5 px-4">Recommended Action</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredAndSortedScores.map((item) => {
                const isCrit = item.priorityLevel === "critical";
                const isHigh = item.priorityLevel === "high";
                const isMod = item.priorityLevel === "moderate";

                return (
                  <tr
                    key={item.locationId}
                    onClick={() => setSelectedRiskScore(item)}
                    className="hover:bg-surface-elevated transition-colors cursor-pointer group"
                  >
                    {/* Rank */}
                    <td className="py-3 px-3 text-center font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                          item.rank === 1
                            ? "bg-ops-crimson/20 text-ops-crimson border border-ops-crimson/40"
                            : item.rank === 2
                            ? "bg-ops-amber/20 text-ops-amber border border-ops-amber/40"
                            : "bg-surface-elevated text-text-muted"
                        }`}
                      >
                        {String(item.rank).padStart(2, "0")}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-text-primary uppercase group-hover:text-ops-cyan transition-colors">
                        {item.locationName}
                      </div>
                      <div className="text-[10px] text-text-muted">
                        Pop: {item.populationExposed.toLocaleString("en-IN")} exposed
                      </div>
                    </td>

                    {/* District */}
                    <td className="py-3 px-3 text-text-secondary text-[11px]">
                      {item.districtName} ({item.code})
                    </td>

                    {/* Hazard Risk */}
                    <td className="py-3 px-3 text-center font-bold text-text-primary">
                      {item.hazardRisk}
                    </td>

                    {/* Exposure */}
                    <td className="py-3 px-3 text-center text-ops-amber font-semibold">
                      {item.populationExposureScore}
                    </td>

                    {/* Vulnerability */}
                    <td className="py-3 px-3 text-center text-ops-crimson font-semibold">
                      {item.demographicVulnerability}
                    </td>

                    {/* Infrastructure */}
                    <td className="py-3 px-3 text-center text-ops-indigo-light font-semibold">
                      {item.infrastructureCriticality}
                    </td>

                    {/* Impact Score */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-sm font-black px-2 py-0.5 rounded border ${
                          isCrit
                            ? "bg-ops-crimson/15 text-ops-crimson border-ops-crimson/30 shadow-glow-crimson"
                            : isHigh
                            ? "bg-ops-amber/15 text-ops-amber border-ops-amber/30"
                            : isMod
                            ? "bg-ops-indigo/15 text-ops-indigo-light border-ops-indigo/30"
                            : "bg-ops-emerald/15 text-ops-emerald border-ops-emerald/30"
                        }`}
                      >
                        {item.impactScore}
                      </span>
                    </td>

                    {/* Priority Badge */}
                    <td className="py-3 px-3 text-center">
                      <Badge
                        variant={isCrit ? "critical" : isHigh ? "warning" : isMod ? "neutral" : "safe"}
                        dot={isCrit}
                        size="sm"
                      >
                        {item.priorityLevel}
                      </Badge>
                    </td>

                    {/* Recommended Action */}
                    <td className="py-3 px-4 text-[11px] text-text-secondary max-w-xs truncate">
                      {item.recommendedAction}
                    </td>

                    {/* Details Arrow */}
                    <td className="py-3 px-3 text-right">
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-ops-cyan group-hover:translate-x-0.5 transition-all inline" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 4. Hazard Risk vs Impact Risk Comparative Matrix & The USP Demonstration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Comparison Matrix: Hazard vs Impact (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-ops-cyan" />
                  <span>HAZARD RISK vs. IMPACT RISK COMPARISON</span>
                </CardTitle>
                <Badge variant="neutral" size="sm">
                  Comparative Matrix
                </Badge>
              </div>
              <CardDescription>
                Demonstrates how vulnerable demographics and structural bottlenecks modify purely hydrological flood scores.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-surface-subtle text-text-muted text-[10px] uppercase border-b border-border">
                  <tr>
                    <th className="py-2 px-3">Location</th>
                    <th className="py-2 px-3 text-center">Hazard Risk</th>
                    <th className="py-2 px-3 text-center">Impact Score</th>
                    <th className="py-2 px-3 text-center">Delta</th>
                    <th className="py-2 px-3">Key Differentiating Driver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {impactScores.slice(0, 5).map((item) => {
                    const delta = item.impactScore - item.hazardRisk;

                    return (
                      <tr key={item.locationId} className="hover:bg-surface-elevated/60">
                        <td className="py-2 px-3 font-semibold text-text-primary">
                          {item.locationName}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-text-secondary">
                          {item.hazardRisk}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-ops-cyan">
                          {item.impactScore}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`font-bold ${
                              delta > 0
                                ? "text-ops-crimson"
                                : delta < 0
                                ? "text-ops-emerald"
                                : "text-text-muted"
                            }`}
                          >
                            {delta > 0 ? `+${delta}` : delta}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-[10px] text-text-secondary truncate max-w-xs">
                          {item.explanation.primaryDriver}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* 5. The USP Demonstration Card (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <Card className="border-ops-cyan/50 shadow-glow-cyan bg-surface">
            <CardHeader className="py-3 bg-ops-cyan/10 border-b border-ops-cyan/30">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-ops-cyan">
                  <Sparkles className="w-4 h-4" />
                  <span>WHY IMPACT SCORE ≠ POPULATION SIZE</span>
                </CardTitle>
                <Badge variant="info" size="sm">
                  CORE USP
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                {/* Location A: Nagaon */}
                <div className="p-3 rounded bg-surface-elevated border border-border space-y-1">
                  <div className="text-[10px] text-text-muted uppercase font-bold">
                    Location A (Large Mainland)
                  </div>
                  <div className="font-bold text-text-primary text-xs uppercase">
                    {nagaonScore.locationName}
                  </div>
                  <div className="text-[10px] text-text-secondary">
                    Pop: <strong>2.82M</strong> • Hazard: {nagaonScore.hazardRisk}
                  </div>
                  <div className="text-[10px] text-text-muted">
                    Vulnerability: {nagaonScore.demographicVulnerability}/100
                  </div>
                  <div className="pt-1 text-sm font-bold text-ops-indigo-light">
                    Impact Score: {nagaonScore.impactScore}/100
                  </div>
                  <Badge variant="neutral" size="sm">
                    {nagaonScore.priorityLevel} Priority
                  </Badge>
                </div>

                {/* Location B: Majuli */}
                <div className="p-3 rounded bg-ops-crimson/10 border border-ops-crimson/40 space-y-1">
                  <div className="text-[10px] text-ops-crimson uppercase font-bold">
                    Location B (Small Island)
                  </div>
                  <div className="font-bold text-text-primary text-xs uppercase">
                    {majuliScore.locationName}
                  </div>
                  <div className="text-[10px] text-text-secondary">
                    Pop: <strong>167k</strong> • Hazard: {majuliScore.hazardRisk}
                  </div>
                  <div className="text-[10px] text-ops-crimson font-semibold">
                    Vulnerability: {majuliScore.demographicVulnerability}/100
                  </div>
                  <div className="pt-1 text-sm font-bold text-ops-crimson">
                    Impact Score: {majuliScore.impactScore}/100
                  </div>
                  <Badge variant="critical" size="sm" dot={true}>
                    {majuliScore.priorityLevel} Priority
                  </Badge>
                </div>
              </div>

              {/* USP Takeaway */}
              <div className="p-2.5 rounded bg-surface-subtle border border-border text-[11px] text-text-secondary leading-relaxed">
                <strong className="text-ops-cyan">AegisFlow Decision Logic: </strong>
                Location B ({majuliScore.locationName}) is prioritized over Location A ({nagaonScore.locationName}) despite having a <strong>16x smaller population</strong>. High kutcha dwellings (78%), island isolation, and acute hospital shortages produce a catastrophic human risk footprint.
              </div>

              <div className="pt-1">
                <Link href="/response-plan">
                  <Button variant="primary" size="sm" className="w-full gap-2">
                    <span>Dispatch Resources to Prioritized Hotspots</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Location Intelligence Drawer */}
      <LocationIntelligenceDrawer
        riskScore={selectedRiskScore}
        onClose={() => setSelectedRiskScore(null)}
      />
    </div>
  );
}
