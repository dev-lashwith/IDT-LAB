"use client";

import { useCallback, useEffect, useState } from "react";
import { apiJson } from "@/lib/client/api";
import type { DashboardSnapshot } from "@/lib/types";

export function useDashboard() {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try {
      const next = await apiJson<DashboardSnapshot>("/api/dashboard", { cache: "no-store" });
      setSnapshot(next);
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load the dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 2500);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return { snapshot, error, loading, refresh };
}
