import { isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { isDemoMode } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ firebaseAdminReady: isFirebaseAdminConfigured(), demoMode: isDemoMode });
}
