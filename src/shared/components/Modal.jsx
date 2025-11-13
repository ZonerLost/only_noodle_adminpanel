import React from "react";
export default function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="card p-4 max-w-lg w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-semibold">{title}</div>
            <button className="btn-ghost" onClick={onClose}>
              ✕
            </button>
          </div>
          <div>{children}</div>
          {footer && <div className="mt-4">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
