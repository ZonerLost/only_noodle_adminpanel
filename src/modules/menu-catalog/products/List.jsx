import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  listProducts,
  listCategories,
  deleteProduct,
} from "../api/catalog.service.js";
import ProductDrawer from "./components/ProductDrawer.jsx";
import AvailabilityToggle from "./components/AvailabilityToggle.jsx";

function usePager() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  return { page, setPage, pageSize, setPageSize };
}

export default function ProductsList() {
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [rows, setRows] = useState([]);
  const [cats, setCats] = useState([]);
  const [total, setTotal] = useState(0);
  const pager = usePager();
  const [busy, setBusy] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    listCategories({ pageSize: 999 }).then((r) => setCats(r.data));
  }, []);

  const load = useCallback(async () => {
    setBusy(true);
    const r = await listProducts({
      q,
      categoryId: categoryId || undefined,
      page: pager.page,
      pageSize: pager.pageSize,
    });
    setRows(r.data);
    setTotal(r.total);
    setBusy(false);
  }, [q, categoryId, pager.page, pager.pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const pages = useMemo(
    () => Math.max(1, Math.ceil(total / pager.pageSize)),
    [total, pager.pageSize]
  );

  async function onDelete(id) {
    if (!confirm("Delete product?")) return;
    await deleteProduct(id);
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Products</h1>
            <div className="muted text-sm">
              Manage menu items, prices and availability
            </div>
          </div>
          <button
            className="btn-ghost"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            + New product
          </button>
        </div>

        <div className="card p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <input
              className="input md:col-span-3"
              placeholder="Search name…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                pager.setPage(1);
              }}
            />
            <select
              className="input"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                pager.setPage(1);
              }}
            >
              <option value="">All categories</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
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

        <div className="card overflow-x-auto">
          {/* Desktop/tablet table */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Status</th>
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
                      No products
                    </td>
                  </tr>
                )}
                {rows.map((r) => {
                  const catName =
                    cats.find((c) => c.id === r.categoryId)?.name || "—";
                  return (
                    <tr
                      key={r.id}
                      className="border-t"
                      style={{ borderColor: "var(--line)" }}
                    >
                      <td className="px-3 py-2">{r.name}</td>
                      <td className="px-3 py-2">{catName}</td>
                      <td className="px-3 py-2">
                        €{Number(r.price).toFixed(2)}
                      </td>
                      <td className="px-3 py-2">
                        <AvailabilityToggle
                          id={r.id}
                          value={r.active}
                          onChange={() => load()}
                        />
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
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {busy && <div className="p-4 text-center muted">Loading…</div>}
            {!busy && rows.length === 0 && (
              <div className="p-4 text-center muted">No products</div>
            )}
            {rows.map((r) => {
              const catName =
                cats.find((c) => c.id === r.categoryId)?.name || "—";
              return (
                <div
                  key={r.id}
                  className="p-3 rounded-lg border"
                  style={{ borderColor: "var(--line)" }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold">{r.name}</div>
                      <div className="text-sm muted">{catName}</div>
                      <div className="text-sm">
                        €{Number(r.price).toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mb-2">
                        <AvailabilityToggle
                          id={r.id}
                          value={r.active}
                          onChange={() => load()}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
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
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
          </div>
        </div>

        <ProductDrawer
          open={open}
          value={editing}
          onClose={() => {
            setOpen(false);
            setEditing(null);
          }}
          onSaved={load}
        />
      </div>
    </div>
  );
}
