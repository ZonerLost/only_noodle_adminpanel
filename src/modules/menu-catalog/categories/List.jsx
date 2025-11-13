import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/catalog.service.js";

export default function CategoriesList() {
  const [q, _setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", sort: 999 });
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const r = await listCategories({ q, pageSize: 999 });
      setRows(r.data);
    } finally {
      setBusy(false);
    }
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editing) await updateCategory(editing.id, form);
    else await createCategory(form);
    setForm({ name: "", description: "", sort: 999 });
    setEditing(null);
    await load();
  }
  async function onEdit(row) {
    setEditing(row);
    setForm({
      name: row.name,
      description: row.description || "",
      sort: row.sort || 999,
    });
  }
  async function onDelete(id) {
    if (!confirm("Delete category (and its products)?")) return;
    await deleteCategory(id);
    await load();
  }

  const totalShown = useMemo(() => rows.length, [rows]);

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Categories</h1>
          <div className="muted text-sm">Organize your menu</div>
        </div>

        <div className="card p-3 mb-3">
          <form className="grid gap-2 md:grid-cols-4" onSubmit={submit}>
            <input
              className="input"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <input
              className="input md:col-span-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
            <input
              className="input"
              type="number"
              placeholder="Sort"
              value={form.sort}
              onChange={(e) =>
                setForm((f) => ({ ...f, sort: Number(e.target.value) || 999 }))
              }
            />
            <div className="flex items-center gap-2 md:col-span-4">
              <button className="btn" type="submit">
                {editing ? "Save" : "Add"}
              </button>
              {editing && (
                <button
                  className="btn-ghost"
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({ name: "", description: "", sort: 999 });
                  }}
                >
                  Cancel
                </button>
              )}
              <div className="muted text-sm ml-auto">Found: {totalShown}</div>
            </div>
          </form>
        </div>

        <div className="card p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Sort</th>
                <th className="px-3 py-2 text-right">Actions</th>
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
                    No categories
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
                  <td className="px-3 py-2">
                    {r.description || <span className="muted">—</span>}
                  </td>
                  <td className="px-3 py-2">{r.sort ?? 999}</td>
                  <td className="px-3 py-2 text-right">
                    <button className="btn-ghost" onClick={() => onEdit(r)}>
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
      </div>
    </div>
  );
}
