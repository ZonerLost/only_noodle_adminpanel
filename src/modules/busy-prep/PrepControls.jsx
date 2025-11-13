import React, { useEffect, useState } from "react";
import { listCategories } from "../menu-catalog/api/catalog.service.js";

const K_PREP = "prep.defaults.v1";
const K_BUSY = "busy.mode.v1";
const read = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k) || JSON.stringify(d));
  } catch {
    return d;
  }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export default function PrepControls() {
  const [categories, setCategories] = useState([]);
  const [prep, setPrep] = useState({});
  const [busy, setBusy] = useState({ active: false, multiplier: 1 });

  useEffect(() => {
    (async () => {
      const { data } = await listCategories({ pageSize: 999 });
      setCategories(data);
      setPrep(read(K_PREP, {}));
      const b = read(K_BUSY, {});
      setBusy({ active: !!b.active, multiplier: Number(b.multiplier || 1) });
    })();
  }, []);

  function setValue(catId, mins) {
    setPrep((p) => ({ ...p, [catId]: Math.max(0, Number(mins) || 0) }));
  }

  function save() {
    write(K_PREP, prep);
    alert("Prep defaults saved");
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Preparation Controls</h1>
          <div className="muted text-sm">
            Set default prep times per category; Busy Mode multiplier applies
            globally
          </div>
        </div>

        <div className="card p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Default Prep (min)</th>
                <th className="px-3 py-2">Effective Now</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => {
                const base = Number(prep[c.id] ?? 15);
                const effective = busy.active
                  ? Math.ceil(base * busy.multiplier)
                  : base;
                return (
                  <tr
                    key={c.id}
                    className="border-t"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <td className="px-3 py-2">{c.name}</td>
                    <td className="px-3 py-2">
                      <input
                        className="input w-28"
                        type="number"
                        min="0"
                        value={base}
                        onChange={(e) => setValue(c.id, e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-2">{effective} min</td>
                  </tr>
                );
              })}
              {categories.length === 0 && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={3}>
                    No categories yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center gap-2 mt-3">
            <button className="btn" onClick={save}>
              Save defaults
            </button>
            <div className="muted text-sm">
              Busy Mode: {busy.active ? `${busy.multiplier}× (on)` : "off"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
