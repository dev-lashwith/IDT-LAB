import type { Point } from "@/lib/types";

// A short, repeatable city-center route for the college demo. Road-user demo
// positions sit beside this path so the corridor alert can be shown reliably.
export const DEMO_ROUTE_NAME = "Central Delhi demo route";
export const DEMO_ROUTE: Point[] = [
  { lat: 28.6315, lng: 77.2191 },
  { lat: 28.6282, lng: 77.2188 },
  { lat: 28.6240, lng: 77.2190 },
  { lat: 28.6205, lng: 77.2194 },
  { lat: 28.6170, lng: 77.2200 },
  { lat: 28.6143, lng: 77.2214 },
  { lat: 28.6126, lng: 77.2248 },
  { lat: 28.6127, lng: 77.2288 },
];

export const DEMO_ROADSIDE_POINTS: Point[] = [
  { lat: 28.6250, lng: 77.2202 },
  { lat: 28.6178, lng: 77.2208 },
  { lat: 28.6128, lng: 77.2260 },
];
