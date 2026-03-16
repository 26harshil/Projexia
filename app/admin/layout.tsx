// /app/admin/layout.tsx
import React from 'react';
import AdminNavbar from "@/components/section/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050A14]">
      <AdminNavbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}