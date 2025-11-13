import React, { useEffect, useState, useCallback } from "react";
import { listReviews, deleteReview } from "../api/reviews.service.js";
import ReplyDrawer from "../components/ReplyDrawer.jsx";

export default function ReviewsList() {
  const [q, setQ] = useState("");
  const [rating, setRating] = useState("");
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const load = useCallback(async () => {
    setRows(await listReviews({ q, rating }));
  }, [q, rating]);

  useEffect(() => {
    load();
  }, [load]);

  function answer(r) {
    setCurrent(r);
    setOpen(true);
  }
  async function del(id) {
    if (!confirm("Delete review?")) return;
    await deleteReview(id);
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Customer Reviews</h1>
            <div className="muted text-sm">Reply and manage feedback</div>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="input w-32"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">All ratings</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n}★
                </option>
              ))}
            </select>
            <input
              className="input w-64"
              placeholder="Search…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        <div className="card overflow-x-auto">
          {/* Desktop/tablet */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Rating</th>
                  <th className="px-3 py-2">Comment</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td className="px-3 py-8 text-center muted" colSpan={5}>
                      No reviews
                    </td>
                  </tr>
                )}
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <td className="px-3 py-2">{r.orderNo}</td>
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2">{r.rating}★</td>
                    <td className="px-3 py-2">{r.comment}</td>
                    <td className="px-3 py-2 text-right">
                      <button className="btn-ghost" onClick={() => answer(r)}>
                        Reply
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

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {rows.length === 0 && (
              <div className="p-4 text-center muted">No reviews</div>
            )}
            {rows.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-lg border"
                style={{ borderColor: "var(--line)" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">Order {r.orderNo}</div>
                    <div className="text-sm muted">
                      {r.name} • Rating: {r.rating}★
                    </div>
                    <div className="mt-2 text-sm">{r.comment}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button className="btn-ghost" onClick={() => answer(r)}>
                      Reply
                    </button>
                    <button className="btn-ghost" onClick={() => del(r.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ReplyDrawer
          open={open}
          value={current}
          onClose={() => setOpen(false)}
          onSaved={load}
        />
      </div>
    </div>
  );
}
