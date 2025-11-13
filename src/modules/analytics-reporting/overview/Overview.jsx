import React, { useEffect, useMemo, useState } from "react";
import { getOverview } from "../api/analytics.service.js";
import DateRange from "../components/DateRange.jsx";
import SparkTiny from "../components/SparkTiny.jsx";

export default function Overview() {
  const [range, setRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    return {
      from: start.toISOString().slice(0, 10),
      to: end.toISOString().slice(0, 10),
    };
  });

  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);

  const { from, to } = range;

  useEffect(() => {
    let mounted = true;
    async function load() {
      setBusy(true);
      try {
        const res = await getOverview({ from, to });
        if (mounted) setData(res);
      } finally {
        if (mounted) setBusy(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [from, to]);

  const salesSeries = useMemo(
    () => (data?.series || []).map((s) => +s.sales.toFixed(2)),
    [data]
  );
  const ordersSeries = useMemo(
    () => (data?.series || []).map((s) => s.orders),
    [data]
  );
  const tipsSeries = useMemo(
    () => (data?.series || []).map((s) => +s.tips.toFixed(2)),
    [data]
  );

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Analytics Overview</h1>
            <div className="muted text-sm">
              Daily performance across sales, orders, tips & zones
            </div>
          </div>
          <DateRange from={range.from} to={range.to} onChange={setRange} />
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mb-3">
          <div className="card p-3">
            <div className="muted text-xs">Sales (€)</div>
            <div className="text-2xl font-semibold">
              €{data ? data.kpis.totalSales.toFixed(2) : "—"}
            </div>
            <SparkTiny values={salesSeries} />
          </div>
          <div className="card p-3">
            <div className="muted text-xs">Orders</div>
            <div className="text-2xl font-semibold">
              {data ? data.kpis.totalOrders : "—"}
            </div>
            <SparkTiny values={ordersSeries} />
          </div>
          <div className="card p-3">
            <div className="muted text-xs">Average Order</div>
            <div className="text-2xl font-semibold">
              €{data ? data.kpis.aov.toFixed(2) : "—"}
            </div>
            <SparkTiny values={salesSeries} />
          </div>
          <div className="card p-3">
            <div className="muted text-xs">Tips (€)</div>
            <div className="text-2xl font-semibold">
              €{data ? data.kpis.totalTips.toFixed(2) : "—"}
            </div>
            <SparkTiny values={tipsSeries} />
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          <div className="card p-3 lg:col-span-2 overflow-x-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Daily trend</div>
              {busy && <div className="muted text-xs">Refreshing…</div>}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Sales (€)</th>
                  <th className="px-3 py-2">Orders</th>
                  <th className="px-3 py-2">Tips (€)</th>
                </tr>
              </thead>
              <tbody>
                {data?.series?.length ? (
                  data.series.map((r) => (
                    <tr
                      key={r.date}
                      className="border-t"
                      style={{ borderColor: "var(--line)" }}
                    >
                      <td className="px-3 py-2">{r.date}</td>
                      <td className="px-3 py-2">€{r.sales.toFixed(2)}</td>
                      <td className="px-3 py-2">{r.orders}</td>
                      <td className="px-3 py-2">€{r.tips.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-8 text-center muted" colSpan={4}>
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="card p-3">
            <div className="font-medium mb-2">Top zones</div>
            <div className="space-y-2">
              {data?.topZones?.length ? (
                data.topZones.map((z) => (
                  <div
                    key={z.zone}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ background: "var(--primary)" }}
                      />
                      <div>{z.zone}</div>
                    </div>
                    <div>€{z.sales.toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <div className="muted text-sm">No zones</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
