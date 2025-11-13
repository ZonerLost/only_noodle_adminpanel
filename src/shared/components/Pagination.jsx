import React from "react";
export default function Pagination({
  page = 1,
  total = 0,
  pageSize = 10,
  onChange,
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex items-center gap-2">
      <button
        className="btn-ghost"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Prev
      </button>
      <div className="muted text-sm">
        Page {page} / {pages}
      </div>
      <button
        className="btn-ghost"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
