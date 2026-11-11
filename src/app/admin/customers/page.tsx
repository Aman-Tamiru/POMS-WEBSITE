
import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import CustomerDirectoryClient from "./CustomerDirectoryClient";

export const dynamic = "force-dynamic";

export default async function CustomerDirectoryPage() {
  await requireAdminAccess([
    "customer_support",
    "wholesale_manager",
    "content_manager",
    "product_manager",
  ]);

  return <CustomerDirectoryClient />;
}
