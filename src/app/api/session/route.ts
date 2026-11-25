import { NextRequest } from "next/server";
import { AuthError, clearDemoSessionCookie, createDemoUser, demoSessionCookie, errorResponse, isDemoMode, requireUser } from "@/lib/server/auth";
import { registerDemoUser } from "@/lib/server/store";
import type { UserRole } from "@/lib/types";

const roles: UserRole[] = ["ambulance", "road-user", "admin"];

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    return Response.json({ user, demo: Boolean(user.demo) });
  } catch (error) {
    if (error instanceof AuthError && error.status === 401) return Response.json({ user: null });
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  if (!isDemoMode) return Response.json({ error: "Demo sign-in is disabled. Use your Firebase account." }, { status: 403 });
  try {
    const body = await request.json() as { name?: string; role?: UserRole };
    if (!body.name?.trim() || !body.role || !roles.includes(body.role)) {
      return Response.json({ error: "Enter a name and choose a dashboard role." }, { status: 400 });
    }
    const user = await createDemoUser(body.name, body.role);
    await registerDemoUser(user);
    return Response.json({ user }, { headers: { "Set-Cookie": demoSessionCookie(user) } });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE() {
  return Response.json({ ok: true }, { headers: { "Set-Cookie": clearDemoSessionCookie() } });
}
