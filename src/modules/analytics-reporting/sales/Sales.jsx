import React, { useEffect, useMemo, useState } from "react";
import { listSales } from "../api/analytics.service.js";
import DateRange from "../components/DateRange.jsx";
import SparkTiny from "../components/SparkTiny.jsx";

export default function Sales() {
  const [range, setRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29);
    return {
      from: start.toISOString().slice(0, 10),
      to: end.toISOString().slice(0, 10),
    };
  });
  const [groupBy, setGroupBy] = useState("day");
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setBusy(true);
      try {
        const res = await listSales({ ...range, groupBy });
        if (isMounted) setRows(res.series || []);
      } finally {
        if (isMounted) setBusy(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [range, groupBy]);

  const salesSeries = useMemo(
    () => rows.map((r) => +r.sales.toFixed(2)),
    [rows]
  );

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Sales</h1>
            <div className="muted text-sm">Group by day, week or month</div>
          </div>
          <div className="flex items-center gap-3">
            <DateRange from={range.from} to={range.to} onChange={setRange} />
            <select
              className="input"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
            >
              <option value="day">By day</option>
              <option value="week">By week</option>
              <option value="month">By month</option>
            </select>
          </div>
        </div>

        <div className="card p-3 mb-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">Trend</div>
            <SparkTiny values={salesSeries} />
          </div>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">Bucket</th>
                <th className="px-3 py-2">Sales (€)</th>
                <th className="px-3 py-2">Orders</th>
                <th className="px-3 py-2">Tips (€)</th>
              </tr>
            </thead>
            <tbody>
              {busy && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={4}>
                    Loading…
                  </td>
                </tr>
              )}
              {!busy && rows.length === 0 && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={4}>
                    No data
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr
                  key={r.bucket}
                  className="border-t"
                  style={{ borderColor: "var(--line)" }}
                >
                  <td className="px-3 py-2">{r.bucket}</td>
                  <td className="px-3 py-2">€{r.sales.toFixed(2)}</td>
                  <td className="px-3 py-2">{r.orders}</td>
                  <td className="px-3 py-2">€{r.tips.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
