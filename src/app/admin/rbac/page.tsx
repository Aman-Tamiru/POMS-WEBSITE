
import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import RBACClient from "./RBACClient";

export const dynamic = "force-dynamic";

export default async function RBACPage() {
  await requireAdminAccess(["owner"]);
  return <RBACClient />;
}
