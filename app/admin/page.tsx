import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";

export default async function AdminPage() {
  const role = await getUserRole();

  if (role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-slate-900 italic">
        Welcome to Admin Page Only
      </h1>
    </div>
  );
}
