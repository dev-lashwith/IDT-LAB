"use client";

import { authToken } from "@/lib/firebase-client";

export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const token = await authToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers, credentials: "same-origin" });
}

export async function apiJson<T>(input: RequestInfo | URL, init: RequestInit = {}): Promise<T> {
  const response = await apiFetch(input, init);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "The request could not be completed.");
  return body as T;
}
