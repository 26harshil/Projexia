export type Role = "ADMIN" | "FACULTY" | "STUDENT";
export const NAVBAR_CONFIG: Record<Role, {
    title: string;
    links: { name: string, href: string }[];
}> = {
    STUDENT: {
        title: "Student Portal",
        links: [
            { name: "Dashboard", href: "/student/dashboard" },
            { name: "My Project", href: "/student/project" },
            { name: "My Group", href: "/student/group" },
            { name: "Meetings", href: "/student/meetings" },
            { name: "Reports", href: "/student/reports" },
        ]
    }, FACULTY: {
        title: "Faculty Portal",
        links: [
            { name: "Dashboard", href: "/faculty/dashboard" },
            { name: "My Groups", href: "/faculty/groups" },
            { name: "Project Reviews", href: "/faculty/reviews" },
            { name: "Meetings", href: "/faculty/meetings" },
            { name: "Reports", href: "/faculty/reports" },

        ]
    }, ADMIN: {
        title: "Admin Portal",
        links: [
            { name: "Dashboard", href: "/admin/dashboard" },
            { name: "Master Config", href: "/admin/master" },
            { name: "Students", href: "/admin/students" },
            { name: "Projects", href: "/admin/projects" },
            { name: "Meetings", href: "/admin/meetings" },
            { name: "Reports", href: "/admin/reports" },

        ]
    }
}