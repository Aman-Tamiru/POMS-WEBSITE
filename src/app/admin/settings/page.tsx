
import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import WebsiteSettingsClient from "./WebsiteSettingsClient";

export const dynamic = "force-dynamic";

export default async function WebsiteSettingsPage() {
  await requireAdminAccess(["content_manager"]);
  return <WebsiteSettingsClient />;
}
