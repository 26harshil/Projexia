import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/api/webhooks(.*)", "/api/stream-token", "/api/chat/(.*)", "/chat"]);
const isCheckRoleRoute = createRouteMatcher(["/check-role"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isFacultyRoute = createRouteMatcher(["/faculty(.*)"]);
const isStudentRoute = createRouteMatcher(["/student(.*)"]);
const isDashboardRoute = createRouteMatcher(["/admin/dashboard", "/faculty/dashboard", "/student/dashboard"]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata?.role as string) || "STUDENT";

    // Protect all non-public routes
    if (!isPublicRoute(req) && !isCheckRoleRoute(req)) {
        await auth.protect();
    }

    // Automatic redirect for authenticated users (but NOT if already on a dashboard)
    if (userId) {
        const { pathname } = req.nextUrl;

        // Only redirect from home or check-role, NOT from dashboard pages
        if ((pathname === "/" || isCheckRoleRoute(req)) && !isDashboardRoute(req)) {
            const dashboardPath = `/${role.toLowerCase()}/dashboard`;
            return NextResponse.redirect(new URL(dashboardPath, req.url));
        }

        // Role-based route protection - redirect to user's own dashboard if accessing wrong role
        // But don't redirect if already on the correct dashboard
        if (isAdminRoute(req) && role !== "ADMIN" && !isDashboardRoute(req)) {
            return NextResponse.redirect(new URL(`/${role.toLowerCase()}/dashboard`, req.url));
        }

        if (isFacultyRoute(req) && role !== "FACULTY" && !isDashboardRoute(req)) {
            return NextResponse.redirect(new URL(`/${role.toLowerCase()}/dashboard`, req.url));
        }

        if (isStudentRoute(req) && role !== "STUDENT" && !isDashboardRoute(req)) {
            return NextResponse.redirect(new URL(`/${role.toLowerCase()}/dashboard`, req.url));
        }
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
