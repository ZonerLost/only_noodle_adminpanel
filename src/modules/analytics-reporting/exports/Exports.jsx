import React, { useState } from "react";
import { exportCSV } from "../api/analytics.service.js";
import DateRange from "../components/DateRange.jsx";

export default function Exports() {
  const [range, setRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return {
      from: start.toISOString().slice(0, 10),
      to: end.toISOString().slice(0, 10),
    };
  });
  const [type, setType] = useState("orders");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function runExport() {
    setBusy(true);
    setMsg("");
    const csv = await exportCSV({ ...range, type });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-${range.from}_${range.to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setBusy(false);
    setMsg("Export ready.");
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Exports</h1>
            <div className="muted text-sm">Download CSV files for analysis</div>
          </div>
        </div>

        <div className="card p-4 space-y-3 max-w-2xl">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="muted text-xs mb-1">Date range</div>
              <DateRange from={range.from} to={range.to} onChange={setRange} />
            </div>
            <div>
              <div className="muted text-xs mb-1">Type</div>
              <select
                className="input"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="orders">Orders</option>
                <option value="tips">Tips</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn" disabled={busy} onClick={runExport}>
              {busy ? "Exporting…" : "Export CSV"}
            </button>
            {msg && <div className="muted text-sm">{msg}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
