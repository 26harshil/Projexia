import React from 'react';
import FacultyNavbar from "@/components/section/FacultyNavbar";

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050A14]">
      <FacultyNavbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}