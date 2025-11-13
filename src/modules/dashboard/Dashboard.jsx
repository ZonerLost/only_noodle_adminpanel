import React, { useEffect, useMemo, useState } from "react";
import OrdersSpark from "./components/OrdersSpark.jsx";
import RevenueSpark from "./components/RevenueSpark.jsx";
import ZoneHeatMini from "./components/ZoneHeatMini.jsx";
import {
  fetchKpis,
  fetchOrdersSeries,
  fetchRevenueSeries,
  fetchZoneHeat,
  listWidgets,
  createWidget,
  updateWidget,
  deleteWidget,
} from "./api/dashboard.service.js";

const ranges = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
];

export default function Dashboard() {
  const [range, setRange] = useState("7d");
  const [kpis, setKpis] = useState(null);
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [zones, setZones] = useState([]);
  const [busy, setBusy] = useState(false);

  const [widgets, setWidgets] = useState([]);
  const [manageOpen, setManageOpen] = useState(false);
  const [editing, setEditing] = useState(null); // {id?, title, type, span}

  const load = React.useCallback(async () => {
    setBusy(true);
    const [k, o, r, z] = await Promise.all([
      fetchKpis({ range }),
      fetchOrdersSeries({ range }),
      fetchRevenueSeries({ range }),
      fetchZoneHeat({ range }),
    ]);
    setKpis(k);
    setOrders(o);
    setRevenue(r);
    setZones(z);
    const ws = await listWidgets();
    setWidgets(ws);
    setBusy(false);
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  const ordersTotal = useMemo(
    () => orders.reduce((a, b) => a + b.value, 0),
    [orders]
  );
  const revenueTotal = useMemo(
    () => revenue.reduce((a, b) => a + b.value, 0),
    [revenue]
  );

  async function onSaveWidget(e) {
    e.preventDefault();
    if (!editing?.title || !editing?.type) return;
    if (editing.id) {
      const updated = await updateWidget(editing.id, editing);
      setWidgets((prev) =>
        prev.map((w) => (w.id === updated.id ? updated : w))
      );
    } else {
      const created = await createWidget({
        title: editing.title,
        type: editing.type,
        span: editing.span || 1,
      });
      setWidgets((prev) => [...prev, created]);
    }
    setEditing(null);
    setManageOpen(false);
  }

  async function onDeleteWidget(id) {
    await deleteWidget(id);
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }

  function renderWidget(w) {
    const spanCls = w.span === 2 ? "md:col-span-2" : "md:col-span-1";
    if (w.type === "orders") {
      return (
        <div key={w.id} className={spanCls}>
          <OrdersSpark
            data={orders}
            total={ordersTotal}
            label={w.title || "Orders"}
            delta={
              +(
                ((orders[orders.length - 1]?.value || 1) /
                  (orders[0]?.value || 1)) *
                  100 -
                100
              ).toFixed(0)
            }
          />
          <TileActions
            onEdit={() => {
              setEditing(w);
              setManageOpen(true);
            }}
            onDelete={() => onDeleteWidget(w.id)}
          />
        </div>
      );
    }
    if (w.type === "revenue") {
      return (
        <div key={w.id} className={spanCls}>
          <RevenueSpark
            data={revenue}
            total={revenueTotal}
            label={w.title || "Revenue"}
          />
          <TileActions
            onEdit={() => {
              setEditing(w);
              setManageOpen(true);
            }}
            onDelete={() => onDeleteWidget(w.id)}
          />
        </div>
      );
    }
    if (w.type === "zones") {
      return (
        <div key={w.id} className={spanCls}>
          <ZoneHeatMini data={zones} label={w.title || "Zone Heat"} />
          <TileActions
            onEdit={() => {
              setEditing(w);
              setManageOpen(true);
            }}
            onDelete={() => onDeleteWidget(w.id)}
          />
        </div>
      );
    }
    return (
      <div key={w.id} className={spanCls}>
        <div className="card p-4">
          <div className="font-medium">{w.title || "Custom widget"}</div>
          <div className="muted text-sm mt-1">
            Unknown widget type: {w.type}
          </div>
        </div>
        <TileActions
          onEdit={() => {
            setEditing(w);
            setManageOpen(true);
          }}
          onDelete={() => onDeleteWidget(w.id)}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        {/* stack title and controls on small screens, align horizontally on sm+ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <div>
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="muted text-sm">
              Overview of orders, revenue, and heat by zones
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="input w-36 md:w-40"
            >
              {ranges.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
            <button className="btn" onClick={load} disabled={busy}>
              {busy ? "Refreshing…" : "Refresh"}
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                setEditing({ title: "", type: "orders", span: 1 });
                setManageOpen(true);
              }}
            >
              + Add widget
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <Kpi title="Orders" value={kpis?.orders} />
          <Kpi
            title="Revenue"
            value={new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            }).format(kpis?.revenue || 0)}
          />
          <Kpi title="AOV" value={`€${(kpis?.aov ?? 0).toFixed(2)}`} />
          <Kpi title="Active drivers" value={kpis?.activeDrivers} />
        </div>

        {/* Tiles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {widgets.map(renderWidget)}
        </div>

        {/* Manage Drawer */}
        {manageOpen && (
          <div className="fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setManageOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-full max-w-md card p-5 overflow-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold">
                  {editing?.id ? "Edit widget" : "Add widget"}
                </div>
                <button
                  className="btn-ghost"
                  onClick={() => setManageOpen(false)}
                >
                  Close
                </button>
              </div>

              <form onSubmit={onSaveWidget} className="space-y-4">
                <label className="block">
                  <div className="text-sm muted">Title</div>
                  <input
                    className="input"
                    value={editing?.title || ""}
                    onChange={(e) =>
                      setEditing((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="e.g., Orders Spark"
                    required
                  />
                </label>

                <label className="block">
                  <div className="text-sm muted">Type</div>
                  <select
                    className="input"
                    value={editing?.type || "orders"}
                    onChange={(e) =>
                      setEditing((prev) => ({ ...prev, type: e.target.value }))
                    }
                  >
                    <option value="orders">Orders Spark</option>
                    <option value="revenue">Revenue Spark</option>
                    <option value="zones">Zone Heat (mini)</option>
                  </select>
                </label>

                <label className="block">
                  <div className="text-sm muted">Width</div>
                  <select
                    className="input"
                    value={editing?.span || 1}
                    onChange={(e) =>
                      setEditing((prev) => ({
                        ...prev,
                        span: Number(e.target.value),
                      }))
                    }
                  >
                    <option value={1}>1 column</option>
                    <option value={2}>2 columns</option>
                  </select>
                </label>

                <div className="flex items-center gap-2">
                  <button className="btn" type="submit">
                    {editing?.id ? "Save changes" : "Create widget"}
                  </button>
                  {editing?.id && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={async () => {
                        await deleteWidget(editing.id);
                        setWidgets((prev) =>
                          prev.filter((w) => w.id !== editing.id)
                        );
                        setEditing(null);
                        setManageOpen(false);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({ title, value }) {
  return (
    <div className="card p-4">
      <div className="muted text-sm">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value ?? "—"}</div>
    </div>
  );
}

function TileActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <button className="btn-ghost text-sm" onClick={onEdit}>
        Edit
      </button>
      <button className="btn-ghost text-sm" onClick={onDelete}>
        Remove
      </button>
    </div>
  );
}
