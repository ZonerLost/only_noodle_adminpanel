import React, { useEffect, useState } from "react";
import {
  listTemplates,
  upsertTemplate,
  deleteTemplate,
} from "../api/settings.service.js";

export default function Templates() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, key: "", name: "", body: "" });

  async function load() {
    setRows(await listTemplates());
  }
  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setForm({ id: null, key: "", name: "", body: "" });
    setOpen(true);
  }
  function startEdit(t) {
    setForm(t);
    setOpen(true);
  }

  async function save() {
    if (!form.key || !form.name) return alert("Key and name required");
    await upsertTemplate(form);
    setOpen(false);
    await load();
  }
  async function del(id) {
    if (!confirm("Delete template?")) return;
    await deleteTemplate(id);
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Notification Templates</h1>
            <div className="muted text-sm">
              Placeholders like {"{orderNo} {status}"}
            </div>
          </div>
          <button className="btn-ghost" onClick={startNew}>
            + New
          </button>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">Key</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={3}>
                    No templates
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t"
                  style={{ borderColor: "var(--line)" }}
                >
                  <td className="px-3 py-2">{r.key}</td>
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2 text-right">
                    <button className="btn-ghost" onClick={() => startEdit(r)}>
                      Edit
                    </button>
                    <button className="btn-ghost" onClick={() => del(r.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {open && (
          <div className="fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-full max-w-xl card p-5 overflow-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold">
                  {form.id ? "Edit template" : "New template"}
                </div>
                <button className="btn-ghost" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>

              <label className="block mb-2">
                <div className="muted text-sm mb-1">Key</div>
                <input
                  className="input"
                  value={form.key}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, key: e.target.value }))
                  }
                />
              </label>
              <label className="block mb-2">
                <div className="muted text-sm mb-1">Name</div>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </label>
              <label className="block">
                <div className="muted text-sm mb-1">Body</div>
                <textarea
                  className="input"
                  rows={8}
                  value={form.body}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, body: e.target.value }))
                  }
                />
              </label>

              <div className="flex items-center gap-2 mt-3">
                <button className="btn" onClick={save}>
                  Save
                </button>
                <button className="btn-ghost" onClick={() => setOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
