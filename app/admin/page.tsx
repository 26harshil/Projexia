// /app/admin/page.tsx
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";

export default async function AdminPage() {
  const role = await getUserRole();

  if (role !== "ADMIN") {
    redirect("/");
  }

  redirect("/admin/dashboard");
}