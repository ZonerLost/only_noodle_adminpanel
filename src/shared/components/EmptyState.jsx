import React from "react";
export default function EmptyState({
  title = "No data",
  subtitle = "Try adjusting your filters",
  action,
}) {
  return (
    <div className="card p-6 text-center">
      <div className="text-lg font-semibold">{title}</div>
      <div className="muted">{subtitle}</div>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
