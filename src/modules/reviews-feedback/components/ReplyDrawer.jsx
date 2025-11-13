import React, { useEffect, useState } from "react";
import { replyReview } from "../api/reviews.service.js";

export default function ReplyDrawer({ open, value, onClose, onSaved }) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(value?.reply?.text || "");
  }, [value]);

  if (!open || !value) return null;

  async function save() {
    if (!text.trim()) return alert("Type a reply");
    await replyReview(value.id, text.trim());
    onSaved && onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl card p-5 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Reply to {value.name}</div>
          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="muted text-sm mb-2">
          Order {value.orderNo} · {value.rating}★
        </div>
        <div
          className="rounded-xl border p-3 mb-3"
          style={{ borderColor: "var(--line)" }}
        >
          {value.comment}
        </div>

        <textarea
          className="input"
          rows={6}
          placeholder="Write a friendly, helpful reply…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex items-center gap-2 mt-3">
          <button className="btn" onClick={save}>
            Send reply
          </button>
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
