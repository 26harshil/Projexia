// /app/student/page.tsx
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";

export default async function StudentPage() {
  const role = await getUserRole();

  if (role !== "STUDENT") {
    redirect("/");
  }

  redirect("/student/dashboard");
}