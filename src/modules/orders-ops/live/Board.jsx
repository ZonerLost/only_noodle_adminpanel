import React, { useEffect, useState, useCallback } from "react";
import {
  listOrders,
  transitionOrder,
  getOrder,
} from "../api/orders.service.js";
import OrderDetailsDrawer from "./OrderDetailsDrawer.jsx";

const COLUMNS = [
  { key: "incoming", title: "Incoming" },
  { key: "preparing", title: "Preparing" },
  { key: "onway", title: "On the way" },
  { key: "completed", title: "Completed" },
];

export default function Board() {
  const [q, setQ] = useState("");
  const [cols, setCols] = useState({});
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const load = useCallback(async () => {
    const bundle = {};
    for (const col of COLUMNS) {
      bundle[col.key] = await listOrders({ status: col.key, q });
    }
    setCols(bundle);
  }, [q]);
  useEffect(() => {
    load();
  }, [load]);

  async function openOrder(id) {
    const o = await getOrder(id);
    setCurrent(o);
    setOpen(true);
  }

  async function move(o, next) {
    await transitionOrder(o.id, next);
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Live Orders</h1>
            <div className="muted text-sm">
              Track and progress orders in real time
            </div>
          </div>
          <input
            className="input w-64"
            placeholder="Search #, name, address"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.key} className="card p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{col.title}</div>
                <div className="muted text-xs">
                  {cols[col.key]?.length || 0}
                </div>
              </div>
              <div className="space-y-2">
                {cols[col.key]?.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-xl border p-3 cursor-pointer hover:shadow-sm"
                    style={{ borderColor: "var(--line)" }}
                    onClick={() => openOrder(o.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{o.number}</div>
                      <div className="muted text-xs">€{o.total.toFixed(2)}</div>
                    </div>
                    <div className="text-sm">{o.customer}</div>
                    <div className="muted text-xs">{o.addr}</div>
                    <div className="flex items-center gap-2 mt-2">
                      {col.key !== "incoming" && (
                        <button
                          className="btn-ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            move(o, "incoming");
                          }}
                        >
                          ↩︎ Back
                        </button>
                      )}
                      {col.key !== "completed" && (
                        <button
                          className="btn-ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            move(o, next(col.key));
                          }}
                        >
                          Next →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {(!cols[col.key] || cols[col.key].length === 0) && (
                  <div className="muted text-sm">No orders</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <OrderDetailsDrawer
          open={open}
          value={current}
          onClose={() => setOpen(false)}
          onSaved={load}
        />
      </div>
    </div>
  );
}

function next(k) {
  if (k === "incoming") return "preparing";
  if (k === "preparing") return "onway";
  if (k === "onway") return "completed";
  return "completed";
}
