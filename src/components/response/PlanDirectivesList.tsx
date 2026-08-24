"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FileCheck2 } from "lucide-react";

interface PlanDirectivesListProps {
  actions: string[];
}

export function PlanDirectivesList({ actions }: PlanDirectivesListProps) {
  return (
    <Card className="border-border">
      <CardHeader className="py-3 bg-surface-subtle/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-ops-cyan" />
            <span>RECOMMENDED COMMAND DIRECTIVES ({actions.length})</span>
          </CardTitle>
          <Badge variant="info" size="sm">
            Deterministic Logic
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2.5 font-mono text-xs">
        {actions.map((action, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded bg-surface-elevated border border-border flex items-start gap-2.5 leading-relaxed"
          >
            <span className="w-5 h-5 rounded-full bg-ops-cyan/15 text-ops-cyan border border-ops-cyan/30 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <div className="text-text-primary text-[11px]">{action}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
