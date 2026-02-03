// /app/faculty/reviews/page.tsx
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";
import { getFacultyReviews } from "@/app/actions/getFacultyData";
import { FacultyReviewsContent } from "@/components/faculty/FacultyReviewsContent";

export default async function ReviewsPage() {
  const role = await getUserRole();

  if (!role || role !== "FACULTY") {
    redirect("/");
  }

  const reviews = await getFacultyReviews();

  return <FacultyReviewsContent reviews={reviews} />;
}