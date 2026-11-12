import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import AdminRecordManager from "../_components/AdminRecordManager";

export const dynamic = "force-dynamic";

export default async function WholesaleInquiriesPage() {
  await requireAdminAccess(["wholesale_manager", "content_manager"]);
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <AdminRecordManager
        table="wholesale_inquiries"
        title="Wholesale Inquiries"
        description="Review and update incoming international wholesale and bulk-order inquiries."
      />
    </div>
  );
}
