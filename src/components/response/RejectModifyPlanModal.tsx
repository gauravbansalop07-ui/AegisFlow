"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ResponsePlan } from "@/types";
import {
  XCircle,
  Edit3,
  AlertTriangle,
  RotateCcw,
  Check,
  Boxes,
} from "lucide-react";

interface RejectModifyPlanModalProps {
  isOpen: boolean;
  plan: ResponsePlan | null;
  onClose: () => void;
  onReject: (reason: string, notes?: string) => void;
  onModify: (
    modifiedResources: ResponsePlan["recommendedResources"],
    notes: string
  ) => void;
}

export function RejectModifyPlanModal({
  isOpen,
  plan,
  onClose,
  onReject,
  onModify,
}: RejectModifyPlanModalProps) {
  const [activeTab, setActiveTab] = useState<"reject" | "modify">("reject");
  const [rejectionReason, setRejectionReason] = useState("Resource concern");
  const [commanderNotes, setCommanderNotes] = useState("");

  // Modification Form State
  const [boats, setBoats] = useState(plan?.recommendedResources.boats || 6);
  const [foodKits, setFoodKits] = useState(plan?.recommendedResources.foodKits || 1500);
  const [rescueTeams, setRescueTeams] = useState(plan?.recommendedResources.rescueTeams || 4);
  const [medicalTeams, setMedicalTeams] = useState(plan?.recommendedResources.medicalTeams || 3);
  const [vehicles, setVehicles] = useState(plan?.recommendedResources.vehicles || 8);

  if (!plan) return null;

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReject(rejectionReason, commanderNotes);
  };

  const handleModifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onModify(
      {
        boats,
        foodKits,
        rescueTeams,
        medicalTeams,
        vehicles,
      },
      commanderNotes || "Modified by Incident Commander"
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="COMMANDER INTERVENTION: REJECT / MODIFY"
      description={`${plan.planCode} • Target: ${plan.targetLocationName}`}
      maxWidth="lg"
    >
      <div className="space-y-3 sm:space-y-4 font-mono text-xs">
        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1 rounded bg-surface-elevated border border-border">
          <button
            type="button"
            onClick={() => setActiveTab("reject")}
            className={`flex-1 py-1.5 rounded text-[11px] sm:text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
              activeTab === "reject"
                ? "bg-ops-crimson/20 border border-ops-crimson/50 text-ops-crimson shadow-glow-crimson"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject Plan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("modify")}
            className={`flex-1 py-1.5 rounded text-[11px] sm:text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
              activeTab === "modify"
                ? "bg-ops-indigo/20 border border-ops-indigo/50 text-ops-indigo-light shadow-glow-indigo"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modify Allotment</span>
          </button>
        </div>

        {/* REJECT TAB */}
        {activeTab === "reject" && (
          <form onSubmit={handleRejectSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-text-muted">
                Reason for Rejection:
              </label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-surface-elevated text-xs font-mono text-text-primary px-3 py-1.5 sm:py-2 rounded border border-border focus:border-ops-crimson focus:outline-none"
              >
                <option value="Resource concern">Resource concern (Insufficient reserves)</option>
                <option value="Route concern">Route concern (Alternative required)</option>
                <option value="Shelter concern">Shelter concern (Camp staging unsuitable)</option>
                <option value="Situation changed">Situation changed (Rapid hydro/weather shift)</option>
                <option value="Manual intervention required">Manual intervention required</option>
                <option value="Other">Other Constraint</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-text-muted">
                Justification Note:
              </label>
              <textarea
                rows={3}
                required
                value={commanderNotes}
                onChange={(e) => setCommanderNotes(e.target.value)}
                placeholder="Specify tactical justification for returning this recommendation..."
                className="w-full bg-surface-elevated text-xs font-mono text-text-primary px-3 py-1.5 sm:py-2 rounded border border-border focus:border-ops-crimson focus:outline-none resize-none"
              />
            </div>

            <div className="p-2 sm:p-2.5 rounded bg-ops-crimson/10 border border-ops-crimson/30 text-text-secondary text-[10.5px] sm:text-[11px] leading-relaxed">
              <strong className="text-ops-crimson">Result: </strong>
              Rejecting this recommendation archives {plan.planCode} as rejected. No assets will be mobilized.
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
              <Button variant="outline" size="sm" type="button" onClick={onClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button variant="destructive" size="sm" type="submit" className="gap-2 font-bold w-full sm:w-auto justify-center">
                <XCircle className="w-4 h-4" />
                <span>CONFIRM REJECTION</span>
              </Button>
            </div>
          </form>
        )}

        {/* MODIFY TAB */}
        {activeTab === "modify" && (
          <form onSubmit={handleModifySubmit} className="space-y-3">
            <div className="text-[10.5px] sm:text-[11px] text-text-secondary">
              Adjust resource allotments before submitting updated plan:
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2 rounded bg-surface-elevated border border-border space-y-1">
                <label className="text-[9.5px] text-text-muted uppercase">Boats</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={boats}
                  onChange={(e) => setBoats(Number(e.target.value))}
                  className="w-full bg-surface-subtle font-mono font-bold text-ops-cyan px-2 py-1 rounded border border-border text-xs"
                />
              </div>

              <div className="p-2 rounded bg-surface-elevated border border-border space-y-1">
                <label className="text-[9.5px] text-text-muted uppercase">Food Kits</label>
                <input
                  type="number"
                  min={0}
                  max={5000}
                  step={100}
                  value={foodKits}
                  onChange={(e) => setFoodKits(Number(e.target.value))}
                  className="w-full bg-surface-subtle font-mono font-bold text-ops-amber px-2 py-1 rounded border border-border text-xs"
                />
              </div>

              <div className="p-2 rounded bg-surface-elevated border border-border space-y-1">
                <label className="text-[9.5px] text-text-muted uppercase">Rescue Squads</label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={rescueTeams}
                  onChange={(e) => setRescueTeams(Number(e.target.value))}
                  className="w-full bg-surface-subtle font-mono font-bold text-ops-crimson px-2 py-1 rounded border border-border text-xs"
                />
              </div>

              <div className="p-2 rounded bg-surface-elevated border border-border space-y-1">
                <label className="text-[9.5px] text-text-muted uppercase">Medical</label>
                <input
                  type="number"
                  min={0}
                  max={12}
                  value={medicalTeams}
                  onChange={(e) => setMedicalTeams(Number(e.target.value))}
                  className="w-full bg-surface-subtle font-mono font-bold text-ops-emerald px-2 py-1 rounded border border-border text-xs"
                />
              </div>

              <div className="p-2 rounded bg-surface-elevated border border-border space-y-1 col-span-2 sm:col-span-1">
                <label className="text-[9.5px] text-text-muted uppercase">ATVs / Vehicles</label>
                <input
                  type="number"
                  min={0}
                  max={25}
                  value={vehicles}
                  onChange={(e) => setVehicles(Number(e.target.value))}
                  className="w-full bg-surface-subtle font-mono font-bold text-ops-indigo-light px-2 py-1 rounded border border-border text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-text-muted">
                Modification Notes:
              </label>
              <textarea
                rows={2}
                value={commanderNotes}
                onChange={(e) => setCommanderNotes(e.target.value)}
                placeholder="e.g. Scaled boat deployment from 6 to 8."
                className="w-full bg-surface-elevated text-xs font-mono text-text-primary px-3 py-1.5 sm:py-2 rounded border border-border focus:border-ops-indigo focus:outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
              <Button variant="outline" size="sm" type="button" onClick={onClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" className="gap-2 font-bold w-full sm:w-auto justify-center">
                <Check className="w-4 h-4" />
                <span>SAVE MODIFIED PLAN</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
