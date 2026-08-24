"use client";

import React from "react";
import { District } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RiskDistributionChartProps {
  districts: District[];
}

export function RiskDistributionChart({ districts }: RiskDistributionChartProps) {
  // Aggregate count by risk level
  const distribution = [
    {
      level: "Critical",
      count: districts.filter((d) => d.currentRiskLevel === "critical").length,
      color: "#EF4444",
      districts: districts.filter((d) => d.currentRiskLevel === "critical").map(d => d.name).join(", "),
    },
    {
      level: "High",
      count: districts.filter((d) => d.currentRiskLevel === "high").length,
      color: "#F59E0B",
      districts: districts.filter((d) => d.currentRiskLevel === "high").map(d => d.name).join(", "),
    },
    {
      level: "Moderate",
      count: districts.filter((d) => d.currentRiskLevel === "moderate").length,
      color: "#6366F1",
      districts: districts.filter((d) => d.currentRiskLevel === "moderate").map(d => d.name).join(", "),
    },
    {
      level: "Safe / Low",
      count: districts.filter((d) => d.currentRiskLevel === "safe" || d.currentRiskLevel === "low").length,
      color: "#10B981",
      districts: districts.filter((d) => d.currentRiskLevel === "safe" || d.currentRiskLevel === "low").map(d => d.name).join(", "),
    },
  ];

  return (
    <div className="w-full h-44 font-mono text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={distribution}
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          barCategoryGap="20%"
        >
          <XAxis
            dataKey="level"
            stroke="#64748B"
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: "#1E293B" }}
          />
          <YAxis
            stroke="#64748B"
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: "#1E293B" }}
            allowDecimals={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-surface-elevated border border-border-strong p-2 rounded shadow-ops-lg text-xs font-mono">
                    <div className="font-bold" style={{ color: data.color }}>
                      {data.level}: {data.count} Districts
                    </div>
                    <div className="text-[10px] text-text-secondary mt-1">
                      {data.districts || "None"}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {distribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
