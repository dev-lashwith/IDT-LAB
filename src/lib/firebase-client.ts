"use client";

import { getApp, getApps, initializeApp } from "@firebase/app";
import { getAnalytics, isSupported as analyticsSupported } from "@firebase/analytics";
import { getAuth } from "@firebase/auth";
import { getMessaging, isSupported } from "@firebase/messaging";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export function hasFirebaseClientConfig() {
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

function firebaseApp() {
  if (!hasFirebaseClientConfig()) throw new Error("Firebase web app settings are missing.");
  return getApps().length ? getApp() : initializeApp(config);
}

export function firebaseAuth() {
  return getAuth(firebaseApp());
}

export async function firebaseAnalytics() {
  if (typeof window === "undefined" || !config.measurementId) return null;
  try {
    if (!(await analyticsSupported())) return null;
    return getAnalytics(firebaseApp());
  }
  catch { return null; }
}

export async function firebaseMessaging() {
  if (!hasFirebaseClientConfig() || !(await isSupported())) return null;
  return getMessaging(firebaseApp());
}

export async function authToken() {
  if (!hasFirebaseClientConfig()) return null;
  const user = firebaseAuth().currentUser;
  return user ? user.getIdToken() : null;
}
