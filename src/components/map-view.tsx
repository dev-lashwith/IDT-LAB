"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { Emergency, Point, UserLocation } from "@/lib/types";
import { DEMO_ROUTE } from "@/lib/demo-route";

function markerIcon(label: string, className: string) {
  return L.divIcon({ className: `marker-wrap ${className}`, html: `<span class="map-marker">${label}</span>`, iconSize: [34, 42], iconAnchor: [17, 34] });
}

const ambulanceIcon = markerIcon("✚", "marker-ambulance");
const roadIcon = markerIcon("•", "marker-road-user");

function Recenter({ points }: { points: Point[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) map.setView([points[0].lat, points[0].lng], 15);
    else map.fitBounds(points.map((point) => [point.lat, point.lng] as [number, number]), { padding: [44, 44], maxZoom: 15 });
  }, [map, points]);
  return null;
}

export function MapView({
  locations, emergencies, focus,
}: { locations: UserLocation[]; emergencies: Emergency[]; focus?: Point | null }) {
  const route = emergencies.find((emergency) => emergency.status === "active")?.route || DEMO_ROUTE;
  const points = [
    ...locations.map((location) => ({ lat: location.lat, lng: location.lng })),
    ...(focus ? [focus] : []),
  ];
  return (
    <MapContainer center={[route[0].lat, route[0].lng]} zoom={14} scrollWheelZoom className="map-canvas">
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={route.map((point) => [point.lat, point.lng])} pathOptions={{ color: "#e6a23c", weight: 5, opacity: 0.86, dashArray: "11 8" }} />
      {locations.map((location) => location.role === "ambulance" ? (
        <Marker key={location.uid} position={[location.lat, location.lng]} icon={ambulanceIcon}>
          <Popup><b>{location.name}</b><br />Ambulance · {location.simulated ? "simulated GPS" : "live GPS"}</Popup>
        </Marker>
      ) : (
        <Marker key={location.uid} position={[location.lat, location.lng]} icon={roadIcon}>
          <Popup><b>{location.name}</b><br />Road user · {location.simulated ? "demo position" : "sharing location"}</Popup>
        </Marker>
      ))}
      {focus && <CircleMarker center={[focus.lat, focus.lng]} radius={9} pathOptions={{ color: "#287b72", fillColor: "#71c8b2", fillOpacity: 0.8, weight: 3 }} />}
      <Recenter points={points.length ? points : route} />
    </MapContainer>
  );
}
