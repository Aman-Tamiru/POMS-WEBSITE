import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import MediaLibraryClient from "./MediaLibraryClient";

export const dynamic = "force-dynamic";

export default async function MediaLibraryPage() {
  await requireAdminAccess(["content_manager"]);

  return <MediaLibraryClient />;
}