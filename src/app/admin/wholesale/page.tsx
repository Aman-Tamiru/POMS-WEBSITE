
import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import WholesaleRulesClient from "./WholesaleRulesClient";

export const dynamic = "force-dynamic";

export default async function WholesaleRulesPage() {
  await requireAdminAccess(["wholesale_manager", "content_manager"]);
  return <WholesaleRulesClient />;
}
