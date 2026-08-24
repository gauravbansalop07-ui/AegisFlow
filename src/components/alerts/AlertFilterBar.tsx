"use client";

import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AlertFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sourceFilter: string;
  onSourceChange: (s: string) => void;
  severityFilter: string;
  onSeverityChange: (s: string) => void;
  statusFilter: string;
  onStatusChange: (s: string) => void;
  onResetFilters: () => void;
}

export function AlertFilterBar({
  searchQuery,
  onSearchChange,
  sourceFilter,
  onSourceChange,
  severityFilter,
  onSeverityChange,
  statusFilter,
  onStatusChange,
  onResetFilters,
}: AlertFilterBarProps) {
  return (
    <div className="p-3 rounded bg-surface border border-border flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search location, district, keyword..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-surface-elevated text-xs font-mono text-text-primary pl-8 pr-3 py-1.5 rounded border border-border focus:border-ops-cyan focus:outline-none"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Source */}
        <select
          value={sourceFilter}
          onChange={(e) => onSourceChange(e.target.value)}
          className="bg-surface-elevated text-xs font-mono text-text-primary px-2.5 py-1.5 rounded border border-border focus:border-ops-cyan focus:outline-none"
        >
          <option value="all">All Sources</option>
          <option value="CWC">CWC Hydrology</option>
          <option value="IMD">IMD Doppler</option>
          <option value="ASDMA">ASDMA Operations</option>
          <option value="District">District Collectorate</option>
        </select>

        {/* Severity */}
        <select
          value={severityFilter}
          onChange={(e) => onSeverityChange(e.target.value)}
          className="bg-surface-elevated text-xs font-mono text-text-primary px-2.5 py-1.5 rounded border border-border focus:border-ops-cyan focus:outline-none"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="moderate">Moderate</option>
          <option value="low">Advisory / Low</option>
        </select>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-surface-elevated text-xs font-mono text-text-primary px-2.5 py-1.5 rounded border border-border focus:border-ops-cyan focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active (Unacknowledged)</option>
          <option value="acknowledged">Acknowledged</option>
        </select>

        {/* Reset */}
        <Button
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="gap-1 text-[11px] py-1.5 px-2"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </Button>
      </div>
    </div>
  );
}
