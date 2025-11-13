import React from "react";

export default function ZoneHeatMini({ data = [], label = "Zones" }) {
  const max = data.reduce((m, r) => Math.max(m, r.orders || 0), 1);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm muted">{label}</div>
        <div className="text-xs muted">by orders</div>
      </div>

      <div className="mt-3 space-y-2">
        {data.map((row) => {
          const pct = Math.round(((row.orders || 0) / max) * 100);
          return (
            <div key={row.zone}>
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">{row.zone}</div>
                <div className="muted">{row.orders}</div>
              </div>
              <div className="mt-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
