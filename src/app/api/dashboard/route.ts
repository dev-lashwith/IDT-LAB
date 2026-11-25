import { NextRequest } from "next/server";
import { errorResponse, requireUser } from "@/lib/server/auth";
import { getDashboardSnapshot } from "@/lib/server/store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    return Response.json(await getDashboardSnapshot(user));
  } catch (error) {
    return errorResponse(error);
  }
}
