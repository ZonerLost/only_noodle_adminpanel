import React, { useEffect, useState } from "react";
import {
  listAutoRules,
  upsertAutoRule,
  deleteAutoRule,
} from "../api/orders.service.js";

export default function AutoRules() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    type: "zone",
    value: "",
    driverHint: "",
  });

  async function load() {
    setRows(await listAutoRules());
  }
  useEffect(() => {
    load();
  }, []);

  async function save(e) {
    e.preventDefault();
    if (!form.name || !form.value) return;
    await upsertAutoRule(form);
    setForm({ id: null, name: "", type: "zone", value: "", driverHint: "" });
    await load();
  }
  async function edit(r) {
    setForm(r);
  }
  async function del(id) {
    if (!confirm("Delete rule?")) return;
    await deleteAutoRule(id);
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Auto-Assignment Rules</h1>
          <div className="muted text-sm">
            Route orders to drivers based on zone or simple conditions
          </div>
        </div>

        <div className="card p-3 mb-3">
          <form className="grid gap-2 md:grid-cols-5" onSubmit={save}>
            <input
              className="input md:col-span-2"
              placeholder="Rule name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <select
              className="input"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="zone">Zone equals</option>
            </select>
            <input
              className="input"
              placeholder="Value (e.g. Z1)"
              value={form.value}
              onChange={(e) =>
                setForm((f) => ({ ...f, value: e.target.value }))
              }
            />
            <input
              className="input"
              placeholder="Driver hint (name)"
              value={form.driverHint}
              onChange={(e) =>
                setForm((f) => ({ ...f, driverHint: e.target.value }))
              }
            />
            <div className="md:col-span-5 flex items-center gap-2">
              <button className="btn" type="submit">
                {form.id ? "Save" : "Add rule"}
              </button>
              {form.id && (
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() =>
                    setForm({
                      id: null,
                      name: "",
                      type: "zone",
                      value: "",
                      driverHint: "",
                    })
                  }
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Value</th>
                <th className="px-3 py-2">Driver Hint</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={5}>
                    No rules
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
                  <td className="px-3 py-2">{r.type}</td>
                  <td className="px-3 py-2">{r.value}</td>
                  <td className="px-3 py-2">{r.driverHint || "—"}</td>
                  <td className="px-3 py-2 text-right">
                    <button className="btn-ghost" onClick={() => edit(r)}>
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
      </div>
    </div>
  );
}
