import React from 'react';
import AdminNavbar from "@/components/section/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNavbar />
      <main className="pt-16">
        {children}
      </main>
    </>
  );
}