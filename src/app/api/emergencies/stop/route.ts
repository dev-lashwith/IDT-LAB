import { NextRequest } from "next/server";
import { errorResponse, isRole, requireUser } from "@/lib/server/auth";
import { closeEmergency } from "@/lib/server/store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    if (!isRole(user.role, ["ambulance"])) return Response.json({ error: "Only ambulance accounts can end their emergency." }, { status: 403 });
    const body = await request.json() as { emergencyId?: string };
    if (!body.emergencyId) return Response.json({ error: "Emergency id is required." }, { status: 400 });
    const ok = await closeEmergency(user, body.emergencyId);
    return ok ? Response.json({ ok: true }) : Response.json({ error: "Active emergency not found." }, { status: 404 });
  } catch (error) {
    return errorResponse(error);
  }
}
