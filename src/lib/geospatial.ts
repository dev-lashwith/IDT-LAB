import type { Point } from "@/lib/types";

const EARTH_RADIUS_M = 6_371_000;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export function distanceMeters(a: Point, b: Point): number {
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const deltaLat = lat2 - lat1;
  const deltaLng = toRadians(b.lng - a.lng);
  const haversine =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(haversine));
}

function localProjection(point: Point, origin: Point) {
  const metersPerDegreeLat = 111_320;
  const metersPerDegreeLng = 111_320 * Math.cos(toRadians(origin.lat));
  return {
    x: (point.lng - origin.lng) * metersPerDegreeLng,
    y: (point.lat - origin.lat) * metersPerDegreeLat,
  };
}

export type RouteProjection = { crossTrackMeters: number; alongRouteMeters: number };

export function projectOntoRoute(point: Point, route: Point[]): RouteProjection {
  if (route.length < 2) return { crossTrackMeters: Number.POSITIVE_INFINITY, alongRouteMeters: 0 };
  let walkedMeters = 0;
  let best = { crossTrackMeters: Number.POSITIVE_INFINITY, alongRouteMeters: 0 };

  for (let index = 0; index < route.length - 1; index += 1) {
    const start = route[index];
    const end = route[index + 1];
    const p = localProjection(point, start);
    const q = localProjection(end, start);
    const segmentLength = Math.hypot(q.x, q.y);
    const t = segmentLength === 0 ? 0 : Math.max(0, Math.min(1, (p.x * q.x + p.y * q.y) / (segmentLength ** 2)));
    const crossTrackMeters = Math.hypot(p.x - t * q.x, p.y - t * q.y);
    const alongRouteMeters = walkedMeters + t * segmentLength;
    if (crossTrackMeters < best.crossTrackMeters) best = { crossTrackMeters, alongRouteMeters };
    walkedMeters += segmentLength;
  }
  return best;
}

export function routeDistanceAtSegment(route: Point[], segmentIndex: number, location: Point): number {
  const safeIndex = Math.min(Math.max(segmentIndex, 0), route.length - 2);
  let walkedMeters = 0;
  for (let index = 0; index < safeIndex; index += 1) walkedMeters += distanceMeters(route[index], route[index + 1]);
  const segmentProjection = projectOntoRoute(location, [route[safeIndex], route[safeIndex + 1]]);
  return walkedMeters + segmentProjection.alongRouteMeters;
}

export function routeBearing(route: Point[], segmentIndex: number): number {
  const safeIndex = Math.min(Math.max(segmentIndex, 0), route.length - 2);
  const start = route[safeIndex];
  const end = route[safeIndex + 1];
  const lat1 = toRadians(start.lat);
  const lat2 = toRadians(end.lat);
  const deltaLng = toRadians(end.lng - start.lng);
  const y = Math.sin(deltaLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

export function nearestRouteSegment(point: Point, route: Point[]): number {
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let index = 0; index < route.length - 1; index += 1) {
    const projection = projectOntoRoute(point, [route[index], route[index + 1]]);
    if (projection.crossTrackMeters < bestDistance) {
      bestDistance = projection.crossTrackMeters;
      bestIndex = index;
    }
  }
  return bestIndex;
}

export function findCorridorCandidates(args: {
  route: Point[];
  current: Point;
  currentSegment: number;
  users: Array<{ uid: string; point: Point }>;
  corridorMeters?: number;
  lookAheadMeters?: number;
}): Array<{ uid: string; distanceMeters: number }> {
  if (args.route.length < 2) return [];
  const corridorMeters = args.corridorMeters ?? 180;
  const lookAheadMeters = args.lookAheadMeters ?? 1_000;
  const safeSegment = Math.min(Math.max(args.currentSegment, 0), args.route.length - 2);
  const ambulanceCrossTrack = projectOntoRoute(args.current, [args.route[safeSegment], args.route[safeSegment + 1]]).crossTrackMeters;
  if (ambulanceCrossTrack > corridorMeters) return [];
  const ambulanceAlong = routeDistanceAtSegment(args.route, args.currentSegment, args.current);
  return args.users.flatMap((user) => {
    const projected = projectOntoRoute(user.point, args.route);
    const aheadMeters = projected.alongRouteMeters - ambulanceAlong;
    if (projected.crossTrackMeters > corridorMeters || aheadMeters < 40 || aheadMeters > lookAheadMeters) return [];
    return [{ uid: user.uid, distanceMeters: Math.round(aheadMeters) }];
  });
}
