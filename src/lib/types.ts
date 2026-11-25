export type UserRole = "ambulance" | "road-user" | "admin";
export type GpsMode = "live" | "simulated";
export type Point = { lat: number; lng: number };

export type AppUser = {
  uid: string;
  name: string;
  email?: string;
  role: UserRole;
  demo?: boolean;
};

export type UserLocation = Point & {
  uid: string;
  name: string;
  role: UserRole;
  heading?: number | null;
  updatedAt: number;
  simulated?: boolean;
};

export type Emergency = {
  id: string;
  ambulanceId: string;
  ambulanceName: string;
  status: "active" | "closed";
  mode: GpsMode;
  route: Point[];
  routeName: string;
  currentSegment: number;
  createdAt: number;
  updatedAt: number;
};

export type AlertLog = {
  id: string;
  emergencyId: string;
  ambulanceId: string;
  userId: string;
  userName: string;
  distanceMeters: number;
  status: "in-app" | "sent" | "failed";
  channel: "in-app" | "push";
  createdAt: number;
};

export type DashboardSnapshot = {
  user: AppUser;
  locations: UserLocation[];
  emergencies: Emergency[];
  alerts: AlertLog[];
  firebaseConfigured: boolean;
};

export const ROLE_LABELS: Record<UserRole, string> = {
  ambulance: "Ambulance crew",
  "road-user": "Road user",
  admin: "Admin",
};
