
"use client";

import AdminSettingsEditor from "../AdminSettingsEditor";

export default function ShippingCustomsClient() {
  return (
    <AdminSettingsEditor
      moduleKey="shipping"
      title="Shipping & Customs"
      description="Maintain general shipping policies, export documentation guidance, customs information, and delivery estimates. These settings do not automatically update existing orders or calculate live shipping prices."
      examples={[
        {
          key: "shipping_regions",
          label: "Shipping regions",
          help: "Regions served and general delivery information.",
          value: {
            regions: [
              { name: "East Africa", estimate_days: "To be confirmed" },
              { name: "International", estimate_days: "To be confirmed" },
            ],
          },
        },
        {
          key: "shipping_methods",
          label: "Shipping methods",
          help: "Shipping methods available for quotation.",
          value: { methods: ["Air freight", "Sea freight", "Courier"] },
        },
        {
          key: "export_documents",
          label: "Export documents",
          help: "Documents that may be required depending on destination and shipment.",
          value: {
            documents: [
              "Commercial invoice",
              "Packing list",
              "Certificate of origin",
              "Transport document",
            ],
          },
        },
        {
          key: "customs_policy",
          label: "Customs policy",
          help: "Explain that import duties and taxes depend on the destination.",
          value: {
            duties_paid_by: "Buyer unless agreed otherwise",
            disclaimer: "Customs requirements and charges vary by destination.",
          },
        },
        {
          key: "shipping_contact",
          label: "Shipping contact",
          help: "Internal contact details for shipment coordination.",
          value: { email: "", phone: "" },
        },
      ]}
    />
  );
}
