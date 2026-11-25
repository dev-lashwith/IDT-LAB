"use client";

import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "@firebase/auth";
import { Activity, ArrowRight, BellRing, Map, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiJson } from "@/lib/client/api";
import { firebaseAnalytics, firebaseAuth, hasFirebaseClientConfig } from "@/lib/firebase-client";
import type { UserRole } from "@/lib/types";

const roles: Array<{ key: UserRole; title: string; description: string; Icon: typeof Activity }> = [
  { key: "ambulance", title: "Ambulance crew", description: "Start an emergency and share a route", Icon: Activity },
  { key: "road-user", title: "Road user", description: "Share your position and view alerts", Icon: BellRing },
  { key: "admin", title: "Admin", description: "Monitor trips and alert history", Icon: ShieldCheck },
];

export default function LoginPage() {
  const router = useRouter();
  const [serverConfig, setServerConfig] = useState<{ firebaseAdminReady: boolean; demoMode: boolean } | null>(null);
  const firebaseReady = hasFirebaseClientConfig() && Boolean(serverConfig?.firebaseAdminReady);
  const demoAvailable = Boolean(serverConfig?.demoMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/app-config", { cache: "no-store" }).then((response) => response.json()).then((config) => {
      if (!cancelled) setServerConfig(config as { firebaseAdminReady: boolean; demoMode: boolean });
    }).catch(() => { if (!cancelled) setServerConfig({ firebaseAdminReady: false, demoMode: false }); });
    if (hasFirebaseClientConfig()) void firebaseAnalytics();
    return () => { cancelled = true; };
  }, []);

  async function signInDemo(role: UserRole) {
    setBusy(true); setError("");
    try {
      const result = await apiJson<{ user: { role: UserRole } }>("/api/session", {
        method: "POST", body: JSON.stringify({ name: name.trim() || (role === "ambulance" ? "Demo crew" : role === "admin" ? "Demo admin" : "Demo road user"), role }),
      });
      router.push(`/${result.user.role}`);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not start the demo."); }
    finally { setBusy(false); }
  }

  async function signInFirebase(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const auth = firebaseAuth();
      if (creating) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) await updateProfile(credential.user, { displayName: name.trim() });
      } else await signInWithEmailAndPassword(auth, email, password);
      const session = await apiJson<{ user: { role: UserRole } }>("/api/session", { cache: "no-store" });
      router.push(`/${session.user.role}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message.replace("Firebase: ", "") : "Could not sign in.");
    } finally { setBusy(false); }
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="visual-topline"><span className="brand-mark"><Map size={18} /></span><span>CLEARWAY</span><span className="prototype-chip">PROTOTYPE</span></div>
        <div className="visual-copy">
          <p className="eyebrow light-eyebrow">A clearer path for every journey</p>
          <h1>Make way.<br /><span>With awareness.</span></h1>
          <p className="visual-description">A college demonstration of how route-aware alerts could give road users more notice when an ambulance is approaching.</p>
          <div className="visual-route-card">
            <div className="route-orbit"><span className="orbit-dot" /><span className="orbit-line" /><span className="orbit-ambulance">✚</span></div>
            <div><strong>One shared route</strong><p>Live GPS or a repeatable demo journey</p></div>
            <span className="route-live"><i /> READY</span>
          </div>
        </div>
        <div className="visual-foot"><span>Built for a reliable classroom demo</span><span>01 / 03</span></div>
        <span className="visual-decor visual-decor-one" /><span className="visual-decor visual-decor-two" />
      </section>

      <section className="login-panel">
        <div className="login-inner">
          <div className="mobile-brand"><span className="brand-mark"><Map size={18} /></span><span>CLEARWAY</span><span className="prototype-chip">PROTOTYPE</span></div>
          <p className="eyebrow">DEMO WORKSPACE</p>
          <h2>{firebaseReady ? "Welcome back" : demoAvailable || serverConfig === null ? "Choose your view" : "Firebase setup needed"}</h2>
          <p className="login-intro">{firebaseReady ? "Sign in with your Firebase account to continue." : demoAvailable ? "Pick a role to open the matching dashboard. No account setup needed for the demo." : "Add Firebase Admin credentials to the server environment to enable sign-in."}</p>
          {error && <div className="form-error">{error}</div>}
          {firebaseReady ? <form className="auth-form" onSubmit={(event) => void signInFirebase(event)}>
            {creating && <><label className="field-label" htmlFor="account-name">Name</label><input id="account-name" className="text-input" value={name} onChange={(event) => setName(event.target.value)} required placeholder="Your name" /></>}
            <label className="field-label" htmlFor="email">Email</label><input id="email" className="text-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" />
            <label className="field-label" htmlFor="password">Password</label><input id="password" className="text-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} placeholder="At least 6 characters" />
            <button className="primary-button auth-submit" disabled={busy}>{busy ? "Please wait…" : creating ? "Create account" : "Sign in"}<ArrowRight size={17} /></button>
            <button type="button" className="text-button" onClick={() => { setCreating(!creating); setError(""); }}>{creating ? "Already have an account? Sign in" : "Create a road-user account"}</button>
            <div className="demo-note"><span className="demo-note-mark"><ShieldCheck size={14} /></span><p>Ambulance and admin roles are assigned by the project administrator in Firestore.</p></div>
          </form> : demoAvailable ? <>
            <label className="field-label" htmlFor="demo-name">Name for this device <span>optional</span></label>
            <input id="demo-name" className="text-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Aisha or Crew 01" maxLength={48} />
            <div className="role-list">
              {roles.map(({ key, title, description, Icon }, index) => <button key={key} className="role-card" onClick={() => void signInDemo(key)} disabled={busy}>
                <span className={`role-icon role-icon-${index}`}><Icon size={19} /></span>
                <span className="role-copy"><strong>{title}</strong><small>{description}</small></span>
                <ArrowRight className="role-arrow" size={17} />
              </button>)}
            </div>
            <div className="demo-note"><span className="demo-note-mark">i</span><p>{hasFirebaseClientConfig() ? "Firebase web settings and Analytics are loaded. Add private Firebase Admin credentials to enable Firebase sign-in, Firestore persistence and push sending. The temporary demo remains available." : "Demo sessions use temporary server-signed cookies. Set up Firebase in the environment file to use real accounts and push delivery."}</p></div>
          </> : <div className="demo-note"><span className="demo-note-mark"><ShieldCheck size={14} /></span><p>Firebase web settings are available. Add private Admin SDK credentials on the server to enable authenticated dashboards, Firestore and notifications.</p></div>}
          <div className="login-legal"><span>Prototype only · Not an emergency service</span><span>© CLEARWAY 2026</span></div>
        </div>
      </section>
    </main>
  );
}
