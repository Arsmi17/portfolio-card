import AdminDashboard from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  // The middleware (`middleware.ts`) is now the single source of truth
  // for protecting this route.
  return <AdminDashboard />;
}