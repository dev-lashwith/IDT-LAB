"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Activity, Bell, CircleHelp, LogOut, Map, Shield, Truck, Users } from "lucide-react";
import { signOut } from "@firebase/auth";
import { apiFetch } from "@/lib/client/api";
import { firebaseAuth, hasFirebaseClientConfig } from "@/lib/firebase-client";
import { ROLE_LABELS, type AppUser, type UserRole } from "@/lib/types";

const links: Array<{ href: string; label: string; role: UserRole; Icon: typeof Activity }> = [
  { href: "/ambulance", label: "Ambulance", role: "ambulance", Icon: Truck },
  { href: "/road-user", label: "Road user", role: "road-user", Icon: Users },
  { href: "/admin", label: "Admin overview", role: "admin", Icon: Shield },
];

export function DashboardFrame({
  user, title, subtitle, children, firebaseConfigured, action,
}: {
  user: AppUser; title: string; subtitle: string; children: React.ReactNode;
  firebaseConfigured: boolean; action?: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const pageRole = links.find((link) => link.href === pathname)?.role;
    if (pageRole && pageRole !== user.role) router.replace(`/${user.role}`);
  }, [pathname, router, user.role]);
  const visibleLinks = links.filter((link) => link.role === user.role);
  async function logout() {
    if (hasFirebaseClientConfig()) await signOut(firebaseAuth()).catch(() => undefined);
    await apiFetch("/api/session", { method: "DELETE" });
    router.push("/login");
  }
  return <div className="app-layout">
    <aside className="sidebar">
      <Link href="/login" className="side-brand"><span className="brand-mark"><Map size={17} /></span><span className="brand-name">CLEARWAY</span><span className="brand-mini">DEMO</span></Link>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav">
        {visibleLinks.map(({ href, label, Icon }) => <Link key={href} href={href} className={`nav-link ${pathname === href ? "nav-link-active" : ""}`}><Icon size={17} /><span>{label}</span>{pathname === href && <span className="nav-dot" />}</Link>)}
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-tip"><span className="tip-icon"><CircleHelp size={17} /></span><strong>Demo tip</strong><p>Open each role on a separate browser or device for a convincing walkthrough.</p></div>
      <button className="logout-button" onClick={() => void logout()}><LogOut size={16} /><span>Sign out</span></button>
      <div className="side-profile"><span className="profile-avatar">{user.name.slice(0, 1).toUpperCase()}</span><span className="profile-copy"><strong>{user.name}</strong><small>{ROLE_LABELS[user.role]}{user.demo ? " · Demo" : ""}</small></span><span className="profile-status" /></div>
    </aside>
    <div className="app-main">
      <header className="topbar"><div className="topbar-left"><div className="breadcrumb">WORKSPACE <span>/</span> {ROLE_LABELS[user.role].toUpperCase()}</div><div className="topbar-mobile-brand"><span className="brand-mark"><Map size={15} /></span>CLEARWAY</div></div><div className="topbar-right"><div className="connection-badge"><span className="connection-dot" />{firebaseConfigured ? "Firebase connected" : "Local demo mode"}</div><button className="help-button" title="Prototype help"><CircleHelp size={17} /></button>{action}</div></header>
      <main className="page-content">
        <div className="page-heading"><div><p className="eyebrow">{ROLE_LABELS[user.role].toUpperCase()} DASHBOARD</p><h1>{title}</h1><p className="page-subtitle">{subtitle}</p></div><div className="heading-date"><span className="heading-date-dot" /> LIVE WORKSPACE</div></div>
        {children}
        <footer className="app-footer"><span><Activity size={13} /> CLEARWAY PROTOTYPE</span><span>For demonstration purposes only</span></footer>
      </main>
    </div>
    <div className="mobile-nav">{visibleLinks.map(({ href, label, Icon }) => <Link key={href} href={href} className={pathname === href ? "selected" : ""}><Icon size={17} /><span>{label}</span></Link>)}<button onClick={() => void logout()}><LogOut size={17} /><span>Exit</span></button></div>
  </div>;
}

export function LoadingDashboard({ message = "Opening your dashboard…" }: { message?: string }) {
  return <main className="loading-screen"><div className="loading-mark"><Map size={22} /></div><strong>{message}</strong><span>Connecting to the demo workspace</span></main>;
}

export function ErrorDashboard({ message }: { message: string }) {
  return <main className="loading-screen"><div className="loading-mark loading-mark-warn"><Bell size={20} /></div><strong>{message}</strong><Link href="/login" className="primary-button">Back to sign in</Link></main>;
}
