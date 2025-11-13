import React, { useEffect, useMemo, useState, useCallback } from "react";
import { listAudit, clearAudit } from "../api/iam.service.js";

function usePager() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  return { page, setPage, pageSize, setPageSize };
}

export default function AuditLog() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const pager = usePager();

  const load = useCallback(async () => {
    setBusy(true);
    const r = await listAudit({
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

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Audit log</h1>
            <div className="muted text-sm">Recent security & admin actions</div>
          </div>
          <button
            className="btn-ghost"
            onClick={async () => {
              if (confirm("Clear audit log?")) {
                await clearAudit();
                await load();
              }
            }}
          >
            Clear
          </button>
        </div>

        <div className="card p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input
              className="input md:col-span-2"
              placeholder="Search action, entity, actor…"
              value={q}
              onChange={(e) => {
                pager.setPage(1);
                setQ(e.target.value);
              }}
            />
            <div />
            <div className="flex gap-2">
              <select
                className="input"
                value={pager.pageSize}
                onChange={(e) => {
                  pager.setPage(1);
                  pager.setPageSize(Number(e.target.value));
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
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Action</th>
                <th className="px-3 py-2">Entity</th>
                <th className="px-3 py-2">Entity ID</th>
                <th className="px-3 py-2">Actor</th>
                <th className="px-3 py-2">Meta</th>
              </tr>
            </thead>
            <tbody>
              {busy && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={6}>
                    Loading…
                  </td>
                </tr>
              )}
              {!busy && rows.length === 0 && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={6}>
                    No audit entries
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t"
                  style={{ borderColor: "var(--line)" }}
                >
                  <td className="px-3 py-2">
                    {new Date(r.ts).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">{r.action}</td>
                  <td className="px-3 py-2">{r.entity}</td>
                  <td className="px-3 py-2">{r.entityId}</td>
                  <td className="px-3 py-2">{r.actor || "system"}</td>
                  <td className="px-3 py-2">
                    <code className="text-xs">
                      {r.meta ? JSON.stringify(r.meta) : "—"}
                    </code>
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
          </div>
        </div>
      </div>
    </div>
  );
}
