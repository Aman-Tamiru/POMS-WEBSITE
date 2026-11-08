
import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import QuotationsClient from "./QuotationsClient";

export const dynamic = "force-dynamic";

export default async function QuotationsPage() {
  await requireAdminAccess(["content_manager"]);
  return <QuotationsClient />;
}
