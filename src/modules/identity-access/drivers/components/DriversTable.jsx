import React from "react";
import ZoneBadge from "./ZoneBadge.jsx";

export default function DriversTable({ rows = [], busy, onEdit, onDelete }) {
  return (
    <div>
      {/* Desktop / tablet table */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Zone</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Tips</th>
              <th className="px-3 py-2 text-right">Actions</th>
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
                  No drivers
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
                <td className="px-3 py-2">{r.phone}</td>
                <td className="px-3 py-2">
                  <ZoneBadge zone={r.zone} />
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      r.status === "available"
                        ? "bg-green-500/15 text-green-700"
                        : r.status === "on_delivery"
                        ? "bg-amber-500/15 text-amber-700"
                        : "bg-gray-500/15 text-gray-700"
                    }`}
                  >
                    {r.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-3 py-2">€{(r.tipsTotal ?? 0).toFixed(2)}</td>
                <td className="px-3 py-2 text-right">
                  <div className="inline-flex gap-2">
                    <button className="btn-ghost" onClick={() => onEdit(r)}>
                      Edit
                    </button>
                    <button className="btn-ghost" onClick={() => onDelete(r)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="md:hidden space-y-2">
        {busy && <div className="p-4 text-center muted">Loading…</div>}
        {!busy && rows.length === 0 && (
          <div className="p-4 text-center muted">No drivers</div>
        )}
        {rows.map((r) => (
          <div
            key={r.id}
            className="p-3 rounded-lg border"
            style={{ borderColor: "var(--line)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{r.name}</div>
                <div className="text-sm muted">{r.phone}</div>
                <div className="text-sm mt-1">
                  <ZoneBadge zone={r.zone} />
                </div>
              </div>
              <div className="text-right">
                <div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      r.status === "available"
                        ? "bg-green-500/15 text-green-700"
                        : r.status === "on_delivery"
                        ? "bg-amber-500/15 text-amber-700"
                        : "bg-gray-500/15 text-gray-700"
                    }`}
                  >
                    {r.status.replace("_", " ")}
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  Tips: €{(r.tipsTotal ?? 0).toFixed(2)}
                </div>
                <div className="mt-2 flex gap-2 justify-end">
                  <button className="btn-ghost" onClick={() => onEdit(r)}>
                    Edit
                  </button>
                  <button className="btn-ghost" onClick={() => onDelete(r)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
