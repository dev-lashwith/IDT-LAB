"use client";

import dynamic from "next/dynamic";
import type { Emergency, Point, UserLocation } from "@/lib/types";

const MapView = dynamic(
  () => import("@/components/map-view").then((module) => module.MapView),
  { ssr: false, loading: () => <div className="map-canvas" style={{ display: "grid", placeItems: "center", color: "#82948a", fontSize: 10 }}>Loading map…</div> },
);

export function DynamicMapView(props: { locations: UserLocation[]; emergencies: Emergency[]; focus?: Point | null }) {
  return <MapView {...props} />;
}
