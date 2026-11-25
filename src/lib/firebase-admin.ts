import "server-only";
import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

export function isFirebaseAdminConfigured() {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
      (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS,
  );
}

function firebaseApp() {
  const existing = getApps()[0];
  if (existing) return existing;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    const account = JSON.parse(serviceAccountJson) as { project_id?: string; client_email?: string; private_key?: string };
    return initializeApp({
      credential: cert({
        projectId: account.project_id || projectId,
        clientEmail: account.client_email,
        privateKey: account.private_key?.replace(/\\n/g, "\n"),
      }),
      projectId: account.project_id || projectId,
    });
  }
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      projectId,
    });
  }
  return initializeApp({ credential: applicationDefault(), projectId });
}

export const adminAuth = () => getAuth(firebaseApp());
export const adminDb = () => getFirestore(firebaseApp());
export const adminMessaging = () => getMessaging(firebaseApp());
