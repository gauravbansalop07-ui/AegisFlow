"use client";

import React from "react";
import { SimulationTrajectoryPoint } from "@/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface HazardTrajectoryChartProps {
  trajectory: SimulationTrajectoryPoint[];
}

export function HazardTrajectoryChart({ trajectory }: HazardTrajectoryChartProps) {
  return (
    <div className="w-full h-48 font-mono text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={trajectory}
          margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="hazardGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="timeLabel"
            stroke="#64748B"
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: "#1E293B" }}
          />
          <YAxis
            stroke="#64748B"
            fontSize={10}
            domain={[0, 100]}
            tickLine={false}
            axisLine={{ stroke: "#1E293B" }}
          />
          <ReferenceLine
            y={80}
            stroke="#EF4444"
            strokeDasharray="3 3"
            label={{
              value: "CRITICAL THRESHOLD",
              fill: "#EF4444",
              fontSize: 9,
              position: "top",
            }}
          />
          <ReferenceLine
            y={60}
            stroke="#F59E0B"
            strokeDasharray="3 3"
            label={{
              value: "HIGH DANGER",
              fill: "#F59E0B",
              fontSize: 9,
              position: "top",
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as SimulationTrajectoryPoint;
                return (
                  <div className="bg-surface-elevated border border-border-strong p-2.5 rounded shadow-ops-lg text-xs font-mono">
                    <div className="font-bold text-text-primary uppercase flex items-center justify-between gap-4">
                      <span>{data.timeLabel}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          data.hazardSeverity >= 80
                            ? "bg-ops-crimson/20 text-ops-crimson"
                            : data.hazardSeverity >= 60
                            ? "bg-ops-amber/20 text-ops-amber"
                            : "bg-ops-cyan/20 text-ops-cyan"
                        }`}
                      >
                        {data.riskCategory}
                      </span>
                    </div>
                    <div className="text-ops-cyan font-bold mt-1 text-sm">
                      Hazard Severity: {data.hazardSeverity}/100
                    </div>
                    <div className="text-[10px] text-text-secondary mt-0.5 space-y-0.5">
                      <div>Rainfall Surge: {data.rainfallMm} mm</div>
                      <div>River Delta: +{data.riverLevelM}m</div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="hazardSeverity"
            stroke="#06B6D4"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#hazardGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
