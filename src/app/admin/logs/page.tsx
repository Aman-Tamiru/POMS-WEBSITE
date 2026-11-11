
import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import AuditLogsClient from "./AuditLogsClient";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  await requireAdminAccess(["owner"]);
  return <AuditLogsClient />;
}
