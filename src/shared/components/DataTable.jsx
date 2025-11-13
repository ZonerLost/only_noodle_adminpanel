import React from "react";
export default function DataTable({
  columns = [],
  rows = [],
  empty = "No data",
}) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2">
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td
                className="px-3 py-8 text-center muted"
                colSpan={columns.length}
              >
                {empty}
              </td>
            </tr>
          )}
          {rows.map((r, i) => (
            <tr
              key={r.id || i}
              className="border-t"
              style={{ borderColor: "var(--line)" }}
            >
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2">
                  {c.render ? c.render(r) : r[c.dataIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
