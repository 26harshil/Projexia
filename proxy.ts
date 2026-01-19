import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/check-role", "/api/webhooks(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isFacultyRoute = createRouteMatcher(["/faculty(.*)"]);
const isStudentRoute = createRouteMatcher(["/student(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth();
    const role = sessionClaims?.metadata?.role as string;

    // Protect all non-public routes
    if (!isPublicRoute(req)) {
        await auth.protect();
    }

    // Role-based protection
    if (userId) {
        if (isAdminRoute(req) && role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (isFacultyRoute(req) && role !== "FACULTY") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (isStudentRoute(req) && role !== "STUDENT") {
            return NextResponse.redirect(new URL("/", req.url));
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
