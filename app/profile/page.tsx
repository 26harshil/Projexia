// /app/profile/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProfileData } from "@/app/actions/profileActions";
import { ProfileContent } from "@/components/profile/ProfileContent";

export default async function ProfilePage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/");
    }

    const profileData = await getProfileData();

    return <ProfileContent profile={profileData} />;
}
