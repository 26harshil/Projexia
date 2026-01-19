import { Role } from "@/app/generated/prisma/enums";

/**
 * Role utility functions for consistent role handling across the application
 */

/**
 * Returns the dashboard path for a given role
 * @param role - User role (ADMIN, FACULTY, or STUDENT)
 * @returns Dashboard path string
 */
export function getRoleDashboardPath(role: Role | string): string {
    const roleMap: Record<string, string> = {
        ADMIN: "/admin/dashboard",
        FACULTY: "/faculty/dashboard",
        STUDENT: "/student/dashboard",
    };

    return roleMap[role] || "/student/dashboard";
}

/**
 * Returns Tailwind color classes for role badge styling
 * @param role - User role
 * @returns Object with gradient and text color classes
 */
export function getRoleColors(role: Role | string): {
    gradient: string;
    text: string;
    bg: string;
} {
    const colorMap: Record<
        string,
        { gradient: string; text: string; bg: string }
    > = {
        ADMIN: {
            gradient: "from-red-500 to-orange-500",
            text: "text-red-700",
            bg: "bg-red-50",
        },
        FACULTY: {
            gradient: "from-blue-500 to-purple-500",
            text: "text-blue-700",
            bg: "bg-blue-50",
        },
        STUDENT: {
            gradient: "from-green-500 to-cyan-500",
            text: "text-green-700",
            bg: "bg-green-50",
        },
    };

    return (
        colorMap[role] || {
            gradient: "from-gray-500 to-gray-600",
            text: "text-gray-700",
            bg: "bg-gray-50",
        }
    );
}

/**
 * Returns formatted display name for a role
 * @param role - User role
 * @returns Formatted role name
 */
export function getRoleDisplayName(role: Role | string): string {
    const nameMap: Record<string, string> = {
        ADMIN: "Administrator",
        FACULTY: "Faculty Member",
        STUDENT: "Student",
    };

    return nameMap[role] || "Student";
}

/**
 * Checks if a user with given role can access a specific route
 * @param userRole - Current user's role
 * @param route - Route path to check
 * @returns Boolean indicating access permission
 */
export function canAccessRoute(userRole: Role | string, route: string): boolean {
    // Public routes accessible to all
    const publicRoutes = ["/", "/api/webhooks"];
    if (publicRoutes.some((r) => route.startsWith(r))) {
        return true;
    }

    // Role-specific route access
    if (route.startsWith("/admin")) {
        return userRole === "ADMIN";
    }

    if (route.startsWith("/faculty")) {
        return userRole === "FACULTY" || userRole === "ADMIN";
    }

    if (route.startsWith("/student")) {
        return userRole === "STUDENT" || userRole === "FACULTY" || userRole === "ADMIN";
    }

    return false;
}

/**
 * Returns the base role route (without /dashboard)
 * @param role - User role
 * @returns Base role route
 */
export function getRoleBasePath(role: Role | string): string {
    const roleMap: Record<string, string> = {
        ADMIN: "/admin",
        FACULTY: "/faculty",
        STUDENT: "/student",
    };

    return roleMap[role] || "/student";
}
