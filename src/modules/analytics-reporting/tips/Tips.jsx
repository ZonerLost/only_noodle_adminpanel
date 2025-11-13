import React, { useEffect, useMemo, useState } from "react";
import { listTips } from "../api/analytics.service.js";
import DateRange from "../components/DateRange.jsx";

function usePager() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  return { page, setPage, pageSize, setPageSize };
}

export default function Tips() {
  const [range, setRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    return {
      from: start.toISOString().slice(0, 10),
      to: end.toISOString().slice(0, 10),
    };
  });
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [sum, setSum] = useState(0);
  const [total, setTotal] = useState(0);
  const pager = usePager();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let canceled = false;
    async function load() {
      setBusy(true);
      try {
        const r = await listTips({
          ...range,
          q,
          page: pager.page,
          pageSize: pager.pageSize,
        });
        if (!canceled) {
          setRows(r.data);
          setTotal(r.total);
          setSum(r.sum);
        }
      } finally {
        if (!canceled) setBusy(false);
      }
    }
    load();
    return () => {
      canceled = true;
    };
  }, [range, q, pager.page, pager.pageSize]);

  const pages = useMemo(
    () => Math.max(1, Math.ceil(total / pager.pageSize)),
    [total, pager.pageSize]
  );

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Tips</h1>
            <div className="muted text-sm">
              Driver tips over time (export via Sales/Exports)
            </div>
          </div>
          <DateRange from={range.from} to={range.to} onChange={setRange} />
        </div>

        <div className="card p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              className="input md:col-span-2"
              placeholder="Search order, driver or zone…"
              value={q}
              onChange={(e) => {
                pager.setPage(1);
                setQ(e.target.value);
              }}
            />
            <div className="flex items-center justify-end gap-3">
              <div className="muted text-sm">Total tips:</div>
              <div className="text-lg font-semibold">€{sum.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Driver</th>
                <th className="px-3 py-2">Zone</th>
                <th className="px-3 py-2">Tip (€)</th>
              </tr>
            </thead>
            <tbody>
              {busy && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={5}>
                    Loading…
                  </td>
                </tr>
              )}
              {!busy && rows.length === 0 && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={5}>
                    No tips
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t"
                  style={{ borderColor: "var(--line)" }}
                >
                  <td className="px-3 py-2">
                    {new Date(r.ts).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">{r.orderId}</td>
                  <td className="px-3 py-2">{r.driver}</td>
                  <td className="px-3 py-2">{r.zone}</td>
                  <td className="px-3 py-2">€{r.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="muted text-sm">Total: {total}</div>
          <div className="flex items-center gap-2">
            <button
              className="btn-ghost"
              disabled={pager.page <= 1}
              onClick={() => pager.setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <div className="text-sm">
              {pager.page} / {pages}
            </div>
            <button
              className="btn-ghost"
              disabled={pager.page >= pages}
              onClick={() => pager.setPage((p) => p + 1)}
            >
              Next
            </button>
            <select
              className="input"
              value={pager.pageSize}
              onChange={(e) => {
                pager.setPage(1);
                pager.setPageSize(+e.target.value);
              }}
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}/page
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
