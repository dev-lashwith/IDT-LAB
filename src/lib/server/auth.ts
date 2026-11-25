import "server-only";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { adminAuth, adminDb, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import type { AppUser, UserRole } from "@/lib/types";

const DEMO_COOKIE = "ambulance_demo_session";
const roles: UserRole[] = ["ambulance", "road-user", "admin"];
const isProduction = process.env.NODE_ENV === "production";
export const isDemoMode = !isFirebaseAdminConfigured() && !isProduction && process.env.DEMO_MODE !== "false";

function demoSecret() {
  return process.env.DEMO_SESSION_SECRET || "local-demo-only-change-before-deploying";
}

function sign(value: string) {
  return createHmac("sha256", demoSecret()).update(value).digest("base64url");
}

function safeCompare(a: string, b: string) {
  const first = Buffer.from(a);
  const second = Buffer.from(b);
  return first.length === second.length && timingSafeEqual(first, second);
}

function serializeDemoUser(user: AppUser) {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function readDemoUser(request: NextRequest): AppUser | null {
  const value = request.cookies.get(DEMO_COOKIE)?.value;
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature || !safeCompare(sign(payload), signature)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AppUser;
    return parsed.uid && roles.includes(parsed.role) ? parsed : null;
  } catch {
    return null;
  }
}

export function demoSessionCookie(user: AppUser) {
  const secure = isProduction ? "; Secure" : "";
  return `${DEMO_COOKIE}=${serializeDemoUser(user)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200${secure}`;
}

export function clearDemoSessionCookie() {
  const secure = isProduction ? "; Secure" : "";
  return `${DEMO_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export async function createDemoUser(name: string, role: UserRole): Promise<AppUser> {
  return { uid: `demo_${randomUUID()}`, name: name.trim().slice(0, 48), role, demo: true };
}

export async function requireUser(request: NextRequest): Promise<AppUser> {
  if (isFirebaseAdminConfigured()) {
    const header = request.headers.get("authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) throw new AuthError("Sign in to continue.", 401);
    try {
      const decoded = await adminAuth().verifyIdToken(token);
      const profile = await adminDb().collection("users").doc(decoded.uid).get();
      const email = decoded.email || undefined;
      const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
      const configuredRole = email && adminEmails.includes(email.toLowerCase()) ? "admin" : decoded.role || profile.get("role");
      const role: UserRole = roles.includes(configuredRole as UserRole) ? configuredRole as UserRole : "road-user";
      return {
        uid: decoded.uid,
        email,
        name: profile.get("name") || decoded.name || email?.split("@")[0] || "Account",
        role,
      };
    } catch {
      throw new AuthError("Your sign-in has expired. Sign in again.", 401);
    }
  }
  if (isDemoMode) {
    const user = readDemoUser(request);
    if (user) return user;
    throw new AuthError("Open a demo dashboard to start a session.", 401);
  }
  throw new AuthError("Firebase server credentials are required.", 503);
}

export class AuthError extends Error {
  constructor(message: string, public status = 401) {
    super(message);
  }
}

export function isRole(role: string, allowed: UserRole[]) {
  return allowed.includes(role as UserRole);
}

export function errorResponse(error: unknown) {
  if (error instanceof AuthError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error("API request failed", error);
  return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}
