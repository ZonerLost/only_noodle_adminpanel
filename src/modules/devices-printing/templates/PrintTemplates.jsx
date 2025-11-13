import React, { useEffect, useState } from "react";
import {
  listTemplates,
  upsertTemplate,
  deleteTemplate,
  previewTemplate,
} from "../api/devices.service.js";

export default function PrintTemplates() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // {id?, name, width, body}
  const [preview, setPreview] = useState(null);

  async function load() {
    setRows(await listTemplates());
  }
  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setEditing({
      id: null,
      name: "",
      width: 58,
      body: "Order #{orderId}\n{items}\nTotal: €{total}",
    });
    setOpen(true);
  }
  function startEdit(t) {
    setEditing({ ...t });
    setOpen(true);
  }

  async function save() {
    if (!editing?.name) return alert("Name required");
    await upsertTemplate(editing);
    setOpen(false);
    setEditing(null);
    await load();
  }
  async function del(id) {
    if (!confirm("Delete template?")) return;
    await deleteTemplate(id);
    await load();
  }

  async function runPreview(id) {
    const p = await previewTemplate(id, {
      orderId: "O-1234",
      items: "1× Burger €8.90\n2× Fries €6.00",
      total: "20.90",
    });
    setPreview(p);
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Print Templates</h1>
            <div className="muted text-sm">
              Customize receipt layout (58mm / 80mm)
            </div>
          </div>
          <button className="btn-ghost" onClick={startNew}>
            + New template
          </button>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Width</th>
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
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2">{r.width}mm</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        className="btn-ghost"
                        onClick={() => runPreview(r.id)}
                      >
                        Preview
                      </button>
                      <button
                        className="btn-ghost"
                        onClick={() => startEdit(r)}
                      >
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

          <div className="card p-4 min-h-[260px]">
            <div className="font-medium mb-2">Preview</div>
            {!preview && (
              <div className="muted text-sm">Select a template → Preview</div>
            )}
            {preview && (
              <pre
                className="text-sm whitespace-pre-wrap p-3 rounded-lg"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--line)",
                }}
              >
                {preview.body}
              </pre>
            )}
          </div>
        </div>

        {open && (
          <div className="fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-full max-w-2xl card p-5 overflow-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold">
                  {editing?.id ? "Edit template" : "New template"}
                </div>
                <button className="btn-ghost" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>

              <div className="grid gap-3">
                <label className="block">
                  <div className="muted text-sm mb-1">Name</div>
                  <input
                    className="input"
                    value={editing?.name || ""}
                    onChange={(e) =>
                      setEditing((s) => ({ ...s, name: e.target.value }))
                    }
                  />
                </label>

                <label className="block">
                  <div className="muted text-sm mb-1">Width (mm)</div>
                  <select
                    className="input"
                    value={editing?.width || 58}
                    onChange={(e) =>
                      setEditing((s) => ({
                        ...s,
                        width: Number(e.target.value),
                      }))
                    }
                  >
                    <option value={58}>58</option>
                    <option value={80}>80</option>
                  </select>
                </label>

                <label className="block">
                  <div className="muted text-sm mb-1">
                    Body (use {"{orderId} {items} {total}"} placeholders)
                  </div>
                  <textarea
                    className="input"
                    rows={10}
                    value={editing?.body || ""}
                    onChange={(e) =>
                      setEditing((s) => ({ ...s, body: e.target.value }))
                    }
                  />
                </label>
              </div>

              <div className="flex items-center gap-2 mt-4">
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
