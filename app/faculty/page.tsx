import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";

export default async function FacultyPage() {
  const role = await getUserRole();

  if (role !== "FACULTY") {
    redirect("/");
  }
  
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-slate-900 italic">
        Welcome to Faculty Page Only
      </h1>
    </div>
  );
}
