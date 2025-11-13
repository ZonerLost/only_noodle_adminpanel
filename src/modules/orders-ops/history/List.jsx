import React, { useEffect, useMemo, useState } from "react";
import { listOrders } from "../api/orders.service.js";

export default function OrdersHistory() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("completed");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await listOrders({ status, q });
      if (mounted) setRows(data);
    })();
    return () => {
      mounted = false;
    };
  }, [q, status]);

  const total = useMemo(
    () => rows.reduce((s, x) => s + Number(x.total || 0), 0),
    [rows]
  );

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Order History</h1>
            <div className="muted text-sm">Search past orders</div>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="completed">Completed</option>
              <option value="onway">On the way</option>
              <option value="preparing">Preparing</option>
              <option value="incoming">Incoming</option>
            </select>
            <input
              className="input w-64"
              placeholder="Search…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Zone</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={5}>
                    No results
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t"
                  style={{ borderColor: "var(--line)" }}
                >
                  <td className="px-3 py-2">{r.number}</td>
                  <td className="px-3 py-2">{r.customer}</td>
                  <td className="px-3 py-2">{r.zone || "—"}</td>
                  <td className="px-3 py-2">€{Number(r.total).toFixed(2)}</td>
                  <td className="px-3 py-2">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end mt-3">
          <div className="muted text-sm">
            Total: <b>€{total.toFixed(2)}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
