import React, { useEffect, useMemo, useState, useCallback } from "react";
import { listLedger, adjustPoints } from "../api/loyalty.service.js";

function usePager() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  return { page, setPage, pageSize, setPageSize };
}

export default function Ledger() {
  const [q, setQ] = useState("");
  const pager = usePager();

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [balances, _setBalances] = useState({});
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const r = await listLedger({
        q,
        page: pager.page,
        pageSize: pager.pageSize,
      });
      setRows(r.data);
      setTotal(r.total);
    } finally {
      setBusy(false);
    }
  }, [q, pager.page, pager.pageSize]);
  useEffect(() => {
    load();
  }, [load]);

  const pages = useMemo(
    () => Math.max(1, Math.ceil(total / pager.pageSize)),
    [total, pager.pageSize]
  );

  async function onAdjust(row) {
    const userId = prompt("User ID:", row?.userId || "");
    if (!userId) return;
    const user = prompt("User name:", row?.user || "");
    if (!user) return;
    const deltaStr = prompt("Points delta (e.g., +10 or -5):", "10");
    if (!deltaStr) return;
    const delta = Number(deltaStr);
    if (Number.isNaN(delta) || delta === 0) return;
    const reason = prompt("Reason (optional):", "Manual adjustment");
    await adjustPoints({ userId, user, delta, reason });
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Loyalty Ledger</h1>
            <div className="muted text-sm">
              Earnings and redemptions by user
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="input"
              placeholder="Search user/name/reason…"
              value={q}
              onChange={(e) => {
                pager.setPage(1);
                setQ(e.target.value);
              }}
            />
            <button className="btn-ghost" onClick={() => onAdjust({})}>
              + Adjust points
            </button>
          </div>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">User ID</th>
                <th className="px-3 py-2">Delta</th>
                <th className="px-3 py-2">Reason</th>
                <th className="px-3 py-2">Balance</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {busy && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={7}>
                    Loading…
                  </td>
                </tr>
              )}
              {!busy && rows.length === 0 && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={7}>
                    No ledger entries
                  </td>
                </tr>
              )}
              {rows.map((r) => {
                const bal = balances[r.userId] ?? 0;
                return (
                  <tr
                    key={r.id}
                    className="border-t"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <td className="px-3 py-2">
                      {new Date(r.ts).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">{r.user}</td>
                    <td className="px-3 py-2">{r.userId}</td>
                    <td
                      className={`px-3 py-2 ${
                        r.delta >= 0 ? "text-green-600" : "text-rose-600"
                      }`}
                    >
                      {r.delta >= 0 ? `+${r.delta}` : r.delta}
                    </td>
                    <td className="px-3 py-2">{r.reason || "—"}</td>
                    <td className="px-3 py-2">{bal}</td>
                    <td className="px-3 py-2 text-right">
                      <button className="btn-ghost" onClick={() => onAdjust(r)}>
                        Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
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
