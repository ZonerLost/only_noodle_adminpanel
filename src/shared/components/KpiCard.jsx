import React from "react";
export default function KpiCard({ label, value, hint }) {
  return (
    <div className="card p-4">
      <div className="muted text-sm">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {hint && <div className="muted text-xs">{hint}</div>}
    </div>
  );
}
