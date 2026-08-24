"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ReportExecutiveKpiGrid } from "@/components/reports/ReportExecutiveKpiGrid";
import { ReportPriorityAndResources } from "@/components/reports/ReportPriorityAndResources";
import { ReportAuditAndTimeline } from "@/components/reports/ReportAuditAndTimeline";
import { useAegisFlow } from "@/context/AegisFlowContext";
import { generateReportMarkdown } from "@/lib/reportBuilder";
import {
  FileSpreadsheet,
  Printer,
  Download,
  PlusCircle,
  Clock,
  History,
  FileCheck2,
  SlidersHorizontal,
  ChevronRight,
  Info,
} from "lucide-react";
import Link from "next/link";
import { Tooltip } from "@/components/ui/Tooltip";

export default function ReportsPage() {
  const {
    currentReport,
    reportHistory,
    generateIncidentReport,
    selectHistoricalReport,
    showToast,
  } = useAegisFlow();

  const report = currentReport;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownloadMarkdown = () => {
    if (!report) return;
    const md = generateReportMarkdown(report);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.reportSessionId}-situation-report.md`;
    link.click();
    URL.revokeObjectURL(url);

    showToast({
      title: "Dossier Exported",
      message: `${report.reportCode} exported as formatted Markdown document.`,
      type: "success",
    });
  };

  if (!report) {
    return (
      <div className="p-12 text-center font-mono text-xs text-text-muted">
        SYNTHESIZING OPERATIONAL INCIDENT REPORT...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold text-text-primary font-mono uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-ops-cyan" />
              <span>Operational Situation Report</span>
            </h1>
            <div className="flex items-center gap-1.5">
              <Badge variant="safe" dot={true}>
                {report.operationalStatus}
              </Badge>
              <Badge variant="info">{report.reportCode}</Badge>
              <Badge variant="neutral">{report.reportSessionId}</Badge>
              <Tooltip content="AegisFlow Comprehensive Dossier: Consolidates live hazard telemetry, priority rankings, optimized logistics, evacuation safety, official alerts, and commander decisions into an immutable briefing snapshot.">
                <span className="cursor-help text-text-muted hover:text-ops-cyan">
                  <Info className="w-3.5 h-3.5" />
                </span>
              </Tooltip>
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-1 font-mono">
            State Emergency Operations Briefing • Scenario: <strong className="text-text-primary">{report.scenario}</strong> • Generated: <strong className="text-ops-cyan">{report.generatedAt}</strong>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadMarkdown}
            className="gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-ops-cyan" />
            <span>Export MD</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={generateIncidentReport}
            className="gap-1.5 font-bold shadow-glow-cyan"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Snapshot Report</span>
          </Button>
        </div>
      </div>

      {/* 2. Main Executive Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Report Sections (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          <ReportExecutiveKpiGrid report={report} />
          <ReportPriorityAndResources report={report} />
          <ReportAuditAndTimeline report={report} />
        </div>

        {/* Right Column: Historical Reports Archive (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-3.5 rounded bg-surface border border-border space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-1.5 font-bold text-text-primary text-[11px] uppercase">
                <History className="w-4 h-4 text-ops-cyan" />
                <span>Report History</span>
              </div>
              <Badge variant="neutral" size="sm">
                {reportHistory.length} Snapshots
              </Badge>
            </div>

            <p className="text-[10.5px] text-text-muted leading-relaxed">
              Every snapshot preserves an immutable record of telemetry, decisions, and routes at that moment in time.
            </p>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {reportHistory.map((h) => {
                const isSelected = h.id === report.id;

                return (
                  <div
                    key={h.id}
                    onClick={() => selectHistoricalReport(h.id)}
                    className={`p-2.5 rounded border transition-all cursor-pointer space-y-1 ${
                      isSelected
                        ? "bg-ops-cyan/15 border-ops-cyan shadow-glow-cyan"
                        : "bg-surface-elevated border-border hover:border-ops-cyan/40"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-ops-cyan">{h.reportCode}</span>
                      <span className="text-text-dim">{h.reportSessionId}</span>
                    </div>

                    <div className="font-bold text-text-primary text-[11px] truncate">
                      {h.scenario}
                    </div>

                    <div className="text-[9.5px] text-text-secondary flex items-center justify-between pt-0.5">
                      <span>{h.generatedAt.split("•")[1] || h.generatedAt}</span>
                      <ChevronRight className="w-3 h-3 text-text-muted" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Tune Simulation Card */}
          <div className="p-3 rounded bg-surface-subtle border border-border font-mono text-xs space-y-2">
            <div className="text-[11px] font-bold text-text-primary uppercase flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-ops-cyan" />
              <span>Simulate New Scenario</span>
            </div>
            <p className="text-[10.5px] text-text-secondary leading-relaxed">
              Tuning flood rainfall or river crests will allow snapshotting sequential evolution reports.
            </p>
            <Link href="/hazard-monitor">
              <Button variant="secondary" size="sm" className="w-full text-xs">
                Open Hazard Monitor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
