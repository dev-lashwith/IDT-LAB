# Clearway — ambulance alert prototype

A demo-first, full-stack Next.js application for showing ambulance route alerts across a laptop and phones. The same server-side corridor matcher handles both live browser GPS and a predictable simulated route.

## What is included

- Ambulance dashboard: manual emergency activation, simulated GPS along a fixed route, live browser GPS, pause/resume and trip end controls.
- Road-user dashboard: live or demo roadside position, in-app alert history and optional Firebase Cloud Messaging setup.
- Admin dashboard: active trip map, participant counts and alert delivery log.
- Server APIs: Firebase ID-token verification, role checks, emergency lifecycle, location validation, route matching and alert logging.
- Firebase Auth, Firestore and FCM adapters. With no Firebase credentials in local development, a temporary signed-cookie demo mode and in-memory store are used.
- Leaflet maps with OpenStreetMap tiles. No paid routing or notification service is required.
- Ubuntu 22.04 systemd and Nginx deployment examples.

This is a college prototype. It does not contact emergency services, control traffic, or guarantee background GPS, push delivery, or notification sound.

## Local demo

Requirements: Node.js 22 or newer and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Choose Ambulance crew, Road user, or Admin. Open a second browser profile or a phone on the same Wi-Fi for another role. The local development server must be reachable from the phone; use your computer's LAN address instead of `localhost`.

Suggested walkthrough:

1. Sign in as a road user and choose **Use demo** to place the participant beside the route. Repeat on another phone if available.
2. Sign in as Ambulance crew in a separate browser, leave **Simulated GPS** selected, then start the emergency.
3. Watch the ambulance move along the Central Delhi demo route. Eligible users within the forward road corridor receive an in-app alert once per trip.
4. Open the Admin view to show active-trip monitoring and the alert log.
5. Optionally end the trip and repeat. Use Live GPS when testing on a device physically near the predefined route.

The in-memory local demo store is temporary and is cleared when the server restarts. The dashboard refreshes periodically while open. For a phone over HTTPS, deploy the app or use a trusted HTTPS development tunnel; browser location and web push require secure contexts (localhost is also treated as secure by browsers).

## Firebase setup

1. Create a Firebase project and register a Web app.
2. Enable Email/Password under **Authentication → Sign-in method**.
3. Create a Cloud Firestore database and deploy the included `firestore.rules`. The browser app does not write directly to Firestore; the server uses the Admin SDK.
4. Generate a service account for the server, or configure Application Default Credentials. Keep its private key outside the repository.
5. Copy `.env.example` to `.env.local` and provide the Web app values (`NEXT_PUBLIC_FIREBASE_*`) plus the server values (`FIREBASE_*`). This workspace already has the provided public Web app settings and project ID in its ignored `.env.local`. For local development, generate a service-account JSON key in Firebase Console → Project settings → Service accounts, keep it outside this project folder, and set `GOOGLE_APPLICATION_CREDENTIALS` to its absolute path. Never commit or share that JSON key. Set a long random `DEMO_SESSION_SECRET` and `DEMO_MODE=false` for production. Set `APP_BASE_URL` to your HTTPS origin when deployed.
6. Add a Web Push certificate under **Project settings → Cloud Messaging** and set its public key as `NEXT_PUBLIC_FIREBASE_VAPID_KEY`.
7. Create a regular account in the sign-in screen. New Firebase users receive the `road-user` role by default. Assign `ambulance` or `admin` in the server-protected `users/{uid}` document (`role`, and optionally `name`) from an authorized administrative process. Alternatively, list trusted administrator email addresses in `ADMIN_EMAILS`.

Firebase client configuration is public browser configuration; Firebase service account values are private server credentials. Never put the service account JSON in `NEXT_PUBLIC_*` variables or commit it.

Web push requires HTTPS, browser permission, a supported browser and working network delivery. It is a best-effort feature; the application also records alerts in its own dashboard. Background GPS is not guaranteed. On mobile, location sharing generally requires the page to stay open and permission to remain enabled.

## Server data model

- `users/{uid}` — role, display name and optional FCM token.
- `locations/{uid}` — latest validated location and its source flag.
- `emergencies/{id}` — ambulance, route, mode, status and latest route segment.
- `alerts/{emergencyId}_{uid}` — one corridor-match record per road user and emergency.

The prototype checks a 180 m corridor around the predefined path and only considers road users 40–1,000 m ahead of the ambulance along the route. It is a geometric demo matcher; it does not infer road topology, intersections, traffic flow or a route from a map service. Firebase Admin SDK bypasses Firestore Rules, so authorization is enforced in the API handlers.

## Ubuntu 22.04 VPS with Nginx and HTTPS

The VPS runs one Next.js process behind Nginx. Firebase Auth, Firestore and FCM remain hosted by Firebase. No Cloud Functions, separate database, Redis or paid routing API is required. The example service expects Node.js 22+, a domain pointed at the VPS, and the repository at `/var/www/clearway`.

1. Install Node.js 22+, Nginx and Certbot on Ubuntu 22.04. Allow inbound ports 80 and 443 in the VPS firewall.
2. Clone/copy the project to `/var/www/clearway`.
3. Create `/etc/clearway/clearway.env` from `.env.example`. Set `NODE_ENV=production`, `DEMO_MODE=false`, the private Firebase Admin credentials, `APP_BASE_URL=https://your-domain`, and a strong session secret. Restrict this file to root and the service account.
4. Create `/var/www/clearway/.env.production` with the public `NEXT_PUBLIC_FIREBASE_*` Web app values. Next.js embeds these public browser settings at build time. Restrict the file and keep it out of source control.
5. As the deployment user, run `npm ci` and `npm run build` in `/var/www/clearway`.
6. Replace `ambulance.example.com` in `deploy/nginx/clearway.conf` with your domain, then install it under `/etc/nginx/sites-available/clearway` and enable the site.
7. Install `deploy/systemd/clearway.service` at `/etc/systemd/system/clearway.service`, ensure the service user can read the app and env file, then enable and start it with systemd.
8. Run Certbot for your domain to issue a Let's Encrypt certificate and configure the HTTPS redirect. Verify renewal with Certbot's timer.
9. Check `https://your-domain/login`, sign into each prepared role, then allow browser location and notifications on HTTPS devices.

Example checks after deployment:

```bash
sudo nginx -t
sudo systemctl status clearway
sudo journalctl -u clearway -f
```

Keep OpenStreetMap tile usage respectful: tiles are served by a community service with a usage policy and no uptime guarantee. For a public/high-traffic deployment, select a tile provider whose terms match your use. This example is suitable for a small classroom demonstration.
