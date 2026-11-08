
import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import InquiriesClient from "./InquiriesClient";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  await requireAdminAccess(["content_manager"]);
  return <InquiriesClient />;
}
