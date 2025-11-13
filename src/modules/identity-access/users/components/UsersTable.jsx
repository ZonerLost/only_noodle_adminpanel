import React from "react";

export default function UsersTable({
  rows = [],
  roles = [],
  busy,
  onEdit,
  onDelete,
}) {
  const roleName = (id) => roles.find((r) => r.id === id)?.name || "—";

  return (
    <div>
      {/* Desktop / tablet table */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {busy && (
              <tr>
                <td className="px-3 py-8 text-center muted" colSpan={5}>
                  Loading…
                </td>
              </tr>
            )}
            {!busy && rows.length === 0 && (
              <tr>
                <td className="px-3 py-8 text-center muted" colSpan={5}>
                  No users
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t"
                style={{ borderColor: "var(--line)" }}
              >
                <td className="px-3 py-2">{row.name}</td>
                <td className="px-3 py-2">{row.email}</td>
                <td className="px-3 py-2">{roleName(row.roleId)}</td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      row.status === "active"
                        ? "bg-green-500/15 text-green-700"
                        : "bg-rose-500/15 text-rose-700"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="inline-flex gap-2">
                    <button className="btn-ghost" onClick={() => onEdit(row)}>
                      Edit
                    </button>
                    <button className="btn-ghost" onClick={() => onDelete(row)}>
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
          <div className="p-4 text-center muted">No users</div>
        )}
        {rows.map((row) => (
          <div
            key={row.id}
            className="p-3 rounded-lg border"
            style={{ borderColor: "var(--line)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{row.name}</div>
                <div className="text-sm muted">{row.email}</div>
                <div className="text-sm muted">{roleName(row.roleId)}</div>
              </div>
              <div className="text-right">
                <div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      row.status === "active"
                        ? "bg-green-500/15 text-green-700"
                        : "bg-rose-500/15 text-rose-700"
                    }`}
                  >
                    {row.status}
                  </span>
                </div>
                <div className="mt-2 flex gap-2 justify-end">
                  <button className="btn-ghost" onClick={() => onEdit(row)}>
                    Edit
                  </button>
                  <button className="btn-ghost" onClick={() => onDelete(row)}>
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
