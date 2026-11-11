
"use client";

import AdminSettingsEditor from "../AdminSettingsEditor";

export default function ThemeTokensClient() {
  return (
    <AdminSettingsEditor
      moduleKey="theme"
      title="Theme Tokens"
      description="Manage the design-token values for the POMS visual system. These values are saved as configuration data; they will not change the live website until the public theme components are connected to read them."
      examples={[
        {
          key: "brand_colors",
          label: "Brand colors",
          help: "Core brand palette. Use valid CSS color values.",
          value: {
            black: "#101010",
            gold: "#C6A15B",
            ivory: "#F4F0E8",
            white: "#FFFFFF",
          },
        },
        {
          key: "typography",
          label: "Typography",
          help: "Font-family tokens for headings and body text.",
          value: {
            heading: "serif",
            body: "sans-serif",
          },
        },
        {
          key: "spacing",
          label: "Spacing",
          help: "Reusable spacing scale in CSS-compatible values.",
          value: {
            section: "5rem",
            content: "1.5rem",
            compact: "0.75rem",
          },
        },
        {
          key: "layout",
          label: "Layout",
          help: "Global layout dimensions.",
          value: {
            content_max_width: "1440px",
            header_height: "88px",
          },
        },
        {
          key: "buttons",
          label: "Buttons",
          help: "Button appearance tokens.",
          value: {
            border_radius: "0px",
            text_transform: "uppercase",
          },
        },
        {
          key: "motion",
          label: "Motion",
          help: "Animation and transition preferences.",
          value: {
            duration: "300ms",
            reduced_motion_supported: true,
          },
        },
      ]}
    />
  );
}
