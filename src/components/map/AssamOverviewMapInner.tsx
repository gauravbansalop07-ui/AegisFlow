"use client";

import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  CircleMarker,
  Polyline,
  Polygon,
  Tooltip as LeafletTooltip,
} from "react-leaflet";
import {
  District,
  Incident,
  Shelter,
  HazardGauge,
  InundationPolygon,
  RoutingEngineResult,
  RouteOption,
} from "@/types";
import { ShieldAlert, Eye, EyeOff, Waves, Navigation, AlertTriangle } from "lucide-react";

// River GIS Coordinates (Brahmaputra Basin System)
const BRAHMAPUTRA_MAIN: [number, number][] = [
  [27.85, 95.6],
  [27.75, 95.3],
  [27.52, 94.95],
  [27.15, 94.45],
  [26.96, 94.22],
  [26.85, 93.8],
  [26.62, 92.85],
  [26.25, 91.82],
  [26.17, 91.68],
  [26.1, 90.6],
  [26.0, 89.98],
];

const SUBANSIRI_TRIBUTARY: [number, number][] = [
  [27.65, 94.25],
  [27.35, 94.15],
  [27.02, 94.03],
  [26.88, 93.92],
];

const BARAK_RIVER: [number, number][] = [
  [24.95, 93.1],
  [24.83, 92.78],
  [24.78, 92.45],
  [24.88, 92.2],
];

const KOPILI_RIVER: [number, number][] = [
  [25.6, 92.65],
  [25.9, 92.75],
  [26.15, 92.81],
  [26.35, 92.7],
];

const BEKI_RIVER: [number, number][] = [
  [26.8, 91.0],
  [26.6, 90.95],
  [26.45, 90.93],
  [26.25, 90.88],
];

interface LayerVisibility {
  floodExtent: boolean;
  hazards: boolean;
  shelters: boolean;
  resources: boolean;
  rivers: boolean;
  gauges: boolean;
  evacuationRoutes: boolean;
}

interface AssamOverviewMapInnerProps {
  districts: District[];
  incidents: Incident[];
  shelters: Shelter[];
  gauges: HazardGauge[];
  inundationPolygons?: InundationPolygon[];
  routingResult?: RoutingEngineResult | null;
  selectedRouteOption?: RouteOption | null;
  onSelectIncident?: (incident: Incident) => void;
  onSelectDistrict?: (district: District) => void;
}

export default function AssamOverviewMapInner({
  districts,
  incidents,
  shelters,
  gauges,
  inundationPolygons = [],
  routingResult = null,
  selectedRouteOption = null,
  onSelectIncident = () => {},
  onSelectDistrict = () => {},
}: AssamOverviewMapInnerProps) {
  const [layers, setLayers] = useState<LayerVisibility>({
    floodExtent: true,
    hazards: true,
    shelters: true,
    resources: true,
    rivers: true,
    gauges: true,
    evacuationRoutes: true,
  });

  const [showLayerPanel, setShowLayerPanel] = useState(true);

  const getRiskColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "critical":
        return { stroke: "#EF4444", fill: "#DC2626" };
      case "high":
        return { stroke: "#F59E0B", fill: "#D97706" };
      case "moderate":
        return { stroke: "#6366F1", fill: "#4F46E5" };
      case "safe":
      case "low":
      default:
        return { stroke: "#10B981", fill: "#059669" };
    }
  };

  const centerCoords: [number, number] =
    routingResult && routingResult.originId === "majuli"
      ? [26.945, 94.2]
      : [26.4, 93.2];

  const initialZoom = routingResult ? 11 : 7.5;

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={centerCoords}
        zoom={initialZoom}
        zoomControl={false}
        scrollWheelZoom={true}
        className="w-full h-full rounded"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap | Brahmaputra Basin'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={18}
          minZoom={6}
        />
        <ZoomControl position="bottomright" />

        {/* 1. Dynamic Inundation Flood Extent Polygons */}
        {layers.floodExtent &&
          inundationPolygons.map((polygon) => {
            const isCrit = polygon.severity === "critical";
            const isHigh = polygon.severity === "high";

            return (
              <Polygon
                key={polygon.id}
                positions={polygon.coordinates}
                pathOptions={{
                  color: isCrit ? "#EF4444" : isHigh ? "#F59E0B" : "#06B6D4",
                  fillColor: isCrit ? "#DC2626" : isHigh ? "#D97706" : "#0891B2",
                  fillOpacity: isCrit ? 0.45 : isHigh ? 0.35 : 0.22,
                  weight: 1.5,
                  dashArray: isCrit ? undefined : "3, 3",
                }}
              >
                <LeafletTooltip direction="center" sticky>
                  <div className="p-1 font-mono text-xs">
                    <div className="font-bold text-ops-cyan uppercase text-[11px]">
                      {polygon.name}
                    </div>
                    <div className="text-[10px] text-text-secondary mt-0.5">
                      Simulated Inundation: <strong className="text-ops-crimson">{polygon.inundationDepthM}m Depth</strong>
                    </div>
                    <div className="text-[9px] text-text-muted">
                      Estimated Water Spread: {polygon.waterSurfaceAreaSqKm} sq km
                    </div>
                  </div>
                </LeafletTooltip>
              </Polygon>
            );
          })}

        {/* 2. River Network Layer */}
        {layers.rivers && (
          <>
            <Polyline
              positions={BRAHMAPUTRA_MAIN}
              pathOptions={{
                color: "#06B6D4",
                weight: 4,
                opacity: 0.85,
                lineCap: "round",
                lineJoin: "round",
              }}
            >
              <LeafletTooltip direction="top" sticky>
                <div className="text-xs font-mono font-bold text-ops-cyan">
                  Brahmaputra River Main Basin Corridor
                </div>
              </LeafletTooltip>
            </Polyline>

            <Polyline
              positions={SUBANSIRI_TRIBUTARY}
              pathOptions={{ color: "#38BDF8", weight: 2.5, opacity: 0.75 }}
            />
            <Polyline
              positions={BARAK_RIVER}
              pathOptions={{ color: "#38BDF8", weight: 2.5, opacity: 0.75 }}
            />
            <Polyline
              positions={KOPILI_RIVER}
              pathOptions={{ color: "#38BDF8", weight: 2, opacity: 0.7 }}
            />
            <Polyline
              positions={BEKI_RIVER}
              pathOptions={{ color: "#38BDF8", weight: 2, opacity: 0.7 }}
            />
          </>
        )}

        {/* 3. Phase 7: Road Network Graph & Dynamic Evacuation Routes */}
        {layers.evacuationRoutes && routingResult && (
          <>
            {/* 3a. Background Road Network Segments */}
            {routingResult.allSegments.map((road) => {
              const isFlooded = road.status === "flooded" || road.status === "blocked";
              const isAtRisk = road.status === "at_risk";

              return (
                <Polyline
                  key={road.id}
                  positions={road.waypoints}
                  pathOptions={{
                    color: isFlooded ? "#EF4444" : isAtRisk ? "#F59E0B" : "#475569",
                    weight: isFlooded ? 4 : isAtRisk ? 3 : 2,
                    dashArray: isFlooded ? "6, 6" : undefined,
                    opacity: isFlooded ? 0.9 : 0.7,
                  }}
                >
                  <LeafletTooltip direction="top" sticky>
                    <div className="p-1 font-mono text-xs">
                      <div className="font-bold uppercase text-text-primary">
                        {road.name} ({road.code})
                      </div>
                      <div className="text-[10px] text-text-secondary mt-0.5">
                        Status:{" "}
                        <strong
                          className={
                            isFlooded ? "text-ops-crimson" : isAtRisk ? "text-ops-amber" : "text-ops-emerald"
                          }
                        >
                          {road.status.toUpperCase()}
                        </strong>{" "}
                        • Depth: {road.inundationDepthM}m
                      </div>
                      <div className="text-[9px] text-text-muted">
                        Elev: {road.elevationM}m • {road.distanceKm} km
                      </div>
                    </div>
                  </LeafletTooltip>
                </Polyline>
              );
            })}

            {/* 3b. Active Recommended Route Highlight */}
            {routingResult.recommendedRoute && (
              <Polyline
                positions={routingResult.recommendedRoute.waypoints}
                pathOptions={{
                  color: "#06B6D4",
                  weight: 6,
                  opacity: 0.95,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              >
                <LeafletTooltip direction="top" sticky>
                  <div className="p-1.5 font-mono text-xs bg-surface-elevated border border-ops-cyan rounded">
                    <div className="font-bold text-ops-cyan uppercase flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5" />
                      <span>RECOMMENDED: {routingResult.recommendedRoute.name}</span>
                    </div>
                    <div className="text-[10px] text-text-primary mt-0.5">
                      Est. Time: {routingResult.recommendedRoute.estimatedMinutes} mins ({routingResult.recommendedRoute.totalDistanceKm} km)
                    </div>
                  </div>
                </LeafletTooltip>
              </Polyline>
            )}

            {/* 3c. Origin Beacon Marker */}
            {routingResult.recommendedRoute && routingResult.recommendedRoute.waypoints.length > 0 && (
              <CircleMarker
                center={routingResult.recommendedRoute.waypoints[0]}
                radius={9}
                pathOptions={{
                  color: "#EF4444",
                  fillColor: "#DC2626",
                  fillOpacity: 0.9,
                  weight: 3,
                }}
              >
                <LeafletTooltip direction="top" permanent>
                  <span className="font-mono text-[10px] font-bold text-ops-crimson">
                    EVACUATION ORIGIN
                  </span>
                </LeafletTooltip>
              </CircleMarker>
            )}
          </>
        )}

        {/* 4. River Gauge Markers */}
        {layers.gauges &&
          gauges.map((gauge) => {
            const isCrit = gauge.status === "critical";
            const isAbove = gauge.status === "above_danger";
            const color = isCrit ? "#EF4444" : isAbove ? "#F59E0B" : "#06B6D4";

            return (
              <CircleMarker
                key={gauge.id}
                center={gauge.coordinates}
                radius={isCrit ? 9 : 7}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.9,
                  weight: 2,
                }}
              >
                <LeafletTooltip direction="top" offset={[0, -8]}>
                  <div className="p-1 font-mono text-xs">
                    <div className="font-bold text-text-primary flex items-center gap-1">
                      <Waves className="w-3 h-3 text-ops-cyan" />
                      <span>{gauge.stationName}</span>
                    </div>
                    <div className="text-[10px] text-text-secondary mt-0.5">
                      Level: <strong style={{ color }}>{gauge.currentLevelM}m</strong> ({gauge.status.replace("_", " ").toUpperCase()})
                    </div>
                  </div>
                </LeafletTooltip>
              </CircleMarker>
            );
          })}

        {/* 5. District Risk Hotspot Markers */}
        {layers.hazards &&
          districts.map((district) => {
            const colors = getRiskColor(district.currentRiskLevel);
            const isCritical = district.currentRiskLevel === "critical";

            return (
              <CircleMarker
                key={district.id}
                center={district.coordinates}
                radius={isCritical ? 14 : 10}
                pathOptions={{
                  color: colors.stroke,
                  fillColor: colors.fill,
                  fillOpacity: 0.75,
                  weight: isCritical ? 3 : 2,
                }}
                eventHandlers={{
                  click: () => onSelectDistrict(district),
                }}
              >
                <LeafletTooltip direction="top" offset={[0, -10]}>
                  <div className="p-1 font-mono text-xs">
                    <div className="font-bold uppercase tracking-wider text-text-primary">
                      {district.name} ({district.code})
                    </div>
                    <div className="text-[10px] text-text-secondary mt-0.5">
                      Hazard: <span style={{ color: colors.stroke }} className="font-bold uppercase">{district.currentRiskLevel}</span>
                    </div>
                  </div>
                </LeafletTooltip>
              </CircleMarker>
            );
          })}

        {/* 6. Relief Shelter Markers */}
        {layers.shelters &&
          shelters.map((shelter) => (
            <CircleMarker
              key={shelter.id}
              center={shelter.coordinates}
              radius={8}
              pathOptions={{
                color: "#10B981",
                fillColor: "#059669",
                fillOpacity: 0.9,
                weight: 2,
              }}
            >
              <LeafletTooltip direction="top" offset={[0, -8]}>
                <div className="p-1 font-mono text-xs">
                  <div className="font-bold text-ops-emerald">Relief Camp: {shelter.name}</div>
                  <div className="text-[10px] text-text-secondary mt-0.5">
                    Capacity: {shelter.currentOccupancy} / {shelter.capacity} ({shelter.status.toUpperCase()})
                  </div>
                </div>
              </LeafletTooltip>
            </CircleMarker>
          ))}

        {/* 7. Resource Depots Markers */}
        {layers.resources && (
          <>
            <CircleMarker
              center={[26.75, 94.22]} // Jorhat Forward Base
              radius={6}
              pathOptions={{
                color: "#F59E0B",
                fillColor: "#D97706",
                fillOpacity: 0.85,
                weight: 1.5,
              }}
            />
            <CircleMarker
              center={[26.18, 91.74]} // Guwahati Central Base
              radius={6}
              pathOptions={{
                color: "#6366F1",
                fillColor: "#4F46E5",
                fillOpacity: 0.85,
                weight: 1.5,
              }}
            />
          </>
        )}
      </MapContainer>

      {/* Floating Tactical Map Legend & Layer Controls */}
      <div className="absolute top-3 left-3 z-[1000] bg-surface/90 backdrop-blur-md border border-border-strong rounded shadow-ops-lg p-3 font-mono text-xs select-none max-w-[220px]">
        <div className="flex items-center justify-between pb-2 border-b border-border/80 mb-2">
          <span className="font-bold text-text-primary text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-ops-cyan" />
            <span>Map Layers</span>
          </span>
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className="text-text-muted hover:text-text-primary"
            title="Toggle panel"
          >
            {showLayerPanel ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </button>
        </div>

        {showLayerPanel && (
          <div className="space-y-2.5">
            {/* Risk Legend */}
            <div>
              <div className="text-[9px] uppercase tracking-wider text-text-dim mb-1 font-bold">
                Hazard Classification
              </div>
              <div className="space-y-1 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-ops-crimson shrink-0" />
                  <span className="text-text-primary">Critical (Score 80-100)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-ops-amber shrink-0" />
                  <span className="text-text-secondary">High (Score 60-79)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-ops-indigo shrink-0" />
                  <span className="text-text-secondary">Moderate (Score 40-59)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-ops-emerald shrink-0" />
                  <span className="text-text-secondary">Safe / Low (Score &lt;40)</span>
                </div>
              </div>
            </div>

            {/* Layer Toggles */}
            <div className="pt-2 border-t border-border/60">
              <div className="text-[9px] uppercase tracking-wider text-text-dim mb-1.5 font-bold">
                Geospatial Layers
              </div>
              <div className="space-y-1 text-[10px]">
                <label className="flex items-center justify-between cursor-pointer hover:text-ops-cyan transition-colors">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded bg-ops-cyan" />
                    <span>Inundation Zones</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={layers.floodExtent}
                    onChange={(e) => setLayers({ ...layers, floodExtent: e.target.checked })}
                    className="accent-ops-cyan cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:text-ops-cyan transition-colors">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-ops-cyan" />
                    <span>Evacuation Routes</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={layers.evacuationRoutes}
                    onChange={(e) => setLayers({ ...layers, evacuationRoutes: e.target.checked })}
                    className="accent-ops-cyan cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:text-ops-cyan transition-colors">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-ops-crimson" />
                    <span>District Hotspots</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={layers.hazards}
                    onChange={(e) => setLayers({ ...layers, hazards: e.target.checked })}
                    className="accent-ops-cyan cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:text-ops-cyan transition-colors">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-ops-emerald" />
                    <span>Relief Camps</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={layers.shelters}
                    onChange={(e) => setLayers({ ...layers, shelters: e.target.checked })}
                    className="accent-ops-cyan cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
