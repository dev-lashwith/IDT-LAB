import { NextRequest } from "next/server";
import { errorResponse, isRole, requireUser } from "@/lib/server/auth";
import { createEmergency } from "@/lib/server/store";
import type { GpsMode } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    if (!isRole(user.role, ["ambulance"])) return Response.json({ error: "Only ambulance accounts can start an emergency." }, { status: 403 });
    const body = await request.json() as { mode?: GpsMode };
    const emergency = await createEmergency(user, body.mode === "live" ? "live" : "simulated");
    return Response.json({ emergency });
  } catch (error) {
    return errorResponse(error);
  }
}
