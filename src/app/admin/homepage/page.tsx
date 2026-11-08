import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import HomepageEditorClient from "./HomepageEditorClient";

export const dynamic = "force-dynamic";

export default async function HomepageEditorPage() {
  await requireAdminAccess(["content_manager"]);

  return <HomepageEditorClient />;
}