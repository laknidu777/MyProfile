import { requireAdmin } from "@/lib/auth-guard";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | Portfolio Studio",
  description: "Manage portfolio projects, skills, experience, and profile settings",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <AdminLayoutClient user={user}>
      {children}
    </AdminLayoutClient>
  );
}
