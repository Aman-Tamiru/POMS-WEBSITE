
import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import OrderTrackerClient from "./OrderTrackerClient";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  await requireAdminAccess(["content_manager"]);
  return <OrderTrackerClient />;
}
