module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/app/firebase-messaging-sw.js/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
const dynamic = "force-dynamic";
async function GET() {
    const config = {
        apiKey: ("TURBOPACK compile-time value", "AIzaSyDmjMrQVIabuKsAoRKD9gALJkqpVTWiyD4") || "",
        authDomain: ("TURBOPACK compile-time value", "itd-lab-8a1b2.firebaseapp.com") || "",
        databaseURL: ("TURBOPACK compile-time value", "https://itd-lab-8a1b2-default-rtdb.asia-southeast1.firebasedatabase.app") || "",
        projectId: ("TURBOPACK compile-time value", "itd-lab-8a1b2") || "",
        storageBucket: ("TURBOPACK compile-time value", "itd-lab-8a1b2.firebasestorage.app") || "",
        appId: ("TURBOPACK compile-time value", "1:851626606876:web:db873d7d875b5fe682fad9") || "",
        messagingSenderId: ("TURBOPACK compile-time value", "851626606876") || "",
        measurementId: ("TURBOPACK compile-time value", "G-R0L2VV7JRC") || ""
    };
    const javascript = `
// Register the click handler before Firebase Messaging so its handler cannot replace ours.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data?.url || "/road-user";
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
    for (const client of clients) {
      if ("focus" in client) { client.navigate(target); return client.focus(); }
    }
    return self.clients.openWindow(target);
  }));
});
importScripts("https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js");
firebase.initializeApp(${JSON.stringify(config)});
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "Ambulance approaching";
  const options = {
    body: payload.notification?.body || "Please make way when safe.",
    icon: "/icon.svg",
    badge: "/icon.svg",
    data: payload.data || {},
  };
  self.registration.showNotification(title, options);
});
`;
    return new Response(javascript, {
        headers: {
            "Content-Type": "application/javascript; charset=utf-8",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Service-Worker-Allowed": "/"
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0niw93_cvlpfz._.js.map