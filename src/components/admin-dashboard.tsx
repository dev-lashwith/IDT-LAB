"use client";

import { useMemo } from "react";
import { Activity, ArrowUpRight, BellRing, Clock3, MapPin, ShieldCheck, Truck, Users } from "lucide-react";
import { DashboardFrame, ErrorDashboard, LoadingDashboard } from "@/components/dashboard-frame";
import { DynamicMapView } from "@/components/map-view-dynamic";
import { useDashboard } from "@/components/use-dashboard";

export function AdminDashboard() {
  const { snapshot, error, loading } = useDashboard();
  const activeTrips = snapshot?.emergencies.filter((trip) => trip.status === "active") || [];
  const roadUsers = snapshot?.locations.filter((item) => item.role === "road-user") || [];
  const ambulanceLocations = snapshot?.locations.filter((item) => item.role === "ambulance") || [];
  const latestAlerts = snapshot?.alerts.slice(0, 7) || [];
  const delivered = useMemo(() => snapshot?.alerts.filter((alert) => alert.status === "sent").length || 0, [snapshot]);

  if (loading && !snapshot) return <LoadingDashboard />;
  if (error && !snapshot) return <ErrorDashboard message={error} />;
  if (!snapshot) return <LoadingDashboard />;

  return <DashboardFrame user={snapshot.user} title="Operations overview" subtitle="Monitor active trips, road-user participation and recorded alert outcomes." firebaseConfigured={snapshot.firebaseConfigured}
    action={<span className="topbar-icon-indicator"><ShieldCheck size={16} /> ADMIN VIEW</span>}>
    <div className="metric-grid admin-metric-grid">
      <div className="metric-card metric-card-dark"><span className="metric-icon"><Activity size={17} /></span><span className="metric-label">ACTIVE TRIPS</span><strong>{activeTrips.length.toString().padStart(2, "0")}</strong><small><i className={activeTrips.length ? "status-led led-orange" : "status-led"} />{activeTrips.length ? "Currently sharing" : "All clear"}</small></div>
      <div className="metric-card"><span className="metric-icon metric-icon-mint"><Users size={17} /></span><span className="metric-label">ROAD USERS</span><strong>{roadUsers.length.toString().padStart(2, "0")}</strong><small>Visible participants</small></div>
      <div className="metric-card"><span className="metric-icon metric-icon-peach"><BellRing size={17} /></span><span className="metric-label">ALERTS RECORDED</span><strong>{snapshot.alerts.length.toString().padStart(2, "0")}</strong><small>Across active and past trips</small></div>
      <div className="metric-card"><span className="metric-icon metric-icon-blue"><ShieldCheck size={17} /></span><span className="metric-label">PUSH DELIVERED</span><strong>{delivered.toString().padStart(2, "0")}</strong><small>Device response recorded</small></div>
    </div>

    <div className="dashboard-grid admin-grid">
      <section className="panel map-panel"><div className="panel-heading"><div><div className="section-kicker"><span className="kicker-dot" /> MONITORING MAP</div><h2>Live trip overview</h2><p>Active ambulance and road-user positions update every few seconds.</p></div><div className="map-live-pill"><i /> LIVE FEED</div></div>
        <div className="map-wrap admin-map-wrap"><DynamicMapView locations={snapshot.locations} emergencies={snapshot.emergencies} /></div>
        <div className="map-summary"><span><i className="legend-ambulance">✚</i><strong>{ambulanceLocations.length.toString().padStart(2, "0")}</strong><small>ambulance{ambulanceLocations.length === 1 ? "" : "s"}</small></span><span><i className="legend-road">•</i><strong>{roadUsers.length.toString().padStart(2, "0")}</strong><small>road users</small></span><span><i className="legend-route" /><strong>{activeTrips.length.toString().padStart(2, "0")}</strong><small>active trips</small></span></div>
      </section>

      <section className="panel active-trips-panel"><div className="panel-heading"><div><div className="section-kicker"><span className="kicker-dot kicker-amber" /> CURRENT ACTIVITY</div><h2>Active emergencies</h2></div><span className="subtle-count">{activeTrips.length} active</span></div>
        {activeTrips.length === 0 ? <div className="empty-state empty-state-column"><div className="empty-state-icon"><Truck size={18} /></div><strong>No active trips</strong><p>Start an emergency from the ambulance dashboard to see it here.</p><span className="empty-state-link">Monitoring is on <i className="status-led" /></span></div> : <div className="active-trip-list">{activeTrips.map((trip) => <article className="admin-trip-card" key={trip.id}><div className="trip-card-top"><span className="trip-card-icon"><Truck size={16} /></span><span className="active-live-dot"><i /> ACTIVE</span></div><h3>{trip.ambulanceName}</h3><p>{trip.routeName}</p><div className="trip-card-meta"><span><Clock3 size={13} /> {new Date(trip.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span><span>{trip.mode === "live" ? "Live GPS" : "Simulation"}</span></div><div className="trip-card-bottom"><span><MapPin size={13} /> Segment {trip.currentSegment + 1}/{trip.route.length - 1}</span><span>{snapshot.alerts.filter((alert) => alert.emergencyId === trip.id).length} alerts</span></div></article>)}</div>}
        <div className="mini-stat-row"><span><span className="mini-stat-icon"><Users size={14} /></span>Participating users</span><strong>{snapshot.locations.length.toString().padStart(2, "0")}</strong><ArrowUpRight size={15} /></div>
      </section>
    </div>

    <section className="panel bottom-panel admin-log-panel"><div className="panel-heading compact-heading"><div><div className="section-kicker">AUDIT TRAIL</div><h2>Alert log</h2></div><span className="subtle-count">{snapshot.alerts.length} records</span></div>
      {latestAlerts.length === 0 ? <div className="empty-state"><div className="empty-state-icon"><BellRing size={18} /></div><div><strong>No alerts recorded</strong><p>Road-corridor matches and push results will show here as a trip runs.</p></div><span className="empty-state-link">System is ready <Activity size={14} /></span></div> : <div className="table-scroll"><table className="alert-table"><thead><tr><th>ROAD USER</th><th>AMBULANCE</th><th>DISTANCE AHEAD</th><th>DELIVERY</th><th>TIME</th></tr></thead><tbody>{latestAlerts.map((alert) => <tr key={alert.id}><td><span className="table-user"><i>{alert.userName.slice(0, 1).toUpperCase()}</i><strong>{alert.userName}</strong></span></td><td><span className="table-ambulance"><Truck size={14} />{snapshot.emergencies.find((trip) => trip.id === alert.emergencyId)?.ambulanceName || "Ambulance crew"}</span></td><td>{alert.distanceMeters} m</td><td><span className={`delivery-chip delivery-${alert.status}`}>{alert.status === "sent" ? "PUSH SENT" : alert.status === "failed" ? "FAILED" : "IN-APP"}</span></td><td className="table-time">{new Date(alert.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td></tr>)}</tbody></table></div>}
      <div className="notification-footnote"><ShieldCheck size={14} /> Admin view shows prototype records only. It does not replace dispatch monitoring.</div>
    </section>
  </DashboardFrame>;
}
