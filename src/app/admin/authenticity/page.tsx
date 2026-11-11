
import { requireAdminAccess } from "@/lib/supabase/admin-auth";
import AuthenticityClient from "./AuthenticityClient";

export const dynamic = "force-dynamic";

export default async function AuthenticityPage() {
  await requireAdminAccess(["product_manager", "content_manager"]);
  return <AuthenticityClient />;
}
