import React from 'react';
import StudentNavbar from "@/components/section/StudentNavbar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StudentNavbar />
      <main className="pt-16">
        {children}
      </main>
    </>
  );
}