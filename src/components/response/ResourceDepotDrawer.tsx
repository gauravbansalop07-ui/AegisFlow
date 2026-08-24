"use client";

import React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Boxes,
  MapPin,
  Truck,
  Shield,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useAegisFlow } from "@/context/AegisFlowContext";

interface ResourceDepotInfo {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  staged: {
    boats: number;
    foodKits: number;
    medicalTeams: number;
    rescueTeams: number;
    vehicles: number;
  };
  supportedHotspots: string[];
  averageTransitMinutes: number;
}

interface ResourceDepotDrawerProps {
  depot: ResourceDepotInfo | null;
  onClose: () => void;
}

export function ResourceDepotDrawer({ depot, onClose }: ResourceDepotDrawerProps) {
  const { showToast } = useAegisFlow();

  if (!depot) return null;

  return (
    <Drawer
      isOpen={!!depot}
      onClose={onClose}
      title="RESOURCE DEPOT TELEMETRY"
      subtitle={`${depot.name} • Logistics Operations Staging Center`}
      width="md"
    >
      <div className="space-y-5 font-mono text-xs">
        {/* Header Hero */}
        <div className="p-3.5 rounded bg-surface-elevated border border-border space-y-1">
          <div className="flex items-center justify-between">
            <Badge variant="info">FORWARD LOGISTICS BASE</Badge>
            <span className="text-[10px] text-text-dim flex items-center gap-1">
              <Clock className="w-3 h-3 text-ops-cyan" />
              <span>Transit: ~{depot.averageTransitMinutes} mins</span>
            </span>
          </div>
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mt-1">
            {depot.name}
          </h3>
          <p className="text-[11px] text-text-secondary">
            Primary Sector: <strong className="text-ops-cyan">{depot.location}</strong>
          </p>
        </div>

        {/* Staged Inventory Breakdown */}
        <div className="space-y-2">
          <div className="text-[10px] uppercase text-text-dim font-bold tracking-wider flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-ops-amber" />
            <span>Currently Staged Asset Inventory</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded bg-surface-subtle border border-border">
              <div className="text-[10px] text-text-muted">Inflatable Boats</div>
              <div className="text-sm font-bold text-ops-cyan mt-0.5">
                {depot.staged.boats} Units
              </div>
            </div>

            <div className="p-2.5 rounded bg-surface-subtle border border-border">
              <div className="text-[10px] text-text-muted">Food & Ration Kits</div>
              <div className="text-sm font-bold text-ops-amber mt-0.5">
                {depot.staged.foodKits.toLocaleString("en-IN")} Kits
              </div>
            </div>

            <div className="p-2.5 rounded bg-surface-subtle border border-border">
              <div className="text-[10px] text-text-muted">Medical Units</div>
              <div className="text-sm font-bold text-ops-emerald mt-0.5">
                {depot.staged.medicalTeams} Mobile Teams
              </div>
            </div>

            <div className="p-2.5 rounded bg-surface-subtle border border-border">
              <div className="text-[10px] text-text-muted">NDRF Rescue Squads</div>
              <div className="text-sm font-bold text-ops-crimson mt-0.5">
                {depot.staged.rescueTeams} Battalions
              </div>
            </div>
          </div>
        </div>

        {/* Supported Priority Hotspots */}
        <div className="space-y-2">
          <div className="text-[10px] uppercase text-text-dim font-bold tracking-wider flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-ops-cyan" />
            <span>Direct Deployment Corridors</span>
          </div>

          <div className="p-3 rounded bg-surface-elevated border border-border space-y-1.5">
            <div className="text-text-secondary text-[11px]">
              Designated to rapidly mobilize toward high-risk flood sectors:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {depot.supportedHotspots.map((spot) => (
                <span
                  key={spot}
                  className="px-2 py-0.5 rounded bg-surface-subtle text-text-primary border border-border text-[10px]"
                >
                  {spot}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center gap-3">
          <Link href="/response-plan" className="flex-1" onClick={onClose}>
            <Button variant="primary" size="md" className="w-full gap-2">
              <span>View In Response Routing</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="md"
            onClick={() => {
              showToast({
                title: "Depot Staging Verified",
                message: `${depot.name} inventory verified ready for commander dispatch.`,
                type: "info",
              });
              onClose();
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-ops-emerald" />
            Verify
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
