import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const admin = createAdminClient();

  const { data: staffRole, error } = await admin
    .from("staff_roles")
    .select("role")
    .eq("profile_id", user.id)
    .eq("active", true)
    .in("role", ["owner", "super_admin"])
    .limit(1)
    .maybeSingle();

  if (error || !staffRole) {
    redirect("/admin/login?error=unauthorized");
  }

  return <AdminDashboardClient />;
}