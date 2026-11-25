"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, BellRing, Check, Crosshair, MapPin, ShieldCheck, Smartphone, Users } from "lucide-react";
import { DashboardFrame, ErrorDashboard, LoadingDashboard } from "@/components/dashboard-frame";
import { DynamicMapView } from "@/components/map-view-dynamic";
import { useDashboard } from "@/components/use-dashboard";
import { apiJson } from "@/lib/client/api";
import { firebaseMessaging, hasFirebaseClientConfig } from "@/lib/firebase-client";
import type { UserLocation } from "@/lib/types";

export function RoadUserDashboard() {
  const { snapshot, error, loading, refresh } = useDashboard();
  const [sharing, setSharing] = useState(false);
  const [pushState, setPushState] = useState<"idle" | "working" | "enabled" | "failed">("idle");
  const [notice, setNotice] = useState("");
  const [errorText, setErrorText] = useState("");
  const watchId = useRef<number | null>(null);
  const seenAlert = useRef("");
  const ownLocation = snapshot?.locations.find((location) => location.uid === snapshot.user.uid);
  const lastAlert = snapshot?.alerts[0];
  const serverFirebaseConfigured = snapshot?.firebaseConfigured ?? false;

  useEffect(() => {
    if (!sharing) return;
    if (!navigator.geolocation) { setErrorText("This browser does not support GPS location."); setSharing(false); return; }
    watchId.current = navigator.geolocation.watchPosition((position) => {
      void apiJson("/api/location", { method: "POST", body: JSON.stringify({ lat: position.coords.latitude, lng: position.coords.longitude, heading: position.coords.heading, simulated: false }) })
        .then(() => { setErrorText(""); void refresh(); })
        .catch((caught: unknown) => setErrorText(caught instanceof Error ? caught.message : "Location could not be shared."));
    }, (geoError) => { setErrorText(geoError.message || "Location permission is needed."); setSharing(false); }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 12000 });
    return () => { if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current); watchId.current = null; };
  }, [sharing, refresh]);

  useEffect(() => {
    if (!lastAlert || seenAlert.current === lastAlert.id) return;
    seenAlert.current = lastAlert.id;
    setNotice(`An ambulance may be approaching. It is about ${lastAlert.distanceMeters} m along your road corridor.`);
  }, [lastAlert?.id]);

  if (loading && !snapshot) return <LoadingDashboard />;
  if (error && !snapshot) return <ErrorDashboard message={error} />;
  if (!snapshot) return <LoadingDashboard />;

  async function shareLive() {
    setErrorText("");
    if (!navigator.geolocation) { setErrorText("This browser does not support GPS location."); return; }
    setSharing(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        await apiJson("/api/location", { method: "POST", body: JSON.stringify({ lat: position.coords.latitude, lng: position.coords.longitude, heading: position.coords.heading, simulated: false }) });
        void refresh();
      } catch (caught) { setErrorText(caught instanceof Error ? caught.message : "Location could not be shared."); }
    }, (geoError) => { setErrorText(geoError.message || "Location permission is needed."); setSharing(false); }, { enableHighAccuracy: true, timeout: 12000 });
  }

  async function useDemoPosition() {
    if (!ownLocation) return;
    setSharing(false); setErrorText("");
    try {
      await apiJson("/api/location", { method: "POST", body: JSON.stringify({ lat: ownLocation.lat, lng: ownLocation.lng, simulated: true }) });
      setNotice("Your demo roadside position is visible on the shared map."); void refresh();
    } catch (caught) { setErrorText(caught instanceof Error ? caught.message : "Could not set the demo position."); }
  }

  async function enablePush() {
    setPushState("working"); setErrorText("");
    try {
      if (!serverFirebaseConfigured) throw new Error("Add Firebase Admin credentials to enable push sending. In-app alerts are available now.");
      if (!hasFirebaseClientConfig()) throw new Error("Connect Firebase to enable web push. In-app alerts are available in demo mode.");
      if (!("Notification" in window) || !("serviceWorker" in navigator)) throw new Error("This browser does not support web push notifications.");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Notification permission was not granted.");
      const messaging = await firebaseMessaging();
      if (!messaging) throw new Error("Firebase Messaging is not supported in this browser.");
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      const { getToken } = await import("@firebase/messaging");
      const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY, serviceWorkerRegistration: registration });
      if (!token) throw new Error("Firebase did not return a push token.");
      await apiJson("/api/notifications/token", { method: "POST", body: JSON.stringify({ token }) });
      setPushState("enabled"); setNotice("Web push is enabled on this device. Delivery still depends on browser and device settings.");
    } catch (caught) { setPushState("failed"); setErrorText(caught instanceof Error ? caught.message : "Could not enable web push."); }
  }

  const activeEmergency = snapshot.emergencies[0];
  return <DashboardFrame user={snapshot.user} title="On the road" subtitle="Share your position and stay aware of an ambulance approaching your route." firebaseConfigured={snapshot.firebaseConfigured}
    action={<button className="topbar-notification" title="Notification preferences" onClick={() => void enablePush()}><Bell size={16} />{pushState === "enabled" ? "Alerts on" : "Set alerts"}</button>}>
    {notice && <div className="road-alert-banner"><span className="road-alert-icon"><BellRing size={19} /></span><span><strong>Ambulance route alert</strong><small>{notice}</small></span><button onClick={() => setNotice("")}>Dismiss</button></div>}
    <div className="metric-grid road-metric-grid">
      <div className="metric-card metric-card-dark"><span className="metric-icon"><BellRing size={17} /></span><span className="metric-label">ALERTS RECEIVED</span><strong>{snapshot.alerts.length.toString().padStart(2, "0")}</strong><small><i className="status-led led-orange" />This device’s alert log</small></div>
      <div className="metric-card"><span className="metric-icon metric-icon-mint"><MapPin size={17} /></span><span className="metric-label">LOCATION</span><strong className="metric-mode">{sharing ? "Sharing live" : ownLocation?.simulated ? "Demo position" : ownLocation ? "Saved" : "Not shared"}</strong><small>{ownLocation ? `${ownLocation.lat.toFixed(4)}, ${ownLocation.lng.toFixed(4)}` : "Choose a location source"}</small></div>
      <div className="metric-card"><span className="metric-icon metric-icon-peach"><Users size={17} /></span><span className="metric-label">ACTIVE AMBULANCES</span><strong>{snapshot.locations.filter((location) => location.role === "ambulance").length.toString().padStart(2, "0")}</strong><small>Sharing on this map</small></div>
      <div className="metric-card"><span className="metric-icon metric-icon-blue"><ShieldCheck size={17} /></span><span className="metric-label">PUSH STATUS</span><strong className="metric-mode">{pushState === "enabled" ? "Enabled" : snapshot.firebaseConfigured ? "Available" : "In-app only"}</strong><small>{pushState === "enabled" ? "This device is subscribed" : "Browser support varies"}</small></div>
    </div>

    <div className="dashboard-grid road-grid">
      <section className="panel map-panel"><div className="panel-heading"><div><div className="section-kicker"><span className="kicker-dot" /> SHARED MAP</div><h2>Ambulance activity nearby</h2><p>Active trip and demo route appear here while the page is open.</p></div><div className="map-live-pill"><i /> UPDATING</div></div>
        <div className="map-wrap road-map-wrap"><DynamicMapView locations={snapshot.locations} emergencies={snapshot.emergencies} focus={ownLocation ? { lat: ownLocation.lat, lng: ownLocation.lng } : null} /><div className="map-legend"><span><i className="legend-ambulance">✚</i> Ambulance</span><span><i className="legend-road">•</i> You / road users</span><span><i className="legend-route" /> Demo route</span></div></div>
        <div className="map-caption"><span><MapPin size={15} /><span><strong>{ownLocation?.simulated ? "Demo roadside location" : "Your location"}</strong><small>{ownLocation ? `Last update ${new Date(ownLocation.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Location has not been shared"}</small></span></span><span className="privacy-caption">Location is shared with this prototype</span></div>
      </section>

      <section className="panel share-panel"><div className="panel-heading"><div><div className="section-kicker"><span className="kicker-dot kicker-amber" /> YOUR PARTICIPATION</div><h2>Share your location</h2><p>Choose live GPS or a fixed roadside point for the classroom demo.</p></div></div>
        <div className="share-choice share-choice-live"><span className="share-choice-icon"><Crosshair size={17} /></span><span><strong>Live GPS</strong><small>Uses this phone’s browser location while the page stays open.</small></span><button className={sharing ? "toggle-switch toggle-on" : "toggle-switch"} onClick={() => sharing ? setSharing(false) : void shareLive()} aria-label={sharing ? "Stop sharing location" : "Share live location"}><i /></button></div>
        <div className="share-choice"><span className="share-choice-icon share-icon-soft"><MapPin size={17} /></span><span><strong>Demo roadside position</strong><small>A predictable point beside the predefined route.</small></span><button className="small-outline-button" onClick={() => void useDemoPosition()} disabled={!ownLocation}>Use demo</button></div>
        <button className={`push-setup-button ${pushState === "enabled" ? "push-enabled" : ""}`} onClick={() => void enablePush()} disabled={pushState === "working"}><span className="push-setup-icon">{pushState === "enabled" ? <Check size={17} /> : <Bell size={17} />}</span><span><strong>{pushState === "enabled" ? "Web push is set up" : pushState === "working" ? "Setting up…" : "Set up web push alerts"}</strong><small>{snapshot.firebaseConfigured ? "Request browser notification permission" : "Add Firebase and HTTPS to enable"}</small></span><span className="setup-arrow">›</span></button>
        {errorText && <div className="form-error compact-error">{errorText}</div>}
        <div className="safety-note"><ShieldCheck size={16} /><p>Move to a safe place and follow local traffic rules. This prototype does not direct traffic.</p></div>
      </section>
    </div>

    <section className="panel bottom-panel"><div className="panel-heading compact-heading"><div><div className="section-kicker">YOUR ALERT HISTORY</div><h2>Recent notifications</h2></div><span className="subtle-count">{snapshot.alerts.length} total</span></div>
      {snapshot.alerts.length === 0 ? <div className="empty-state"><div className="empty-state-icon"><Bell size={18} /></div><div><strong>You’re all caught up</strong><p>Alerts appear when an active ambulance route matches this roadside position.</p></div><span className="empty-state-link">{activeEmergency ? "Trip is active" : "Waiting for a trip"} <span>·</span></span></div> : <div className="alert-list">{snapshot.alerts.slice(0, 5).map((alert) => <div className="alert-row" key={alert.id}><span className="alert-row-icon"><BellRing size={15} /></span><span className="alert-row-copy"><strong>Ambulance approaching</strong><small>{alert.distanceMeters} m ahead · {new Date(alert.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small></span><span className={`delivery-chip delivery-${alert.status}`}>{alert.channel === "push" && alert.status === "sent" ? "PUSH SENT" : "IN-APP"}</span></div>)}</div>}
      <div className="notification-footnote"><Smartphone size={14} /> Notifications and sound depend on device, browser permissions and network availability.</div>
    </section>
  </DashboardFrame>;
}
