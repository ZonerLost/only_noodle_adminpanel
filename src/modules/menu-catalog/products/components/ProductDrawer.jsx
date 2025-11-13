import React, { useEffect, useState } from "react";
import {
  listCategories,
  createProduct,
  updateProduct,
} from "../../api/catalog.service.js";
import OptionEditor from "./OptionEditor.jsx";

export default function ProductDrawer({ open, onClose, value, onSaved }) {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    price: 0,
    active: true,
    options: [],
  });
  const isEdit = !!value?.id;

  useEffect(() => {
    listCategories({ pageSize: 999 }).then((r) => setCats(r.data));
  }, []);
  useEffect(() => {
    setForm(
      value
        ? { ...value }
        : { name: "", categoryId: "", price: 0, active: true, options: [] }
    );
  }, [value]);

  async function submit(e) {
    e.preventDefault();
    if (!form.name || !form.categoryId) return;
    if (isEdit) await updateProduct(value.id, form);
    else await createProduct(form);
    onSaved && onSaved();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl card p-5 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">
            {isEdit ? "Edit product" : "New product"}
          </div>
          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="space-y-3" onSubmit={submit}>
          <label className="block">
            <div className="muted text-sm mb-1">Name</div>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </label>

          <label className="block">
            <div className="muted text-sm mb-1">Category</div>
            <select
              className="input"
              value={form.categoryId}
              onChange={(e) =>
                setForm((f) => ({ ...f, categoryId: e.target.value }))
              }
              required
            >
              <option value="">Select…</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="muted text-sm mb-1">Price (€)</div>
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-blue-500 w-5 h-5"
              checked={!!form.active}
              onChange={(e) =>
                setForm((f) => ({ ...f, active: e.target.checked }))
              }
            />
            Active
          </label>

          <OptionEditor
            value={form.options || []}
            onChange={(opts) => setForm((f) => ({ ...f, options: opts }))}
          />

          <div className="flex items-center gap-2">
            <button className="btn" type="submit">
              {isEdit ? "Save changes" : "Create product"}
            </button>
            <button className="btn-ghost" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
