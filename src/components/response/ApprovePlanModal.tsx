"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ResponsePlan } from "@/types";
import {
  ShieldCheck,
  Boxes,
  Route,
  Building2,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

interface ApprovePlanModalProps {
  isOpen: boolean;
  plan: ResponsePlan | null;
  onClose: () => void;
  onConfirm: (commanderName: string, notes?: string) => void;
}

export function ApprovePlanModal({
  isOpen,
  plan,
  onClose,
  onConfirm,
}: ApprovePlanModalProps) {
  const [commanderName, setCommanderName] = useState("Gaurav Bansal (Incident Commander)");
  const [commanderNotes, setCommanderNotes] = useState("");

  if (!plan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(commanderName, commanderNotes);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CONFIRM COMMANDER APPROVAL"
      description={`${plan.planCode} • Target: ${plan.targetLocationName} (${plan.priority.toUpperCase()} PRIORITY)`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
        {/* Executive Plan Summary Card */}
        <div className="p-3.5 rounded bg-surface-elevated border border-border space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-border/80">
            <div>
              <span className="text-[10px] text-text-muted uppercase">Target Settlement:</span>
              <div className="font-bold text-text-primary text-sm uppercase">
                {plan.targetLocationName} ({plan.districtCode})
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-text-muted uppercase">Impact Score:</span>
              <div className="font-bold text-ops-crimson text-sm">
                {plan.impactScore}/100 ({plan.priority.toUpperCase()})
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            {/* Resources to Deploy */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-ops-amber font-bold uppercase text-[10px]">
                <Boxes className="w-3.5 h-3.5" />
                <span>Authorized Resources:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-text-secondary">
                <li>{plan.recommendedResources.boats} Motorized Rescue Boats</li>
                <li>{plan.recommendedResources.rescueTeams} NDRF Rescue Squads</li>
                <li>{plan.recommendedResources.foodKits.toLocaleString("en-IN")} Dry Ration Kits</li>
                <li>{plan.recommendedResources.medicalTeams} Mobile Medical Units</li>
              </ul>
            </div>

            {/* Evacuation Route & Shelter */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-ops-cyan font-bold uppercase text-[10px]">
                <Route className="w-3.5 h-3.5" />
                <span>Evacuation Corridor:</span>
              </div>
              <div className="text-text-primary font-bold">{plan.evacuationRoute.name}</div>
              <div className="text-text-secondary text-[10px]">
                ETA: ~{plan.evacuationRoute.estimatedMinutes} mins ({plan.evacuationRoute.distanceKm} km)
              </div>
              <div className="text-ops-emerald text-[10px] flex items-center gap-1 mt-1">
                <Building2 className="w-3 h-3" />
                <span>Shelter: {plan.destinationShelter.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety & Human-in-the-Loop Disclaimer */}
        <div className="p-3 rounded bg-ops-cyan/10 border border-ops-cyan/30 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-ops-cyan shrink-0 mt-0.5" />
          <div className="text-[11px] text-text-secondary leading-relaxed">
            <strong className="text-text-primary">Human-In-The-Loop Protocol: </strong>
            Approving this plan records the response directive as commander-authorized in the tactical audit log. In accordance with platform safety guidelines, no real-world physical assets will be dispatched.
          </div>
        </div>

        {/* Commander Identity Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-ops-emerald" />
            <span>Authorizing Commander Identity</span>
          </label>
          <input
            type="text"
            required
            value={commanderName}
            onChange={(e) => setCommanderName(e.target.value)}
            className="w-full bg-surface-elevated text-xs font-mono text-text-primary px-3 py-2 rounded border border-border focus:border-ops-cyan focus:outline-none"
          />
        </div>

        {/* Commander Notes */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-text-muted">
            Operational Directives / Sign-off Notes (Optional)
          </label>
          <textarea
            rows={2}
            value={commanderNotes}
            onChange={(e) => setCommanderNotes(e.target.value)}
            placeholder="e.g. Prioritize ferry boat staging at sector 4 embankment; alert sub-divisional health officer."
            className="w-full bg-surface-elevated text-xs font-mono text-text-primary px-3 py-2 rounded border border-border focus:border-ops-cyan focus:outline-none resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" className="gap-2 shadow-glow-emerald bg-ops-emerald hover:bg-ops-emerald/90 text-background font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>CONFIRM & RECORD APPROVAL</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
