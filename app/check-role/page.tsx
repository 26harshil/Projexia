import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";

export default async function CheckRolePage() {
  const role = await getUserRole();

  if (role === "ADMIN") {
    redirect("/admin");
  } else if (role === "STUDENT") {
    redirect("/student");
  } else if (role === "FACULTY") {
    redirect("/faculty");
  } else {
    redirect("/");
  }
}
