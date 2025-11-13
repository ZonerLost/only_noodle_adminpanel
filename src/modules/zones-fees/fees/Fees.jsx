import React, { useEffect, useState } from "react";
import { listFees, upsertFee, deleteFee } from "../api/zones.service.js";

export default function Fees() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ id: null, zoneName: "", min: 0, fee: 0 });

  async function load() {
    setRows(await listFees());
  }
  useEffect(() => {
    load();
  }, []);

  async function save(e) {
    e.preventDefault();
    if (!form.zoneName) return alert("Zone name required");
    await upsertFee({
      ...form,
      min: Number(form.min) || 0,
      fee: Number(form.fee) || 0,
    });
    setForm({ id: null, zoneName: "", min: 0, fee: 0 });
    await load();
  }
  function edit(f) {
    setForm(f);
  }
  async function del(id) {
    if (!confirm("Delete fee rule?")) return;
    await deleteFee(id);
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Zone Fees & Minimums</h1>
          <div className="muted text-sm">
            Set minimum order and delivery fee per zone
          </div>
        </div>

        <form className="card p-3 grid gap-2 md:grid-cols-4" onSubmit={save}>
          <input
            className="input md:col-span-2"
            placeholder="Zone name"
            value={form.zoneName}
            onChange={(e) =>
              setForm((f) => ({ ...f, zoneName: e.target.value }))
            }
          />
          <input
            className="input"
            type="number"
            step="0.01"
            placeholder="Min order (€)"
            value={form.min}
            onChange={(e) => setForm((f) => ({ ...f, min: e.target.value }))}
          />
          <input
            className="input"
            type="number"
            step="0.01"
            placeholder="Delivery fee (€)"
            value={form.fee}
            onChange={(e) => setForm((f) => ({ ...f, fee: e.target.value }))}
          />
          <div className="md:col-span-4">
            <button className="btn">{form.id ? "Save" : "Add"}</button>
            {form.id && (
              <button
                type="button"
                className="btn-ghost ml-2"
                onClick={() =>
                  setForm({ id: null, zoneName: "", min: 0, fee: 0 })
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
                <th className="px-3 py-2">Zone</th>
                <th className="px-3 py-2">Min (€)</th>
                <th className="px-3 py-2">Fee (€)</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={4}>
                    No fee rules
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t"
                  style={{ borderColor: "var(--line)" }}
                >
                  <td className="px-3 py-2">{r.zoneName}</td>
                  <td className="px-3 py-2">€{Number(r.min).toFixed(2)}</td>
                  <td className="px-3 py-2">€{Number(r.fee).toFixed(2)}</td>
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
