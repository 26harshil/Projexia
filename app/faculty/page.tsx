import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";

export default async function FacultyPage() {
  const role = await getUserRole();

  if (role !== "FACULTY") {
    redirect("/");
  }
  
  // Redirect to faculty dashboard
  redirect("/faculty/dashboard");
}
