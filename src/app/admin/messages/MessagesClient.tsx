
"use client";

import AdminRecordManager from "../_components/AdminRecordManager";

export default function MessagesClient() {
  return (
    <AdminRecordManager
      table="messages"
      title="Customer Messages"
      description="Review and update existing message records."
    />
  );
}
