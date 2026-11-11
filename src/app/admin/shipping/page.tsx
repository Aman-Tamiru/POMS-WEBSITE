
import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import ShippingCustomsClient from "./ShippingCustomsClient";

export const dynamic = "force-dynamic";

export default async function ShippingCustomsPage() {
  await requireAdminAccess(["wholesale_manager", "content_manager"]);
  return <ShippingCustomsClient />;
}
