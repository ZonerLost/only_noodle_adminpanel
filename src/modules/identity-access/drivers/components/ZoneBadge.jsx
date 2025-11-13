import React from "react";

export default function ZoneBadge({ zone }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
      style={{ background: "var(--line)" }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--primary)" }}
      />
      {zone || "—"}
    </span>
  );
}
