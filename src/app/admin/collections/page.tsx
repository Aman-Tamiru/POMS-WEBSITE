import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import CollectionManagerClient from "./CollectionManagerClient";

export const dynamic = "force-dynamic";

export default async function CollectionsAdminPage() {
  await requireAdminAccess(["product_manager"]);

  return <CollectionManagerClient />;
}