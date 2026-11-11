
"use client";

import AdminSettingsEditor from "../AdminSettingsEditor";

export default function WholesaleRulesClient() {
  return (
    <AdminSettingsEditor
      moduleKey="wholesale"
      title="Wholesale Rules"
      description="Manage global wholesale policies, minimum order guidance, packaging expectations, payment terms, and customer-facing wholesale information. Product-specific MOQ and package quantities remain managed in Product Manager."
      examples={[
        {
          key: "minimum_order_value",
          label: "Minimum order value",
          help: "Global minimum wholesale order value. Set the amount and currency.",
          value: { amount: 0, currency: "USD" },
        },
        {
          key: "payment_terms",
          label: "Payment terms",
          help: "Default payment terms shown to wholesale customers.",
          value: { deposit_percent: 50, balance_due: "before_dispatch" },
        },
        {
          key: "production_lead_time",
          label: "Production lead time",
          help: "General production estimate. Do not use as a guaranteed delivery date.",
          value: { minimum_days: 14, maximum_days: 30 },
        },
        {
          key: "wholesale_countries",
          label: "Wholesale destinations",
          help: "Countries or regions where wholesale inquiries are accepted.",
          value: { destinations: ["Ethiopia", "Somalia", "International"] },
        },
        {
          key: "packaging_policy",
          label: "Packaging policy",
          help: "General packaging and carton information.",
          value: { cartons_required: true, details: "" },
        },
        {
          key: "customization_policy",
          label: "Customization policy",
          help: "General rules for custom wholesale requests.",
          value: { customization_available: true, details: "" },
        },
      ]}
    />
  );
}
