
import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import CatalogueLayoutClient from "./CatalogueLayoutClient";

export const dynamic = "force-dynamic";

export default async function CatalogueLayoutPage() {
  await requireAdminAccess(["content_manager"]);
  return <CatalogueLayoutClient />;
}
