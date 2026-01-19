import React from 'react';
import FacultyNavbar from "@/components/section/FacultyNavbar";

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FacultyNavbar />
      <main className="pt-16">
        {children}
      </main>
    </>
  );
}