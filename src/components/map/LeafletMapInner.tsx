"use client";

import React from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";

interface LeafletMapInnerProps {
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
  children?: React.ReactNode;
}

export default function LeafletMapInner({
  center = [26.4, 93.2],
  zoom = 8,
  interactive = true,
  children,
}: LeafletMapInnerProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={false}
      scrollWheelZoom={interactive}
      dragging={interactive}
      doubleClickZoom={interactive}
      className="w-full h-full rounded"
      attributionControl={true}
    >
      <TileLayer
        attribution="&copy; CARTO &copy; OpenStreetMap | Assam Hydro-GIS"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        maxZoom={18}
        minZoom={6}
      />
      {interactive && <ZoomControl position="bottomright" />}
      {children}
    </MapContainer>
  );
}
