import React, { useEffect, useState, useCallback } from "react";
import {
  listOrders,
  listDrivers,
  assignDriver,
} from "../api/orders.service.js";

export default function Queue() {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    const [o, d] = await Promise.all([
      listOrders({ status: "preparing", q }),
      listDrivers(),
    ]);
    setOrders(o.filter((x) => !x.driverId));
    setDrivers(d);
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  async function assign(o, driverId) {
    await assignDriver(o.id, driverId);
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Assignment Queue</h1>
            <div className="muted text-sm">
              Preparing orders waiting for a driver
            </div>
          </div>
          <input
            className="input w-64"
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Zone</th>
                <th className="px-3 py-2">Prep</th>
                <th className="px-3 py-2 text-right">Assign</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={4}>
                    No orders
                  </td>
                </tr>
              )}
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-t"
                  style={{ borderColor: "var(--line)" }}
                >
                  <td className="px-3 py-2">
                    {o.number} — {o.customer}
                  </td>
                  <td className="px-3 py-2">{o.zone || "—"}</td>
                  <td className="px-3 py-2">{o.prepMin || 0} min</td>
                  <td className="px-3 py-2 text-right">
                    <select
                      className="input w-48"
                      defaultValue=""
                      onChange={(e) => assign(o, e.target.value)}
                    >
                      <option value="">Select driver…</option>
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.zone})
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
