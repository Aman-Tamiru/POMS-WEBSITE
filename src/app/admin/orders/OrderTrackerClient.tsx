
"use client";

import AdminRecordManager from "../_components/AdminRecordManager";

export default function OrderTrackerClient() {
  return (
    <AdminRecordManager
      table="orders"
      title="Order Production Tracker"
      description="Review and update existing customer order records."
    />
  );
}
