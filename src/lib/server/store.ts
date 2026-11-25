import "server-only";
import { randomUUID } from "node:crypto";
import { DEMO_ROADSIDE_POINTS, DEMO_ROUTE, DEMO_ROUTE_NAME } from "@/lib/demo-route";
import { findCorridorCandidates } from "@/lib/geospatial";
import { adminDb, adminMessaging, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import type { AlertLog, AppUser, DashboardSnapshot, Emergency, GpsMode, Point, UserLocation } from "@/lib/types";

type DemoState = { locations: Map<string, UserLocation>; emergencies: Map<string, Emergency>; alerts: Map<string, AlertLog>; tokens: Map<string, string>; roadsideIndex: number };
const root = globalThis as typeof globalThis & { __ambulanceDemoState?: DemoState };
const demoState = root.__ambulanceDemoState ??= {
  locations: new Map(), emergencies: new Map(), alerts: new Map(), tokens: new Map(), roadsideIndex: 0,
};

function now() { return Date.now(); }
function storeInFirebase() { return isFirebaseAdminConfigured(); }

export async function registerDemoUser(user: AppUser) {
  if (storeInFirebase()) return;
  if (user.role === "road-user") {
    const point = DEMO_ROADSIDE_POINTS[demoState.roadsideIndex % DEMO_ROADSIDE_POINTS.length];
    demoState.roadsideIndex += 1;
    demoState.locations.set(user.uid, {
      ...point, uid: user.uid, name: user.name, role: user.role,
      updatedAt: now(), simulated: true,
    });
  }
}

export async function createEmergency(user: AppUser, mode: GpsMode): Promise<Emergency> {
  const existing = (await listEmergencies()).find((item) => item.ambulanceId === user.uid && item.status === "active");
  if (existing) return existing;
  const emergency: Emergency = {
    id: randomUUID(), ambulanceId: user.uid, ambulanceName: user.name, status: "active",
    mode, route: DEMO_ROUTE, routeName: DEMO_ROUTE_NAME, currentSegment: 0, createdAt: now(), updatedAt: now(),
  };
  if (storeInFirebase()) {
    const reference = adminDb().collection("emergencies").doc();
    emergency.id = reference.id;
    await reference.set(emergency);
  } else demoState.emergencies.set(emergency.id, emergency);
  return emergency;
}

export async function closeEmergency(user: AppUser, emergencyId: string) {
  const emergency = await getEmergency(emergencyId);
  if (!emergency || emergency.ambulanceId !== user.uid) return false;
  const closed = { ...emergency, status: "closed" as const, updatedAt: now() };
  if (storeInFirebase()) await adminDb().collection("emergencies").doc(emergencyId).set(closed);
  else demoState.emergencies.set(emergencyId, closed);
  return true;
}

async function getEmergency(id: string): Promise<Emergency | undefined> {
  if (storeInFirebase()) {
    const document = await adminDb().collection("emergencies").doc(id).get();
    return document.exists ? document.data() as Emergency : undefined;
  }
  return demoState.emergencies.get(id);
}

async function listEmergencies(): Promise<Emergency[]> {
  if (storeInFirebase()) {
    const result = await adminDb().collection("emergencies").get();
    return result.docs.map((document) => document.data() as Emergency);
  }
  return [...demoState.emergencies.values()];
}

async function listLocations(): Promise<UserLocation[]> {
  if (storeInFirebase()) {
    const result = await adminDb().collection("locations").get();
    return result.docs.map((document) => document.data() as UserLocation);
  }
  return [...demoState.locations.values()];
}

export async function writeLocation(args: {
  user: AppUser; point: Point; heading?: number | null; simulated: boolean;
  emergencyId?: string; segment?: number;
}): Promise<{ location: UserLocation; alertsCreated: number }> {
  let activeEmergency: Emergency | undefined;
  if (args.user.role === "ambulance") {
    if (!args.emergencyId) throw new Error("Start an emergency before sharing an ambulance location.");
    activeEmergency = await getEmergency(args.emergencyId);
    if (!activeEmergency || activeEmergency.status !== "active" || activeEmergency.ambulanceId !== args.user.uid) {
      throw new Error("Active emergency not found for this ambulance account.");
    }
  }
  const location: UserLocation = {
    ...args.point, uid: args.user.uid, name: args.user.name, role: args.user.role,
    heading: args.heading ?? null, updatedAt: now(), simulated: args.simulated,
  };
  if (storeInFirebase()) await adminDb().collection("locations").doc(args.user.uid).set(location);
  else demoState.locations.set(args.user.uid, location);

  if (!activeEmergency) return { location, alertsCreated: 0 };
  const emergency = activeEmergency;
  const requestedSegment = typeof args.segment === "number" && Number.isFinite(args.segment) ? Math.trunc(args.segment) : emergency.currentSegment;
  const segment = Math.max(0, Math.min(emergency.route.length - 2, requestedSegment));
  const updatedEmergency = { ...emergency, mode: args.simulated ? "simulated" as const : "live" as const, currentSegment: segment, updatedAt: now() };
  if (storeInFirebase()) await adminDb().collection("emergencies").doc(emergency.id).set(updatedEmergency);
  else demoState.emergencies.set(emergency.id, updatedEmergency);

  const roadUsers = (await listLocations()).filter((item) => item.role === "road-user" && item.uid !== args.user.uid);
  const candidates = findCorridorCandidates({
    route: emergency.route, current: args.point, currentSegment: segment,
    users: roadUsers.map((item) => ({ uid: item.uid, point: item })),
  });
  let alertsCreated = 0;
  for (const candidate of candidates) {
    const alertId = `${emergency.id}_${candidate.uid}`;
    if (await getAlert(alertId)) continue;
    const roadUser = roadUsers.find((item) => item.uid === candidate.uid);
    if (!roadUser) continue;
    const token = await getFcmToken(candidate.uid);
    let status: AlertLog["status"] = "in-app";
    let channel: AlertLog["channel"] = "in-app";
    if (token && storeInFirebase()) {
      channel = "push";
      try {
        const pushLink = process.env.APP_BASE_URL?.startsWith("https://")
          ? new URL("/road-user", process.env.APP_BASE_URL).toString()
          : undefined;
        await adminMessaging().send({
          token,
          notification: {
            title: "Ambulance approaching",
            body: `An ambulance is about ${candidate.distanceMeters} m away on your route. Please make way when safe.`,
          },
          data: { emergencyId: emergency.id, url: "/road-user" },
          webpush: pushLink ? { fcmOptions: { link: pushLink } } : undefined,
        });
        status = "sent";
      } catch (error) {
        console.error("FCM send failed", error);
        status = "failed";
      }
    }
    const alert: AlertLog = {
      id: alertId, emergencyId: emergency.id, ambulanceId: args.user.uid,
      userId: roadUser.uid, userName: roadUser.name, distanceMeters: candidate.distanceMeters,
      status, channel, createdAt: now(),
    };
    if (storeInFirebase()) await adminDb().collection("alerts").doc(alertId).set(alert);
    else demoState.alerts.set(alertId, alert);
    alertsCreated += 1;
  }
  return { location, alertsCreated };
}

async function getAlert(id: string): Promise<AlertLog | undefined> {
  if (storeInFirebase()) {
    const document = await adminDb().collection("alerts").doc(id).get();
    return document.exists ? document.data() as AlertLog : undefined;
  }
  return demoState.alerts.get(id);
}

async function getFcmToken(uid: string) {
  if (storeInFirebase()) {
    const document = await adminDb().collection("users").doc(uid).get();
    return document.get("fcmToken") as string | undefined;
  }
  return demoState.tokens.get(uid);
}

export async function saveFcmToken(user: AppUser, token: string) {
  if (storeInFirebase()) {
    await adminDb().collection("users").doc(user.uid).set({ name: user.name, role: user.role, fcmToken: token }, { merge: true });
  } else demoState.tokens.set(user.uid, token);
}

export async function getDashboardSnapshot(user: AppUser): Promise<DashboardSnapshot> {
  const [allLocations, allEmergencies, allAlerts] = await Promise.all([
    listLocations(), listEmergencies(), storeInFirebase()
      ? adminDb().collection("alerts").get().then((result) => result.docs.map((document) => document.data() as AlertLog))
      : Promise.resolve([...demoState.alerts.values()]),
  ]);
  const locations = user.role === "admin" ? allLocations
    : user.role === "ambulance" ? allLocations.filter((item) => item.uid === user.uid || item.role === "road-user")
      : allLocations.filter((item) => item.uid === user.uid || item.role === "ambulance");
  const alerts = user.role === "admin" ? allAlerts
    : allAlerts.filter((item) => user.role === "road-user" ? item.userId === user.uid : item.ambulanceId === user.uid);
  return {
    user, locations, emergencies: allEmergencies.filter((item) => user.role === "admin" ? true : item.status === "active" && (user.role !== "ambulance" || item.ambulanceId === user.uid)).sort((a, b) => b.updatedAt - a.updatedAt),
    alerts: alerts.sort((a, b) => b.createdAt - a.createdAt).slice(0, 60), firebaseConfigured: storeInFirebase(),
  };
}
