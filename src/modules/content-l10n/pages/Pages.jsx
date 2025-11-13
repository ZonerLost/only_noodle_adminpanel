import React, { useEffect, useState } from "react";
import {
  getLocales,
  listPages,
  upsertPage,
  deletePage,
} from "../api/l10n.service.js";

export default function Pages() {
  const [locales, setLocales] = useState(["en", "de", "fr"]);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // {id, slug, values:{}}

  useEffect(() => {
    getLocales().then(setLocales);
  }, []);
  useEffect(() => {
    listPages({ q }).then(setRows);
  }, [q]);

  function startNew() {
    const values = Object.fromEntries(locales.map((l) => [l, ""]));
    setEditing({ id: null, slug: "", values });
    setOpen(true);
  }
  function startEdit(row) {
    const values = Object.fromEntries(
      locales.map((l) => [l, row.values?.[l] || ""])
    );
    setEditing({ id: row.id, slug: row.slug, values });
    setOpen(true);
  }

  async function save() {
    if (!editing?.slug) return alert("Slug is required");
    await upsertPage(editing);
    setOpen(false);
    setEditing(null);
    setRows(await listPages({ q }));
  }

  async function onDelete(id) {
    if (!confirm("Delete page?")) return;
    await deletePage(id);
    setRows(await listPages({ q }));
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Static Pages</h1>
            <div className="muted text-sm">
              Terms, Privacy, Help… in multiple languages
            </div>
          </div>
          <button className="btn-ghost" onClick={startNew}>
            + New page
          </button>
        </div>

        <div className="card p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              className="input md:col-span-2"
              placeholder="Search by slug…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select className="input" disabled value={locales.join(",")}>
              <option>{locales.join(", ")}</option>
            </select>
          </div>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Languages</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={3}>
                    No pages
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t"
                  style={{ borderColor: "var(--line)" }}
                >
                  <td className="px-3 py-2">/{r.slug}</td>
                  <td className="px-3 py-2">
                    {locales.map((l) =>
                      r.values?.[l] ? (
                        l.toUpperCase()
                      ) : (
                        <span key={l} className="muted mr-2">
                          {l.toUpperCase()}
                        </span>
                      )
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button className="btn-ghost" onClick={() => startEdit(r)}>
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

        {open && (
          <div className="fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-full max-w-3xl card p-5 overflow-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold">
                  {editing?.id ? "Edit page" : "New page"}
                </div>
                <button className="btn-ghost" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>

              <label className="block mb-3">
                <div className="muted text-sm mb-1">Slug</div>
                <input
                  className="input"
                  placeholder="privacy"
                  value={editing?.slug || ""}
                  onChange={(e) =>
                    setEditing((s) => ({
                      ...s,
                      slug: e.target.value.replace(/^\//, ""),
                    }))
                  }
                />
              </label>

              <div className="grid gap-3">
                {locales.map((l) => (
                  <label key={l} className="block">
                    <div className="muted text-sm mb-1">
                      {l.toUpperCase()} HTML
                    </div>
                    <textarea
                      className="input"
                      rows={6}
                      value={editing?.values?.[l] || ""}
                      onChange={(e) =>
                        setEditing((s) => ({
                          ...s,
                          values: { ...(s.values || {}), [l]: e.target.value },
                        }))
                      }
                    />
                  </label>
                ))}
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
