import { NextRequest } from "next/server";
import { errorResponse, isRole, requireUser } from "@/lib/server/auth";
import { saveFcmToken } from "@/lib/server/store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    if (!isRole(user.role, ["road-user"])) return Response.json({ error: "Push alerts are for road-user accounts." }, { status: 403 });
    const body = await request.json() as { token?: string };
    if (!body.token || body.token.length > 4096) return Response.json({ error: "A valid push token is required." }, { status: 400 });
    await saveFcmToken(user, body.token);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
