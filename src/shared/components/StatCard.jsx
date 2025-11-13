import React from "react";
export default function StatCard({ title, children, footer }) {
  return (
    <div className="card p-4">
      <div className="font-semibold mb-2">{title}</div>
      <div>{children}</div>
      {footer && <div className="muted text-xs mt-2">{footer}</div>}
    </div>
  );
}
