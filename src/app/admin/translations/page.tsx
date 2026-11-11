
import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import TranslationMatrixClient from "./TranslationMatrixClient";

export const dynamic = "force-dynamic";

export default async function TranslationMatrixPage() {
  await requireAdminAccess(["content_manager"]);
  return <TranslationMatrixClient />;
}
