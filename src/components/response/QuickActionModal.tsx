"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ShieldAlert, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickActionModal({ isOpen, onClose }: QuickActionModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="EOC Response Plan Activation"
      description="Operational Protocol for Human-In-The-Loop Resource Mobilization"
      maxWidth="md"
    >
      <div className="space-y-4 font-mono text-xs text-text-secondary">
        <div className="p-3.5 rounded bg-ops-amber/10 border border-ops-amber/30 text-text-primary flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-ops-amber shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-ops-amber text-xs uppercase tracking-wide">
              Human-In-The-Loop Approval Protocol
            </div>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              Response activation requires a formalized Response Plan. AegisFlow enforces commander review to verify resource allocations and road route safety before dispatch.
            </p>
          </div>
        </div>

        <div className="p-3 rounded bg-surface-subtle border border-border space-y-2">
          <div className="text-[11px] text-text-muted uppercase font-bold">
            Required Next Steps:
          </div>
          <div className="flex items-center gap-2 text-text-primary">
            <CheckCircle2 className="w-3.5 h-3.5 text-ops-cyan" />
            <span>1. Review Hazard & Vulnerability Factors</span>
          </div>
          <div className="flex items-center gap-2 text-text-primary">
            <CheckCircle2 className="w-3.5 h-3.5 text-ops-cyan" />
            <span>2. Verify Evacuation Routes & Road Cut-offs</span>
          </div>
          <div className="flex items-center gap-2 text-text-primary">
            <CheckCircle2 className="w-3.5 h-3.5 text-ops-cyan" />
            <span>3. Sign-off digitally in Response Plan module</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Dismiss
          </Button>
          <Link href="/response-plan" onClick={onClose}>
            <Button variant="primary" size="sm" className="gap-1.5">
              <span>Go to Response Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
}
