// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { currentUser } from "@clerk/nextjs/server";
// import { prisma } from "@/lib/prisma";

// export default async function DashboardPage() {
//   // 1. Get authentication and organization info from Clerk
//   const { isAuthenticated, orgId, orgRole } = await auth();
//   const clerkUser = await currentUser();
  
//   // 2. Security Check: If no user, redirect to home
//   if (!isAuthenticated || !clerkUser) {
//     redirect("/");
//   }

//   // 3. Require active organization
//   if (!orgId) {
//     return (
//       <div className="p-10 text-center">
//         <h1 className="text-2xl font-bold text-yellow-600">Organization Required</h1>
//         <p className="text-slate-600 mb-4">Please select or create an organization to access the dashboard.</p>
//       </div>
//     );
//   }

//   // 4. Sync User with Database (for backward compatibility and data storage)
//   let dbUser = await prisma.users.findUnique({
//     where: { clerkid: clerkUser.id },
//     include: { student: true, staff: true }
//   });

//   // 5. Onboarding (First Time Login or Legacy User Sync)
//   if (!dbUser) {
//     const email = clerkUser.emailAddresses[0]?.emailAddress;
    
//     // Check if user exists by Email (Legacy check)
//     const existingUserByEmail = await prisma.users.findUnique({
//       where: { email: email },
//       include: { student: true, staff: true }
//     });

//     if (existingUserByEmail) {
//       try {
//         dbUser = await prisma.users.update({
//           where: { email: email },
//           data: { clerkid: clerkUser.id },
//           include: { student: true, staff: true }
//         });
//       } catch (err) {
//         console.error("Error linking ClerkID:", err);
//       }
//     } else {
//       try {
//         // Map Clerk orgRole to database role
//         let dbRole = "STUDENT"; // Default
//         if (orgRole === "Admin") dbRole = "ADMIN";
//         else if (orgRole === "Faculty") dbRole = "FACULTY";
//         else if (orgRole === "Student") dbRole = "STUDENT";

//         const newLocal = dbUser = await prisma.users.create({
//           data: {
//             clerkid: clerkUser.id,
//             email: email,
//             role: dbRole,
//             student: orgRole === "Student" ? {
//               create: {
//                 studentname: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || "Student",
//                 email: email
//               }
//             } : undefined,
//             staff: orgRole === "Faculty" ? {
//               create: {
//                 staffname: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || "Faculty",
//                 email: email
//               }
//             } : undefined,
//           },
//           include: { student: true, staff: true }
//         });
//       } catch (error) {
//         console.error("Error creating user:", error);
//       }
//     }
//   }

//   // 6. Route based on Clerk organization role (primary source of truth)
//   // Middleware should handle most redirects, but this is a fallback
//   if (orgRole === "Admin") {
//     redirect("/dashboard/admin_dashboard");
//   } else if (orgRole === "Student") {
//     redirect("/dashboard/student_dashboard");
//   } else if (orgRole === "Faculty") {
//     redirect("/dashboard/faculty_dashboard");
//   }

//   // Fallback if role doesn't match
//   return (
//     <div className="p-10 text-center">
//       <h1 className="text-2xl font-bold text-red-500">Access Error</h1>
//       <p className="text-slate-600 mb-4">
//         Your organization role <strong>{orgRole || 'None'}</strong> does not have a dashboard assigned.
//       </p>
//       <p className="text-sm text-slate-400">Please contact your administrator to assign a valid role.</p>
//     </div>
//   );
// }