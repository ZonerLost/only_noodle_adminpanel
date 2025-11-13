import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  listBonusItems,
  createBonusItem,
  updateBonusItem,
  deleteBonusItem,
} from "../api/loyalty.service.js";
import BonusDrawer from "./components/BonusDrawer.jsx";

function usePager() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  return { page, setPage, pageSize, setPageSize };
}

export default function Items() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState("");
  const pager = usePager();

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    const r = await listBonusItems({
      q,
      page: pager.page,
      pageSize: pager.pageSize,
      active: active === "" ? undefined : active === "1",
    });
    setRows(r.data);
    setTotal(r.total);
    setBusy(false);
  }, [q, active, pager.page, pager.pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const pages = useMemo(
    () => Math.max(1, Math.ceil(total / pager.pageSize)),
    [total, pager.pageSize]
  );

  async function onCreate(input) {
    await createBonusItem(input);
    setOpen(false);
    setEditing(null);
    await load();
  }
  async function onUpdate(id, patch) {
    await updateBonusItem(id, patch);
    setOpen(false);
    setEditing(null);
    await load();
  }
  async function onDelete(id) {
    if (!confirm("Delete bonus item?")) return;
    await deleteBonusItem(id);
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Bonus Items</h1>
            <div className="muted text-sm">
              Configure gifts available above a cart threshold
            </div>
          </div>
          <button
            className="btn-ghost"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            + New item
          </button>
        </div>

        <div className="card p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input
              className="input md:col-span-2"
              placeholder="Search name or type…"
              value={q}
              onChange={(e) => {
                pager.setPage(1);
                setQ(e.target.value);
              }}
            />
            <select
              className="input"
              value={active}
              onChange={(e) => {
                pager.setPage(1);
                setActive(e.target.value);
              }}
            >
              <option value="">Any status</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Min cart (€)</th>
                <th className="px-3 py-2">Active</th>
                <th className="px-3 py-2 text-right">Actions</th>
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
                    No items
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t"
                  style={{ borderColor: "var(--line)" }}
                >
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2 capitalize">{r.type}</td>
                  <td className="px-3 py-2">€{Number(r.minCart).toFixed(2)}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        r.active
                          ? "bg-green-500/15 text-green-700"
                          : "bg-gray-500/15 text-gray-700"
                      }`}
                    >
                      {r.active ? "yes" : "no"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      className="btn-ghost"
                      onClick={() => {
                        setEditing(r);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-ghost"
                      onClick={() => onDelete(r.id)}
                    >
                      Delete
                    </button>
                  </td>
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

        {open && (
          <BonusDrawer
            open={open}
            onClose={() => {
              setOpen(false);
              setEditing(null);
            }}
            value={editing}
            onCreate={onCreate}
            onUpdate={onUpdate}
          />
        )}
      </div>
    </div>
  );
}
