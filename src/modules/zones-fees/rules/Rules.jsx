import React, { useEffect, useState } from "react";
import {
  listZoneRules,
  upsertZoneRule,
  deleteZoneRule,
} from "../api/zones.service.js";

export default function Rules() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    cond: "time",
    value: "Fri 18-21",
    effect: "+1€ fee",
  });

  async function load() {
    setRows(await listZoneRules());
  }
  useEffect(() => {
    load();
  }, []);

  async function save(e) {
    e.preventDefault();
    if (!form.name) return alert("Rule name required");
    await upsertZoneRule(form);
    setForm({ id: null, name: "", cond: "time", value: "", effect: "" });
    await load();
  }
  function edit(r) {
    setForm(r);
  }
  async function del(id) {
    if (!confirm("Delete rule?")) return;
    await deleteZoneRule(id);
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Operational Rules</h1>
          <div className="muted text-sm">
            Time/amount conditions that tweak fees or minimums
          </div>
        </div>

        <form className="card p-3 grid gap-2 md:grid-cols-5" onSubmit={save}>
          <input
            className="input md:col-span-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <select
            className="input"
            value={form.cond}
            onChange={(e) => setForm((f) => ({ ...f, cond: e.target.value }))}
          >
            <option value="time">Time window</option>
            <option value="amount">Order ≥ amount</option>
          </select>
          <input
            className="input"
            placeholder={form.cond === "time" ? "e.g. Fri 18-21" : "e.g. 30.00"}
            value={form.value}
            onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
          />
          <input
            className="input"
            placeholder="Effect (e.g. +1€ fee or -5€ min)"
            value={form.effect}
            onChange={(e) => setForm((f) => ({ ...f, effect: e.target.value }))}
          />
          <div className="md:col-span-5">
            <button className="btn">{form.id ? "Save" : "Add rule"}</button>
            {form.id && (
              <button
                type="button"
                className="btn-ghost ml-2"
                onClick={() =>
                  setForm({
                    id: null,
                    name: "",
                    cond: "time",
                    value: "",
                    effect: "",
                  })
                }
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="card p-0 overflow-x-auto mt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Condition</th>
                <th className="px-3 py-2">Effect</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={4}>
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
                  <td className="px-3 py-2">
                    {r.cond}: {r.value}
                  </td>
                  <td className="px-3 py-2">{r.effect}</td>
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
