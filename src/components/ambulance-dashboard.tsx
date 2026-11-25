"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, BellRing, Check, Clock3, Crosshair, Map, MapPin, Pause, Play, Radio, ShieldCheck, Square } from "lucide-react";
import { DashboardFrame, ErrorDashboard, LoadingDashboard } from "@/components/dashboard-frame";
import { DynamicMapView } from "@/components/map-view-dynamic";
import { useDashboard } from "@/components/use-dashboard";
import { apiJson } from "@/lib/client/api";
import { DEMO_ROUTE, DEMO_ROUTE_NAME } from "@/lib/demo-route";
import { nearestRouteSegment, routeBearing } from "@/lib/geospatial";
import type { Emergency, GpsMode, Point } from "@/lib/types";

function routeSample(route: Point[], step: number, stepsPerSegment: number): { point: Point; segment: number } {
  const segment = Math.min(Math.floor(step / stepsPerSegment), route.length - 2);
  const fraction = Math.min(1, (step % stepsPerSegment) / stepsPerSegment);
  const start = route[segment]; const end = route[segment + 1];
  return { point: { lat: start.lat + (end.lat - start.lat) * fraction, lng: start.lng + (end.lng - start.lng) * fraction }, segment };
}

export function AmbulanceDashboard() {
  const { snapshot, error, loading, refresh } = useDashboard();
  const [mode, setMode] = useState<GpsMode>("simulated");
  const [running, setRunning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [message, setMessage] = useState("");
  const [stepsTaken, setStepsTaken] = useState(0);
  const gpsWatch = useRef<number | null>(null);
  const activeEmergency = useMemo(() => snapshot?.emergencies.find((item) => item.ambulanceId === snapshot.user.uid && item.status === "active"), [snapshot]);
  const ambulanceLocation = snapshot?.locations.find((item) => item.uid === snapshot.user.uid);
  const currentPoint = ambulanceLocation ? { lat: ambulanceLocation.lat, lng: ambulanceLocation.lng } : DEMO_ROUTE[0];
  const ownAlerts = snapshot?.alerts.length || 0;

  useEffect(() => {
    if (!activeEmergency || mode !== "simulated" || !running) return;
    const stepsPerSegment = 5;
    const totalSteps = (activeEmergency.route.length - 1) * stepsPerSegment;
    const timer = window.setInterval(() => {
      setStepsTaken((previous) => {
        const step = previous + 1;
        if (step > totalSteps) {
          setRunning(false); setMessage("Demo route complete. You can end this trip or run the route again.");
          return previous;
        }
        const { point, segment } = routeSample(activeEmergency.route, step - 1, stepsPerSegment);
        void apiJson<{ alertsCreated: number }>("/api/location", { method: "POST", body: JSON.stringify({ ...point, segment, simulated: true, emergencyId: activeEmergency.id }) })
          .then((result) => {
            if (result.alertsCreated) setMessage(`${result.alertsCreated} road user${result.alertsCreated === 1 ? "" : "s"} matched the route corridor.`);
            void refresh();
          }).catch((caught: unknown) => setActionError(caught instanceof Error ? caught.message : "Location update failed."));
        return step;
      });
    }, 1200);
    return () => window.clearInterval(timer);
  }, [activeEmergency?.id, mode, running, refresh]);

  useEffect(() => {
    if (!activeEmergency || mode !== "live" || !running) return;
    if (!navigator.geolocation) { setActionError("This browser does not support GPS location."); setRunning(false); return; }
    gpsWatch.current = navigator.geolocation.watchPosition((position) => {
      const point = { lat: position.coords.latitude, lng: position.coords.longitude };
      const segment = nearestRouteSegment(point, activeEmergency.route);
      void apiJson<{ alertsCreated: number }>("/api/location", { method: "POST", body: JSON.stringify({ ...point, heading: position.coords.heading, segment, simulated: false, emergencyId: activeEmergency.id }) })
        .then((result) => {
          setActionError("");
          if (result.alertsCreated) setMessage(`${result.alertsCreated} road user${result.alertsCreated === 1 ? "" : "s"} matched the route corridor.`);
          void refresh();
        }).catch((caught: unknown) => setActionError(caught instanceof Error ? caught.message : "GPS update failed."));
    }, (geoError) => {
      setActionError(geoError.message || "Location permission is needed to use live GPS."); setRunning(false);
    }, { enableHighAccuracy: true, maximumAge: 3000, timeout: 12000 });
    return () => { if (gpsWatch.current !== null) navigator.geolocation.clearWatch(gpsWatch.current); gpsWatch.current = null; };
  }, [activeEmergency?.id, mode, running, refresh]);

  if (loading && !snapshot) return <LoadingDashboard />;
  if (error && !snapshot) return <ErrorDashboard message={error} />;
  if (!snapshot) return <LoadingDashboard />;

  async function startTrip() {
    setBusy(true); setActionError(""); setMessage("");
    try {
      const result = await apiJson<{ emergency: Emergency }>("/api/emergencies", { method: "POST", body: JSON.stringify({ mode }) });
      setStepsTaken(0); setRunning(true); setMessage(mode === "simulated" ? "Simulation started. The ambulance marker follows the demo route." : "Emergency active. Waiting for a live GPS fix…");
      if (mode === "simulated") await apiJson("/api/location", { method: "POST", body: JSON.stringify({ ...result.emergency.route[0], segment: 0, simulated: true, emergencyId: result.emergency.id }) });
      await refresh();
    } catch (caught) { setActionError(caught instanceof Error ? caught.message : "Could not start this trip."); }
    finally { setBusy(false); }
  }

  async function finishTrip() {
    if (!activeEmergency) return;
    setBusy(true); setRunning(false); setActionError("");
    try {
      await apiJson("/api/emergencies/stop", { method: "POST", body: JSON.stringify({ emergencyId: activeEmergency.id }) });
      setMessage("Emergency ended. Alert history remains available in the admin view."); await refresh();
    } catch (caught) { setActionError(caught instanceof Error ? caught.message : "Could not end the trip."); }
    finally { setBusy(false); }
  }

  const hasActiveTrip = Boolean(activeEmergency);
  const heading = ambulanceLocation?.heading ?? routeBearing(DEMO_ROUTE, activeEmergency?.currentSegment ?? 0);
  const visibleRoute = activeEmergency?.route || DEMO_ROUTE;
  const roadUsers = snapshot.locations.filter((item) => item.role === "road-user");

  return <DashboardFrame user={snapshot.user} title="Ambulance control" subtitle="Activate a trip, share your position and watch the road corridor respond." firebaseConfigured={snapshot.firebaseConfigured}
    action={<span className="topbar-icon-indicator"><Radio size={16} /> SYSTEM ONLINE</span>}>
    <div className="metric-grid">
      <div className="metric-card metric-card-dark"><span className="metric-icon"><Activity size={17} /></span><span className="metric-label">TRIP STATUS</span><strong>{hasActiveTrip ? "Active" : "Standby"}</strong><small><i className={hasActiveTrip ? "status-led led-orange" : "status-led"} />{hasActiveTrip ? "Sharing route updates" : "Ready to begin"}</small></div>
      <div className="metric-card"><span className="metric-icon metric-icon-mint"><MapPin size={17} /></span><span className="metric-label">ROAD USERS</span><strong>{roadUsers.length.toString().padStart(2, "0")}</strong><small><span className="soft-green">●</span> Visible in the corridor</small></div>
      <div className="metric-card"><span className="metric-icon metric-icon-peach"><BellRing size={17} /></span><span className="metric-label">ALERTS LOGGED</span><strong>{ownAlerts.toString().padStart(2, "0")}</strong><small>Matched on this trip</small></div>
      <div className="metric-card"><span className="metric-icon metric-icon-blue"><Crosshair size={17} /></span><span className="metric-label">GPS MODE</span><strong className="metric-mode">{hasActiveTrip ? activeEmergency?.mode === "live" ? "Live GPS" : "Simulation" : "Not started"}</strong><small>{hasActiveTrip && activeEmergency?.mode === "simulated" ? "Predefined city route" : "Browser location"}</small></div>
    </div>

    <div className="dashboard-grid ambulance-grid">
      <section className="panel map-panel"><div className="panel-heading"><div><div className="section-kicker"><span className="kicker-dot" /> LIVE OVERVIEW</div><h2>Route and nearby users</h2><p>Road users ahead are matched along the active route.</p></div><div className="map-live-pill"><i /> MAP LIVE</div></div>
        <div className="map-wrap"><DynamicMapView locations={snapshot.locations} emergencies={snapshot.emergencies} focus={hasActiveTrip ? currentPoint : null} /><div className="map-legend"><span><i className="legend-ambulance">✚</i> Ambulance</span><span><i className="legend-road">•</i> Road user</span><span><i className="legend-route" /> Demo route</span></div><div className="map-scale"><span>+</span><span>−</span></div></div>
        <div className="map-caption"><span><MapPin size={15} /><span><strong>{DEMO_ROUTE_NAME}</strong><small>{visibleRoute.length} route points · about 2 km</small></span></span><span className="coordinates">{currentPoint.lat.toFixed(4)}°, {currentPoint.lng.toFixed(4)}°</span></div>
      </section>

      <section className="panel control-panel"><div className="panel-heading"><div><div className="section-kicker"><span className="kicker-dot kicker-amber" /> TRIP CONTROL</div><h2>{hasActiveTrip ? "Emergency in progress" : "Ready when you are"}</h2><p>{hasActiveTrip ? "Location updates feed the same corridor matcher." : "Choose a location source to start the demo."}</p></div></div>
        {!hasActiveTrip ? <div className="mode-choices">
          <button onClick={() => setMode("simulated")} className={`mode-choice ${mode === "simulated" ? "mode-choice-active" : ""}`}><span className="mode-radio">{mode === "simulated" && <i />}</span><span><strong>Simulated GPS</strong><small>Repeatable route · best for demos</small></span><span className="recommended">RECOMMENDED</span></button>
          <button onClick={() => setMode("live")} className={`mode-choice ${mode === "live" ? "mode-choice-active" : ""}`}><span className="mode-radio">{mode === "live" && <i />}</span><span><strong>Live GPS</strong><small>Use this device’s current location</small></span></button>
          <div className="route-info"><span className="route-info-icon"><Map size={15} /></span><span><strong>{DEMO_ROUTE_NAME}</strong><small>Central Delhi · forward corridor alerts</small></span><ArrowUpRight size={15} /></div>
          <button className="primary-button start-button" onClick={() => void startTrip()} disabled={busy}>{busy ? "Starting…" : "Start emergency"}<Play size={16} fill="currentColor" /></button>
        </div> : <div className="active-control">
          <div className="active-trip-banner"><span className="active-trip-symbol"><Activity size={18} /></span><span><strong>{activeEmergency?.routeName || DEMO_ROUTE_NAME}</strong><small>Trip {activeEmergency?.id.slice(0, 8).toUpperCase()} · {activeEmergency?.mode === "live" ? "Live GPS" : "Simulated GPS"}</small></span><span className="active-live-dot"><i /> LIVE</span></div>
          <div className="trip-metadata"><span><Clock3 size={15} /> Started {new Date(activeEmergency!.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span><span><NavigationIcon /> Heading {Math.round(heading)}°</span></div>
          {mode === "simulated" ? <div className="sim-progress"><div className="progress-label"><span>Route progress</span><span>{Math.min(100, Math.round(stepsTaken / ((visibleRoute.length - 1) * 5) * 100))}%</span></div><div className="progress-track"><span style={{ width: `${Math.min(100, stepsTaken / ((visibleRoute.length - 1) * 5) * 100)}%` }} /></div></div> : <div className="live-hint"><Crosshair size={16} /><span>Keep this dashboard open and allow location access. GPS updates are sent while the trip is active.</span></div>}
          {message && <div className="inline-success"><Check size={15} />{message}</div>}
          <div className="control-buttons"><button className="secondary-button" onClick={() => setRunning(!running)}>{running ? <><Pause size={15} /> Pause</> : mode === "simulated" ? <><Play size={15} /> Run route</> : <><Radio size={15} /> Resume GPS</>}</button><button className="danger-button" onClick={() => void finishTrip()} disabled={busy}><Square size={14} fill="currentColor" /> End emergency</button></div>
        </div>}
        {actionError && <div className="form-error compact-error">{actionError}</div>}
        <div className="safety-note"><ShieldCheck size={16} /><p>Prototype demonstration only. This does not contact emergency services or control traffic.</p></div>
      </section>
    </div>

    <section className="panel bottom-panel"><div className="panel-heading compact-heading"><div><div className="section-kicker">RECENT ALERT ACTIVITY</div><h2>Latest route matches</h2></div><span className="subtle-count">{snapshot.alerts.length} total</span></div>
      {snapshot.alerts.length === 0 ? <div className="empty-state"><div className="empty-state-icon"><BellRing size={18} /></div><div><strong>No route alerts yet</strong><p>Start the simulated route to see matching road users appear here.</p></div><span className="empty-state-link">Waiting for movement <ArrowDownRight size={15} /></span></div> : <div className="alert-list">{snapshot.alerts.slice(0, 4).map((alert) => <div className="alert-row" key={alert.id}><span className="alert-row-icon"><BellRing size={15} /></span><span className="alert-row-copy"><strong>{alert.userName}</strong><small>Corridor match · {alert.distanceMeters} m ahead</small></span><span className={`delivery-chip delivery-${alert.status}`}>{alert.status === "sent" ? "PUSH SENT" : alert.status === "failed" ? "PUSH FAILED" : "IN-APP"}</span><span className="alert-time">{new Date(alert.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div>)}</div>}
    </section>
  </DashboardFrame>;
}

function NavigationIcon() { return <span className="heading-arrow">↑</span>; }
