
"use client";

import AdminRecordManager from "../_components/AdminRecordManager";

export default function QuotationsClient() {
  return (
    <AdminRecordManager
      table="quotations"
      title="Wholesale Quotations"
      description="Review and update existing wholesale quotation records."
    />
  );
}
