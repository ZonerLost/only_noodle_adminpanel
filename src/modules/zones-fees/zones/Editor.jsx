import React, { useEffect, useState } from "react";
import { listZones, upsertZone, deleteZone } from "../api/zones.service.js";

export default function Editor() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    type: "zip",
    zip: "",
    center: "",
    radiusKm: 5,
  });

  async function load() {
    setRows(await listZones());
  }
  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setForm({
      id: null,
      name: "",
      type: "zip",
      zip: "",
      center: "",
      radiusKm: 5,
    });
    setOpen(true);
  }
  function startEdit(z) {
    setForm(z);
    setOpen(true);
  }

  async function save() {
    if (!form.name) return alert("Name required");
    if (form.type === "zip" && !form.zip) return alert("ZIP required");
    if (form.type === "radius" && (!form.center || !form.radiusKm))
      return alert("Center & radius required");
    await upsertZone({ ...form, radiusKm: Number(form.radiusKm) || 0 });
    setOpen(false);
    await load();
  }
  async function del(id) {
    if (!confirm("Delete zone?")) return;
    await deleteZone(id);
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Zones</h1>
            <div className="muted text-sm">
              ZIP-based or radius-based delivery areas
            </div>
          </div>
          <button className="btn-ghost" onClick={startNew}>
            + New zone
          </button>
        </div>

        {/* main table/card (responsive) */}
        <div className="card overflow-x-auto">
          {/* Desktop/tablet */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Definition</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td className="px-3 py-8 text-center muted" colSpan={4}>
                      No zones
                    </td>
                  </tr>
                )}
                {rows.map((z) => (
                  <tr
                    key={z.id}
                    className="border-t"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <td className="px-3 py-2">{z.name}</td>
                    <td className="px-3 py-2">{z.type}</td>
                    <td className="px-3 py-2">
                      {z.type === "zip"
                        ? `ZIP ${z.zip}`
                        : `Center ${z.center} · ${z.radiusKm}km`}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        className="btn-ghost"
                        onClick={() => startEdit(z)}
                      >
                        Edit
                      </button>
                      <button className="btn-ghost" onClick={() => del(z.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {rows.length === 0 && (
              <div className="p-4 text-center muted">No zones</div>
            )}
            {rows.map((z) => (
              <div
                key={z.id}
                className="p-3 rounded-lg border"
                style={{ borderColor: "var(--line)" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{z.name}</div>
                    <div className="text-sm muted">{z.type}</div>
                    <div className="mt-2 text-sm">
                      {z.type === "zip"
                        ? `ZIP ${z.zip}`
                        : `Center ${z.center} · ${z.radiusKm}km`}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button className="btn-ghost" onClick={() => startEdit(z)}>
                      Edit
                    </button>
                    <button className="btn-ghost" onClick={() => del(z.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                  {form.id ? "Edit zone" : "New zone"}
                </div>
                <button className="btn-ghost" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>

              <div className="grid gap-2">
                <input
                  className="input"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
                <select
                  className="input"
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value }))
                  }
                >
                  <option value="zip">ZIP</option>
                  <option value="radius">Radius</option>
                </select>

                {form.type === "zip" ? (
                  <input
                    className="input"
                    placeholder="ZIP code"
                    value={form.zip || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, zip: e.target.value }))
                    }
                  />
                ) : (
                  <>
                    <input
                      className="input"
                      placeholder="Center lat,lng (52.52,13.40)"
                      value={form.center || ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, center: e.target.value }))
                      }
                    />
                    <input
                      className="input"
                      type="number"
                      step="0.1"
                      placeholder="Radius (km)"
                      value={form.radiusKm || 0}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, radiusKm: e.target.value }))
                      }
                    />
                  </>
                )}
              </div>

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
