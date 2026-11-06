
import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type AdminAccess = {
  user: {
    id: string;
    email?: string;
  };
  roles: string[];
};

export async function requireAdminAccess(
  allowedRoles: string[] = []
): Promise<AdminAccess> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  const admin = createAdminClient();

  const { data: staffRoles, error } = await admin
    .from("staff_roles")
    .select("role")
    .eq("profile_id", user.id)
    .eq("active", true);

  if (error || !staffRoles?.length) {
    redirect("/admin/login?error=unauthorized");
  }

  const roles = staffRoles.map((item) => item.role as string);

  const hasFullAccess = roles.some((role) =>
    ["owner", "super_admin"].includes(role)
  );

  const hasModuleAccess =
    allowedRoles.length === 0 ||
    roles.some((role) => allowedRoles.includes(role));

  if (!hasFullAccess && !hasModuleAccess) {
    redirect("/admin/login?error=unauthorized");
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    roles,
  };
}
