import React, { useEffect, useState } from "react";
import {
  listRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../api/iam.service.js";

export default function RolesPage() {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(null);

  async function load() {
    setBusy(true);
    const r = await listRoles();
    setRows(r);
    setBusy(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    if (editing) {
      await updateRole(editing.id, {
        name: name.trim(),
        description: description.trim(),
      });
      setEditing(null);
    } else {
      await createRole({ name: name.trim(), description: description.trim() });
    }
    setName("");
    setDescription("");
    await load();
  }

  async function onEdit(r) {
    setEditing(r);
    setName(r.name);
    setDescription(r.description || "");
  }

  async function onDelete(id) {
    if (!confirm("Delete this role?")) return;
    await deleteRole(id);
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Roles</h1>
            <div className="muted text-sm">
              Define role names and descriptions
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-3">
          <div className="card p-4 lg:col-span-2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {busy && (
                  <tr>
                    <td colSpan={3} className="px-3 py-8 text-center muted">
                      Loading…
                    </td>
                  </tr>
                )}
                {!busy && rows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-8 text-center muted">
                      No roles
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
                    <td className="px-3 py-2">{r.description || "—"}</td>
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

          <div className="card p-4">
            <div className="text-lg font-semibold mb-2">
              {editing ? "Edit role" : "Create role"}
            </div>
            <form className="space-y-3" onSubmit={submit}>
              <label className="block">
                <div className="text-sm muted">Role name</div>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Manager"
                  required
                />
              </label>
              <label className="block">
                <div className="text-sm muted">Description</div>
                <textarea
                  className="input"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Can manage menu and zones."
                />
              </label>
              <div className="flex items-center gap-2">
                <button className="btn" type="submit">
                  {editing ? "Save changes" : "Create role"}
                </button>
                {editing && (
                  <button
                    className="btn-ghost"
                    type="button"
                    onClick={() => {
                      setEditing(null);
                      setName("");
                      setDescription("");
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
