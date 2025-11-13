import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  getLocales,
  listStrings,
  upsertString,
  deleteString,
} from "../api/l10n.service.js";

function usePager() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  return { page, setPage, pageSize, setPageSize };
}

export default function Strings() {
  const [locales, setLocales] = useState(["en", "de", "fr"]);
  const [q, setQ] = useState("");
  const pager = usePager();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);

  const [editing, setEditing] = useState(null); // {key, values:{}}
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getLocales().then(setLocales);
  }, []);

  const load = useCallback(async () => {
    setBusy(true);
    const r = await listStrings({
      q,
      page: pager.page,
      pageSize: pager.pageSize,
    });
    setRows(r.data);
    setTotal(r.total);
    setBusy(false);
  }, [q, pager.page, pager.pageSize]);
  useEffect(() => {
    load();
  }, [load]);

  const pages = useMemo(
    () => Math.max(1, Math.ceil(total / pager.pageSize)),
    [total, pager.pageSize]
  );

  function startNew() {
    const values = Object.fromEntries(locales.map((l) => [l, ""]));
    setEditing({ key: "", values });
    setOpen(true);
  }
  function startEdit(row) {
    const values = Object.fromEntries(
      locales.map((l) => [l, row.values?.[l] || ""])
    );
    setEditing({ key: row.key, values });
    setOpen(true);
  }

  async function save() {
    if (!editing?.key) return alert("Key is required");
    await upsertString(editing.key, editing.values);
    setOpen(false);
    setEditing(null);
    await load();
  }

  async function onDelete(key) {
    if (!confirm("Delete translation key?")) return;
    await deleteString(key);
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Localization Strings</h1>
            <div className="muted text-sm">Manage UI copy across languages</div>
          </div>
          <button className="btn-ghost" onClick={startNew}>
            + New key
          </button>
        </div>

        <div className="card p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input
              className="input md:col-span-3"
              placeholder="Search key or value…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                pager.setPage(1);
              }}
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
                <th className="px-3 py-2">Key</th>
                {locales.map((l) => (
                  <th key={l} className="px-3 py-2">
                    {l.toUpperCase()}
                  </th>
                ))}
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {busy && (
                <tr>
                  <td
                    className="px-3 py-8 text-center muted"
                    colSpan={locales.length + 2}
                  >
                    Loading…
                  </td>
                </tr>
              )}
              {!busy && rows.length === 0 && (
                <tr>
                  <td
                    className="px-3 py-8 text-center muted"
                    colSpan={locales.length + 2}
                  >
                    No strings
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr
                  key={r.key}
                  className="border-t"
                  style={{ borderColor: "var(--line)" }}
                >
                  <td className="px-3 py-2">{r.key}</td>
                  {locales.map((l) => (
                    <td key={l} className="px-3 py-2">
                      {r.values?.[l] || <span className="muted">—</span>}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right">
                    <button className="btn-ghost" onClick={() => startEdit(r)}>
                      Edit
                    </button>
                    <button
                      className="btn-ghost"
                      onClick={() => onDelete(r.key)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="muted text-sm">Total: {total}</div>
          <div className="flex items-center gap-2">
            <button
              className="btn-ghost"
              disabled={pager.page <= 1}
              onClick={() => pager.setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <div className="text-sm">
              {pager.page} / {pages}
            </div>
            <button
              className="btn-ghost"
              disabled={pager.page >= pages}
              onClick={() => pager.setPage((p) => p + 1)}
            >
              Next
            </button>
            <select
              className="input"
              value={pager.pageSize}
              onChange={(e) => {
                pager.setPage(1);
                pager.setPageSize(+e.target.value);
              }}
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}/page
                </option>
              ))}
            </select>
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
                  {rows.find((r) => r.key === editing?.key)
                    ? "Edit key"
                    : "New key"}
                </div>
                <button className="btn-ghost" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>

              <label className="block mb-3">
                <div className="muted text-sm mb-1">Key</div>
                <input
                  className="input"
                  value={editing?.key || ""}
                  onChange={(e) =>
                    setEditing((s) => ({ ...s, key: e.target.value }))
                  }
                  placeholder="app.title"
                />
              </label>

              <div className="grid gap-3">
                {locales.map((l) => (
                  <label key={l} className="block">
                    <div className="muted text-sm mb-1">{l.toUpperCase()}</div>
                    <input
                      className="input"
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
