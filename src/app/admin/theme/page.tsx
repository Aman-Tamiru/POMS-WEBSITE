
import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import ThemeTokensClient from "./ThemeTokensClient";

export const dynamic = "force-dynamic";

export default async function ThemeTokensPage() {
  await requireAdminAccess(["content_manager"]);
  return <ThemeTokensClient />;
}
