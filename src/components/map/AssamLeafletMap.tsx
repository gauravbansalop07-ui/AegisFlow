"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

interface AssamLeafletMapProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
  children?: React.ReactNode;
}

const DynamicMap = dynamic(() => import("./LeafletMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-surface border border-border rounded">
      <Loader2 className="w-6 h-6 text-ops-cyan animate-spin mb-2" />
      <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
        Initializing Assam Hydro-GIS Layer...
      </span>
    </div>
  ),
});

export function AssamLeafletMap({
  className = "w-full h-[400px]",
  center = [26.4, 93.2],
  zoom = 8,
  interactive = true,
  children,
}: AssamLeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={`relative ${className} flex items-center justify-center bg-surface border border-border rounded min-h-[300px]`}>
        <Loader2 className="w-6 h-6 text-ops-cyan animate-spin mb-2" />
      </div>
    );
  }

  return (
    <div className={`relative ${className} border border-border rounded overflow-hidden shadow-ops-md`}>
      <DynamicMap center={center} zoom={zoom} interactive={interactive}>
        {children}
      </DynamicMap>
    </div>
  );
}
