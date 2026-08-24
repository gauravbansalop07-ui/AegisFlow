"use client";

import React from "react";
import dynamic from "next/dynamic";
import { District, Incident, Shelter, HazardGauge, InundationPolygon, RoutingEngineResult, RouteOption } from "@/types";

interface AssamOverviewMapProps {
  districts: District[];
  incidents: Incident[];
  shelters: Shelter[];
  gauges: HazardGauge[];
  inundationPolygons?: InundationPolygon[];
  routingResult?: RoutingEngineResult | null;
  selectedRouteOption?: RouteOption | null;
  className?: string;
  onSelectIncident?: (incident: Incident) => void;
  onSelectDistrict?: (district: District) => void;
}

const DynamicAssamMapInner = dynamic(
  () => import("./AssamOverviewMapInner"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-surface-elevated flex items-center justify-center font-mono text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-ops-cyan border-t-transparent animate-spin" />
          <span>INITIALIZING BRAHMAPUTRA GIS TELEMETRY...</span>
        </div>
      </div>
    ),
  }
);

export function AssamOverviewMap({
  districts,
  incidents,
  shelters,
  gauges,
  inundationPolygons = [],
  routingResult = null,
  selectedRouteOption = null,
  className = "w-full h-[500px]",
  onSelectIncident = () => {},
  onSelectDistrict = () => {},
}: AssamOverviewMapProps) {
  return (
    <div className={`relative rounded border border-border overflow-hidden bg-surface ${className}`}>
      <DynamicAssamMapInner
        districts={districts}
        incidents={incidents}
        shelters={shelters}
        gauges={gauges}
        inundationPolygons={inundationPolygons}
        routingResult={routingResult}
        selectedRouteOption={selectedRouteOption}
        onSelectIncident={onSelectIncident}
        onSelectDistrict={onSelectDistrict}
      />
    </div>
  );
}
