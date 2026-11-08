
"use client";

import AdminRecordManager from "../_components/AdminRecordManager";

export default function InquiriesClient() {
  return (
    <AdminRecordManager
      table="custom_designs"
      title="Custom Design Inquiries"
      description="Review and update existing customer custom-design requests."
    />
  );
}
