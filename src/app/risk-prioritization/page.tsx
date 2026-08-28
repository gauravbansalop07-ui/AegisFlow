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
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Header & Situation Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border/80">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-mono tracking-tight flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-ops-crimson" />
              <span>Risk Prioritization & Decision Intelligence</span>
            </h1>
            <Badge variant="info">DECISION MODEL</Badge>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 font-sans">
            Vulnerability-weighted priority queue • Resolves where flood waters intersect critical human & infrastructural exposure
          </p>
        </div>

        {/* Model Weights Banner */}
        <div className="flex items-center gap-2 text-xs font-mono bg-surface-elevated px-3 py-1.5 rounded-md border border-border flex-wrap">
          <span className="text-text-muted uppercase font-semibold">Weights:</span>
          <span className="text-ops-amber font-bold">Exposure ({Math.round(RISK_WEIGHTS.exposure * 100)}%)</span>
          <span className="text-text-muted">•</span>
          <span className="text-ops-crimson font-bold">Vuln ({Math.round(RISK_WEIGHTS.vulnerability * 100)}%)</span>
          <span className="text-text-muted">•</span>
          <span className="text-ops-indigo-light font-bold">Infra ({Math.round(RISK_WEIGHTS.infrastructure * 100)}%)</span>
        </div>
      </div>

      {/* 2. Priority Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Critical */}
        <Card
          className="cursor-pointer hover:border-ops-crimson/50 transition-colors"
          onClick={() => setPriorityFilter(priorityFilter === "critical" ? "all" : "critical")}
        >
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-text-muted uppercase font-semibold">
                Critical (81-100)
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-ops-crimson mt-1">
                {criticalCount} <span className="text-sm text-text-muted font-normal">Districts</span>
              </div>
              <div className="text-xs text-text-secondary mt-1 font-sans">
                Immediate evacuation
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-ops-crimson/10 border border-ops-crimson/30 flex items-center justify-center text-ops-crimson shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* High */}
        <Card
          className="cursor-pointer hover:border-ops-amber/50 transition-colors"
          onClick={() => setPriorityFilter(priorityFilter === "high" ? "all" : "high")}
        >
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-text-muted uppercase font-semibold">
                High (61-80)
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-ops-amber mt-1">
                {highCount} <span className="text-sm text-text-muted font-normal">Districts</span>
              </div>
              <div className="text-xs text-text-secondary mt-1 font-sans">
                Pre-position rescue
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-ops-amber/10 border border-ops-amber/30 flex items-center justify-center text-ops-amber shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Moderate */}
        <Card
          className="cursor-pointer hover:border-ops-indigo/50 transition-colors"
          onClick={() => setPriorityFilter(priorityFilter === "moderate" ? "all" : "moderate")}
        >
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-text-muted uppercase font-semibold">
                Moderate (41-60)
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-ops-indigo-light mt-1">
                {moderateCount} <span className="text-sm text-text-muted font-normal">Districts</span>
              </div>
              <div className="text-xs text-text-secondary mt-1 font-sans">
                Shelter standby
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-ops-indigo/10 border border-ops-indigo/30 flex items-center justify-center text-ops-indigo-light shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Safe / Low */}
        <Card
          className="cursor-pointer hover:border-ops-emerald/50 transition-colors"
          onClick={() => setPriorityFilter(priorityFilter === "safe" ? "all" : "safe")}
        >
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-text-muted uppercase font-semibold">
                Safe / Low (&lt;40)
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-ops-emerald mt-1">
                {safeCount} <span className="text-sm text-text-muted font-normal">Districts</span>
              </div>
              <div className="text-xs text-text-secondary mt-1 font-sans">
                Routine surveillance
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-ops-emerald/10 border border-ops-emerald/30 flex items-center justify-center text-ops-emerald shrink-0">
              <Compass className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Priority Queue Table with Sorting & Filters */}
      <Card>
        <CardHeader className="bg-surface-subtle/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2.5">
                <span>OPERATIONAL PRIORITY QUEUE</span>
                <Badge variant="info" size="sm">
                  {filteredAndSortedScores.length} Ranked
                </Badge>
              </CardTitle>
              <CardDescription>
                Ranked strictly by Impact Risk Score. Tap any location row to inspect factor breakdown and explainability.
              </CardDescription>
            </div>

            {/* Filters and Search Bar */}
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search settlement..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-surface-elevated text-xs font-mono text-text-primary pl-9 pr-3 py-2 rounded-md border border-border focus:border-ops-cyan focus:outline-none w-full sm:w-48"
                />
              </div>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-surface-elevated text-xs font-mono text-text-primary px-3 py-2 rounded-md border border-border focus:border-ops-cyan focus:outline-none uppercase cursor-pointer"
              >
                <option value="all">Priority: All</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="moderate">Moderate</option>
                <option value="safe">Safe / Low</option>
              </select>

              {/* District Filter */}
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="bg-surface-elevated text-xs font-mono text-text-primary px-3 py-2 rounded-md border border-border focus:border-ops-cyan focus:outline-none max-w-[140px] truncate cursor-pointer"
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
          <table className="w-full text-left font-mono text-xs min-w-[680px]">
            <thead className="bg-surface-subtle text-text-muted text-[11px] uppercase border-b border-border select-none">
              <tr>
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4">Location / Settlement</th>
                <th className="py-3 px-4">District</th>
                <th
                  onClick={() => handleSort("hazardRisk")}
                  className="py-3 px-3 text-center cursor-pointer hover:text-ops-cyan"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Hazard</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("populationExposureScore")}
                  className="py-3 px-3 text-center cursor-pointer hover:text-ops-cyan"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Exposure</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("demographicVulnerability")}
                  className="py-3 px-3 text-center cursor-pointer hover:text-ops-cyan"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Vuln</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("impactScore")}
                  className="py-3 px-4 text-center cursor-pointer hover:text-ops-cyan text-ops-cyan font-bold"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Impact Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4 text-right">Details</th>
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
                    <td className="py-3.5 px-4 text-center font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-mono font-bold ${
                          item.rank === 1
                            ? "bg-ops-crimson/20 text-ops-crimson border border-ops-crimson/40"
                            : item.rank === 2
                            ? "bg-ops-amber/20 text-ops-amber border border-ops-amber/40"
                            : "bg-surface-elevated text-text-muted"
                        }`}
                      >
                        {item.rank}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-text-primary text-sm uppercase group-hover:text-ops-cyan transition-colors">
                        {item.locationName}
                      </div>
                      <div className="text-xs text-text-muted mt-0.5 font-sans">
                        Pop: {item.populationExposed.toLocaleString("en-IN")} exposed
                      </div>
                    </td>

                    {/* District */}
                    <td className="py-3.5 px-4 text-text-secondary text-xs">
                      {item.districtName} ({item.code})
                    </td>

                    {/* Hazard Risk */}
                    <td className="py-3.5 px-3 text-center font-bold text-text-primary text-xs">
                      {item.hazardRisk}
                    </td>

                    {/* Exposure */}
                    <td className="py-3.5 px-3 text-center text-ops-amber font-semibold text-xs">
                      {item.populationExposureScore}
                    </td>

                    {/* Vulnerability */}
                    <td className="py-3.5 px-3 text-center text-ops-crimson font-semibold text-xs">
                      {item.demographicVulnerability}
                    </td>

                    {/* Impact Score */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-sm font-black px-2.5 py-1 rounded border font-mono ${
                          isCrit
                            ? "bg-ops-crimson/15 text-ops-crimson border-ops-crimson/30"
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
                    <td className="py-3.5 px-4 text-center">
                      <Badge
                        variant={isCrit ? "critical" : isHigh ? "warning" : isMod ? "neutral" : "safe"}
                        dot={isCrit}
                        size="sm"
                      >
                        {item.priorityLevel}
                      </Badge>
                    </td>

                    {/* Recommended Action */}
                    <td className="py-3.5 px-4 text-xs text-text-secondary max-w-xs truncate font-sans">
                      {item.recommendedAction}
                    </td>

                    {/* Details Arrow */}
                    <td className="py-3.5 px-4 text-right">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Comparison Matrix: Hazard vs Impact (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <Card>
            <CardHeader className="py-2.5 sm:py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xs sm:text-sm">
                  <Layers className="w-4 h-4 text-ops-cyan" />
                  <span>HAZARD vs. IMPACT COMPARISON</span>
                </CardTitle>
                <Badge variant="neutral" size="sm">
                  Matrix
                </Badge>
              </div>
              <CardDescription className="text-[10.5px]">
                Demonstrates how demographic vulnerability modifies pure hydrological flood scores.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs min-w-[420px]">
                <thead className="bg-surface-subtle text-text-muted text-[10px] uppercase border-b border-border">
                  <tr>
                    <th className="py-2 px-3">Location</th>
                    <th className="py-2 px-3 text-center">Hazard</th>
                    <th className="py-2 px-3 text-center">Impact</th>
                    <th className="py-2 px-3 text-center">Delta</th>
                    <th className="py-2 px-3">Key Driver</th>
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
            <CardHeader className="py-2.5 sm:py-3 bg-ops-cyan/10 border-b border-ops-cyan/30">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-ops-cyan text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>WHY IMPACT SCORE ≠ POPULATION SIZE</span>
                </CardTitle>
                <Badge variant="info" size="sm">
                  USP
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2">
                {/* Location A: Nagaon */}
                <div className="p-2.5 rounded bg-surface-elevated border border-border space-y-1">
                  <div className="text-[9px] text-text-muted uppercase font-bold">
                    Location A (Mainland)
                  </div>
                  <div className="font-bold text-text-primary text-[11px] uppercase">
                    {nagaonScore.locationName}
                  </div>
                  <div className="text-[9.5px] text-text-secondary">
                    Pop: <strong>2.82M</strong> • Hazard: {nagaonScore.hazardRisk}
                  </div>
                  <div className="text-[9.5px] text-text-muted">
                    Vuln: {nagaonScore.demographicVulnerability}/100
                  </div>
                  <div className="pt-0.5 text-xs font-bold text-ops-indigo-light">
                    Impact: {nagaonScore.impactScore}/100
                  </div>
                  <Badge variant="neutral" size="sm">
                    {nagaonScore.priorityLevel}
                  </Badge>
                </div>

                {/* Location B: Majuli */}
                <div className="p-2.5 rounded bg-ops-crimson/10 border border-ops-crimson/40 space-y-1">
                  <div className="text-[9px] text-ops-crimson uppercase font-bold">
                    Location B (Island)
                  </div>
                  <div className="font-bold text-text-primary text-[11px] uppercase">
                    {majuliScore.locationName}
                  </div>
                  <div className="text-[9.5px] text-text-secondary">
                    Pop: <strong>167k</strong> • Hazard: {majuliScore.hazardRisk}
                  </div>
                  <div className="text-[9.5px] text-ops-crimson font-semibold">
                    Vuln: {majuliScore.demographicVulnerability}/100
                  </div>
                  <div className="pt-0.5 text-xs font-bold text-ops-crimson">
                    Impact: {majuliScore.impactScore}/100
                  </div>
                  <Badge variant="critical" size="sm" dot={true}>
                    {majuliScore.priorityLevel}
                  </Badge>
                </div>
              </div>

              {/* USP Takeaway */}
              <div className="p-2 sm:p-2.5 rounded bg-surface-subtle border border-border text-[10px] sm:text-[11px] text-text-secondary leading-relaxed">
                <strong className="text-ops-cyan">Decision Logic: </strong>
                Location B ({majuliScore.locationName}) is prioritized over Location A ({nagaonScore.locationName}) despite having a <strong>16x smaller population</strong>. High kutcha dwellings (78%) and island isolation produce a catastrophic footprint.
              </div>

              <div className="pt-1">
                <Link href="/response-plan">
                  <Button variant="primary" size="sm" className="w-full gap-2 text-xs py-2">
                    <span>Dispatch Resources to Hotspots</span>
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
