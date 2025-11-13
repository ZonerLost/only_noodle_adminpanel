import React from "react";
export default function Drawer({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl card p-5 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">{title}</div>
          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
}
