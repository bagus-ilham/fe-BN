export const dynamic = "force-dynamic";

import { Metadata } from "next";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const metadata: Metadata = {
  title: "Admin Dashboard | benangbaju",
  description: "Panel manajemen konten benangbaju",
  robots: { index: false, follow: false }, // Prevent SEO indexing for admin pages
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}
