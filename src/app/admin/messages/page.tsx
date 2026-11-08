
import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import MessagesClient from "./MessagesClient";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  await requireAdminAccess(["content_manager"]);
  return <MessagesClient />;
}
