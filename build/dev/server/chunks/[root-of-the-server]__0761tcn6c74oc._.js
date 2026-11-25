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
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

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
"[project]/src/app/api/emergencies/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/server/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/server/store.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const runtime = "nodejs";
async function POST(request) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireUser"])(request);
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isRole"])(user.role, [
            "ambulance"
        ])) return Response.json({
            error: "Only ambulance accounts can start an emergency."
        }, {
            status: 403
        });
        const body = await request.json();
        const emergency = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createEmergency"])(user, body.mode === "live" ? "live" : "simulated");
        return Response.json({
            emergency
        });
    } catch (error) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])(error);
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/demo-route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEMO_ROADSIDE_POINTS",
    ()=>DEMO_ROADSIDE_POINTS,
    "DEMO_ROUTE",
    ()=>DEMO_ROUTE,
    "DEMO_ROUTE_NAME",
    ()=>DEMO_ROUTE_NAME
]);
const DEMO_ROUTE_NAME = "Central Delhi demo route";
const DEMO_ROUTE = [
    {
        lat: 28.6315,
        lng: 77.2191
    },
    {
        lat: 28.6282,
        lng: 77.2188
    },
    {
        lat: 28.6240,
        lng: 77.2190
    },
    {
        lat: 28.6205,
        lng: 77.2194
    },
    {
        lat: 28.6170,
        lng: 77.2200
    },
    {
        lat: 28.6143,
        lng: 77.2214
    },
    {
        lat: 28.6126,
        lng: 77.2248
    },
    {
        lat: 28.6127,
        lng: 77.2288
    }
];
const DEMO_ROADSIDE_POINTS = [
    {
        lat: 28.6250,
        lng: 77.2202
    },
    {
        lat: 28.6178,
        lng: 77.2208
    },
    {
        lat: 28.6128,
        lng: 77.2260
    }
];
}),
"[project]/src/lib/firebase-admin.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "adminAuth",
    ()=>adminAuth,
    "adminDb",
    ()=>adminDb,
    "adminMessaging",
    ()=>adminMessaging,
    "isFirebaseAdminConfigured",
    ()=>isFirebaseAdminConfigured
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin/app [external] (firebase-admin/app, esm_import, [project]/node_modules/firebase-admin)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin/auth [external] (firebase-admin/auth, esm_import, [project]/node_modules/firebase-admin)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import, [project]/node_modules/firebase-admin)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$messaging__$5b$external$5d$__$28$firebase$2d$admin$2f$messaging$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin/messaging [external] (firebase-admin/messaging, esm_import, [project]/node_modules/firebase-admin)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$messaging__$5b$external$5d$__$28$firebase$2d$admin$2f$messaging$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$messaging__$5b$external$5d$__$28$firebase$2d$admin$2f$messaging$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
function isFirebaseAdminConfigured() {
    return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY || process.env.GOOGLE_APPLICATION_CREDENTIALS);
}
function firebaseApp() {
    const existing = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["getApps"])()[0];
    if (existing) return existing;
    const projectId = process.env.FIREBASE_PROJECT_ID || ("TURBOPACK compile-time value", "itd-lab-8a1b2");
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (serviceAccountJson) {
        const account = JSON.parse(serviceAccountJson);
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["initializeApp"])({
            credential: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["cert"])({
                projectId: account.project_id || projectId,
                clientEmail: account.client_email,
                privateKey: account.private_key?.replace(/\\n/g, "\n")
            }),
            projectId: account.project_id || projectId
        });
    }
    if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["initializeApp"])({
            credential: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["cert"])({
                projectId,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
            }),
            projectId
        });
    }
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["initializeApp"])({
        credential: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["applicationDefault"])(),
        projectId
    });
}
const adminAuth = ()=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["getAuth"])(firebaseApp());
const adminDb = ()=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["getFirestore"])(firebaseApp());
const adminMessaging = ()=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$messaging__$5b$external$5d$__$28$firebase$2d$admin$2f$messaging$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["getMessaging"])(firebaseApp());
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/geospatial.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "distanceMeters",
    ()=>distanceMeters,
    "findCorridorCandidates",
    ()=>findCorridorCandidates,
    "nearestRouteSegment",
    ()=>nearestRouteSegment,
    "projectOntoRoute",
    ()=>projectOntoRoute,
    "routeBearing",
    ()=>routeBearing,
    "routeDistanceAtSegment",
    ()=>routeDistanceAtSegment
]);
const EARTH_RADIUS_M = 6_371_000;
const toRadians = (degrees)=>degrees * Math.PI / 180;
function distanceMeters(a, b) {
    const lat1 = toRadians(a.lat);
    const lat2 = toRadians(b.lat);
    const deltaLat = lat2 - lat1;
    const deltaLng = toRadians(b.lng - a.lng);
    const haversine = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
    return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(haversine));
}
function localProjection(point, origin) {
    const metersPerDegreeLat = 111_320;
    const metersPerDegreeLng = 111_320 * Math.cos(toRadians(origin.lat));
    return {
        x: (point.lng - origin.lng) * metersPerDegreeLng,
        y: (point.lat - origin.lat) * metersPerDegreeLat
    };
}
function projectOntoRoute(point, route) {
    if (route.length < 2) return {
        crossTrackMeters: Number.POSITIVE_INFINITY,
        alongRouteMeters: 0
    };
    let walkedMeters = 0;
    let best = {
        crossTrackMeters: Number.POSITIVE_INFINITY,
        alongRouteMeters: 0
    };
    for(let index = 0; index < route.length - 1; index += 1){
        const start = route[index];
        const end = route[index + 1];
        const p = localProjection(point, start);
        const q = localProjection(end, start);
        const segmentLength = Math.hypot(q.x, q.y);
        const t = segmentLength === 0 ? 0 : Math.max(0, Math.min(1, (p.x * q.x + p.y * q.y) / segmentLength ** 2));
        const crossTrackMeters = Math.hypot(p.x - t * q.x, p.y - t * q.y);
        const alongRouteMeters = walkedMeters + t * segmentLength;
        if (crossTrackMeters < best.crossTrackMeters) best = {
            crossTrackMeters,
            alongRouteMeters
        };
        walkedMeters += segmentLength;
    }
    return best;
}
function routeDistanceAtSegment(route, segmentIndex, location) {
    const safeIndex = Math.min(Math.max(segmentIndex, 0), route.length - 2);
    let walkedMeters = 0;
    for(let index = 0; index < safeIndex; index += 1)walkedMeters += distanceMeters(route[index], route[index + 1]);
    const segmentProjection = projectOntoRoute(location, [
        route[safeIndex],
        route[safeIndex + 1]
    ]);
    return walkedMeters + segmentProjection.alongRouteMeters;
}
function routeBearing(route, segmentIndex) {
    const safeIndex = Math.min(Math.max(segmentIndex, 0), route.length - 2);
    const start = route[safeIndex];
    const end = route[safeIndex + 1];
    const lat1 = toRadians(start.lat);
    const lat2 = toRadians(end.lat);
    const deltaLng = toRadians(end.lng - start.lng);
    const y = Math.sin(deltaLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}
function nearestRouteSegment(point, route) {
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    for(let index = 0; index < route.length - 1; index += 1){
        const projection = projectOntoRoute(point, [
            route[index],
            route[index + 1]
        ]);
        if (projection.crossTrackMeters < bestDistance) {
            bestDistance = projection.crossTrackMeters;
            bestIndex = index;
        }
    }
    return bestIndex;
}
function findCorridorCandidates(args) {
    if (args.route.length < 2) return [];
    const corridorMeters = args.corridorMeters ?? 180;
    const lookAheadMeters = args.lookAheadMeters ?? 1_000;
    const safeSegment = Math.min(Math.max(args.currentSegment, 0), args.route.length - 2);
    const ambulanceCrossTrack = projectOntoRoute(args.current, [
        args.route[safeSegment],
        args.route[safeSegment + 1]
    ]).crossTrackMeters;
    if (ambulanceCrossTrack > corridorMeters) return [];
    const ambulanceAlong = routeDistanceAtSegment(args.route, args.currentSegment, args.current);
    return args.users.flatMap((user)=>{
        const projected = projectOntoRoute(user.point, args.route);
        const aheadMeters = projected.alongRouteMeters - ambulanceAlong;
        if (projected.crossTrackMeters > corridorMeters || aheadMeters < 40 || aheadMeters > lookAheadMeters) return [];
        return [
            {
                uid: user.uid,
                distanceMeters: Math.round(aheadMeters)
            }
        ];
    });
}
}),
"[project]/src/lib/server/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "AuthError",
    ()=>AuthError,
    "clearDemoSessionCookie",
    ()=>clearDemoSessionCookie,
    "createDemoUser",
    ()=>createDemoUser,
    "demoSessionCookie",
    ()=>demoSessionCookie,
    "errorResponse",
    ()=>errorResponse,
    "isDemoMode",
    ()=>isDemoMode,
    "isRole",
    ()=>isRole,
    "requireUser",
    ()=>requireUser
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase-admin.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const DEMO_COOKIE = "ambulance_demo_session";
const roles = [
    "ambulance",
    "road-user",
    "admin"
];
const isProduction = ("TURBOPACK compile-time value", "development") === "production";
const isDemoMode = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isFirebaseAdminConfigured"])() && !isProduction && process.env.DEMO_MODE !== "false";
function demoSecret() {
    return process.env.DEMO_SESSION_SECRET || "local-demo-only-change-before-deploying";
}
function sign(value) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"])("sha256", demoSecret()).update(value).digest("base64url");
}
function safeCompare(a, b) {
    const first = Buffer.from(a);
    const second = Buffer.from(b);
    return first.length === second.length && (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"])(first, second);
}
function serializeDemoUser(user) {
    const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
    return `${payload}.${sign(payload)}`;
}
function readDemoUser(request) {
    const value = request.cookies.get(DEMO_COOKIE)?.value;
    if (!value) return null;
    const [payload, signature] = value.split(".");
    if (!payload || !signature || !safeCompare(sign(payload), signature)) return null;
    try {
        const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        return parsed.uid && roles.includes(parsed.role) ? parsed : null;
    } catch  {
        return null;
    }
}
function demoSessionCookie(user) {
    const secure = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "";
    return `${DEMO_COOKIE}=${serializeDemoUser(user)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200${secure}`;
}
function clearDemoSessionCookie() {
    const secure = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "";
    return `${DEMO_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}
async function createDemoUser(name, role) {
    return {
        uid: `demo_${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])()}`,
        name: name.trim().slice(0, 48),
        role,
        demo: true
    };
}
async function requireUser(request) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isFirebaseAdminConfigured"])()) {
        const header = request.headers.get("authorization");
        const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
        if (!token) throw new AuthError("Sign in to continue.", 401);
        try {
            const decoded = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminAuth"])().verifyIdToken(token);
            const profile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"])().collection("users").doc(decoded.uid).get();
            const email = decoded.email || undefined;
            const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((value)=>value.trim().toLowerCase()).filter(Boolean);
            const configuredRole = email && adminEmails.includes(email.toLowerCase()) ? "admin" : decoded.role || profile.get("role");
            const role = roles.includes(configuredRole) ? configuredRole : "road-user";
            return {
                uid: decoded.uid,
                email,
                name: profile.get("name") || decoded.name || email?.split("@")[0] || "Account",
                role
            };
        } catch  {
            throw new AuthError("Your sign-in has expired. Sign in again.", 401);
        }
    }
    if (isDemoMode) {
        const user = readDemoUser(request);
        if (user) return user;
        throw new AuthError("Open a demo dashboard to start a session.", 401);
    }
    throw new AuthError("Firebase server credentials are required.", 503);
}
class AuthError extends Error {
    status;
    constructor(message, status = 401){
        super(message), this.status = status;
    }
}
function isRole(role, allowed) {
    return allowed.includes(role);
}
function errorResponse(error) {
    if (error instanceof AuthError) {
        return Response.json({
            error: error.message
        }, {
            status: error.status
        });
    }
    console.error("API request failed", error);
    return Response.json({
        error: "Something went wrong. Please try again."
    }, {
        status: 500
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/server/store.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "closeEmergency",
    ()=>closeEmergency,
    "createEmergency",
    ()=>createEmergency,
    "getDashboardSnapshot",
    ()=>getDashboardSnapshot,
    "registerDemoUser",
    ()=>registerDemoUser,
    "saveFcmToken",
    ()=>saveFcmToken,
    "writeLocation",
    ()=>writeLocation
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demo$2d$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/demo-route.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$geospatial$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/geospatial.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase-admin.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const root = globalThis;
const demoState = root.__ambulanceDemoState ??= {
    locations: new Map(),
    emergencies: new Map(),
    alerts: new Map(),
    tokens: new Map(),
    roadsideIndex: 0
};
function now() {
    return Date.now();
}
function storeInFirebase() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isFirebaseAdminConfigured"])();
}
async function registerDemoUser(user) {
    if (storeInFirebase()) return;
    if (user.role === "road-user") {
        const point = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demo$2d$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEMO_ROADSIDE_POINTS"][demoState.roadsideIndex % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demo$2d$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEMO_ROADSIDE_POINTS"].length];
        demoState.roadsideIndex += 1;
        demoState.locations.set(user.uid, {
            ...point,
            uid: user.uid,
            name: user.name,
            role: user.role,
            updatedAt: now(),
            simulated: true
        });
    }
}
async function createEmergency(user, mode) {
    const existing = (await listEmergencies()).find((item)=>item.ambulanceId === user.uid && item.status === "active");
    if (existing) return existing;
    const emergency = {
        id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
        ambulanceId: user.uid,
        ambulanceName: user.name,
        status: "active",
        mode,
        route: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demo$2d$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEMO_ROUTE"],
        routeName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demo$2d$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEMO_ROUTE_NAME"],
        currentSegment: 0,
        createdAt: now(),
        updatedAt: now()
    };
    if (storeInFirebase()) {
        const reference = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"])().collection("emergencies").doc();
        emergency.id = reference.id;
        await reference.set(emergency);
    } else demoState.emergencies.set(emergency.id, emergency);
    return emergency;
}
async function closeEmergency(user, emergencyId) {
    const emergency = await getEmergency(emergencyId);
    if (!emergency || emergency.ambulanceId !== user.uid) return false;
    const closed = {
        ...emergency,
        status: "closed",
        updatedAt: now()
    };
    if (storeInFirebase()) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"])().collection("emergencies").doc(emergencyId).set(closed);
    else demoState.emergencies.set(emergencyId, closed);
    return true;
}
async function getEmergency(id) {
    if (storeInFirebase()) {
        const document = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"])().collection("emergencies").doc(id).get();
        return document.exists ? document.data() : undefined;
    }
    return demoState.emergencies.get(id);
}
async function listEmergencies() {
    if (storeInFirebase()) {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"])().collection("emergencies").get();
        return result.docs.map((document)=>document.data());
    }
    return [
        ...demoState.emergencies.values()
    ];
}
async function listLocations() {
    if (storeInFirebase()) {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"])().collection("locations").get();
        return result.docs.map((document)=>document.data());
    }
    return [
        ...demoState.locations.values()
    ];
}
async function writeLocation(args) {
    let activeEmergency;
    if (args.user.role === "ambulance") {
        if (!args.emergencyId) throw new Error("Start an emergency before sharing an ambulance location.");
        activeEmergency = await getEmergency(args.emergencyId);
        if (!activeEmergency || activeEmergency.status !== "active" || activeEmergency.ambulanceId !== args.user.uid) {
            throw new Error("Active emergency not found for this ambulance account.");
        }
    }
    const location = {
        ...args.point,
        uid: args.user.uid,
        name: args.user.name,
        role: args.user.role,
        heading: args.heading ?? null,
        updatedAt: now(),
        simulated: args.simulated
    };
    if (storeInFirebase()) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"])().collection("locations").doc(args.user.uid).set(location);
    else demoState.locations.set(args.user.uid, location);
    if (!activeEmergency) return {
        location,
        alertsCreated: 0
    };
    const emergency = activeEmergency;
    const requestedSegment = typeof args.segment === "number" && Number.isFinite(args.segment) ? Math.trunc(args.segment) : emergency.currentSegment;
    const segment = Math.max(0, Math.min(emergency.route.length - 2, requestedSegment));
    const updatedEmergency = {
        ...emergency,
        mode: args.simulated ? "simulated" : "live",
        currentSegment: segment,
        updatedAt: now()
    };
    if (storeInFirebase()) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"])().collection("emergencies").doc(emergency.id).set(updatedEmergency);
    else demoState.emergencies.set(emergency.id, updatedEmergency);
    const roadUsers = (await listLocations()).filter((item)=>item.role === "road-user" && item.uid !== args.user.uid);
    const candidates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$geospatial$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["findCorridorCandidates"])({
        route: emergency.route,
        current: args.point,
        currentSegment: segment,
        users: roadUsers.map((item)=>({
                uid: item.uid,
                point: item
            }))
    });
    let alertsCreated = 0;
    for (const candidate of candidates){
        const alertId = `${emergency.id}_${candidate.uid}`;
        if (await getAlert(alertId)) continue;
        const roadUser = roadUsers.find((item)=>item.uid === candidate.uid);
        if (!roadUser) continue;
        const token = await getFcmToken(candidate.uid);
        let status = "in-app";
        let channel = "in-app";
        if (token && storeInFirebase()) {
            channel = "push";
            try {
                const pushLink = process.env.APP_BASE_URL?.startsWith("https://") ? new URL("/road-user", process.env.APP_BASE_URL).toString() : undefined;
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminMessaging"])().send({
                    token,
                    notification: {
                        title: "Ambulance approaching",
                        body: `An ambulance is about ${candidate.distanceMeters} m away on your route. Please make way when safe.`
                    },
                    data: {
                        emergencyId: emergency.id,
                        url: "/road-user"
                    },
                    webpush: pushLink ? {
                        fcmOptions: {
                            link: pushLink
                        }
                    } : undefined
                });
                status = "sent";
            } catch (error) {
                console.error("FCM send failed", error);
                status = "failed";
            }
        }
        const alert = {
            id: alertId,
            emergencyId: emergency.id,
            ambulanceId: args.user.uid,
            userId: roadUser.uid,
            userName: roadUser.name,
            distanceMeters: candidate.distanceMeters,
            status,
            channel,
            createdAt: now()
        };
        if (storeInFirebase()) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"])().collection("alerts").doc(alertId).set(alert);
        else demoState.alerts.set(alertId, alert);
        alertsCreated += 1;
    }
    return {
        location,
        alertsCreated
    };
}
async function getAlert(id) {
    if (storeInFirebase()) {
        const document = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"])().collection("alerts").doc(id).get();
        return document.exists ? document.data() : undefined;
    }
    return demoState.alerts.get(id);
}
async function getFcmToken(uid) {
    if (storeInFirebase()) {
        const document = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"])().collection("users").doc(uid).get();
        return document.get("fcmToken");
    }
    return demoState.tokens.get(uid);
}
async function saveFcmToken(user, token) {
    if (storeInFirebase()) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"])().collection("users").doc(user.uid).set({
            name: user.name,
            role: user.role,
            fcmToken: token
        }, {
            merge: true
        });
    } else demoState.tokens.set(user.uid, token);
}
async function getDashboardSnapshot(user) {
    const [allLocations, allEmergencies, allAlerts] = await Promise.all([
        listLocations(),
        listEmergencies(),
        storeInFirebase() ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"])().collection("alerts").get().then((result)=>result.docs.map((document)=>document.data())) : Promise.resolve([
            ...demoState.alerts.values()
        ])
    ]);
    const locations = user.role === "admin" ? allLocations : user.role === "ambulance" ? allLocations.filter((item)=>item.uid === user.uid || item.role === "road-user") : allLocations.filter((item)=>item.uid === user.uid || item.role === "ambulance");
    const alerts = user.role === "admin" ? allAlerts : allAlerts.filter((item)=>user.role === "road-user" ? item.userId === user.uid : item.ambulanceId === user.uid);
    return {
        user,
        locations,
        emergencies: allEmergencies.filter((item)=>user.role === "admin" ? true : item.status === "active" && (user.role !== "ambulance" || item.ambulanceId === user.uid)).sort((a, b)=>b.updatedAt - a.updatedAt),
        alerts: alerts.sort((a, b)=>b.createdAt - a.createdAt).slice(0, 60),
        firebaseConfigured: storeInFirebase()
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0761tcn6c74oc._.js.map