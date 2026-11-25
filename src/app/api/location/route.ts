import { NextRequest } from "next/server";
import { errorResponse, isRole, requireUser } from "@/lib/server/auth";
import { writeLocation } from "@/lib/server/store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    if (!isRole(user.role, ["ambulance", "road-user"])) return Response.json({ error: "Only ambulance and road-user accounts can share location." }, { status: 403 });
    const body = await request.json() as {
      lat?: number; lng?: number; heading?: number | null; simulated?: boolean;
      emergencyId?: string; segment?: number;
    };
    if (typeof body.lat !== "number" || !Number.isFinite(body.lat) || body.lat < -90 || body.lat > 90 ||
        typeof body.lng !== "number" || !Number.isFinite(body.lng) || body.lng < -180 || body.lng > 180) {
      return Response.json({ error: "A valid latitude and longitude are required." }, { status: 400 });
    }
    if (user.role === "ambulance" && !body.emergencyId) {
      return Response.json({ error: "Start an emergency before sharing an ambulance location." }, { status: 400 });
    }
    const result = await writeLocation({
      user, point: { lat: body.lat, lng: body.lng }, heading: body.heading,
      simulated: Boolean(body.simulated), emergencyId: body.emergencyId, segment: body.segment,
    });
    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
