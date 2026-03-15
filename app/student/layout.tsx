// /app/student/layout.tsx
import React from 'react';
import StudentNavbar from "@/components/section/StudentNavbar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050A14]">
      <StudentNavbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}