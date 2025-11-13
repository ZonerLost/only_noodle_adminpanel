import React from "react";
import { useUI } from "../shared/context/UIContext.jsx";

export default function NotificationsPanel() {
  const { notifOpen, closeNotifications } = useUI();
  if (!notifOpen) return null;
  return (
    <div className="fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeNotifications}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-md card p-4 overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold">Notifications</div>
          <button className="btn-ghost" onClick={closeNotifications}>
            Close
          </button>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border p-3"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="font-medium">Order FE-10{i} updated</div>
              <div className="muted text-sm">Status changed to preparing</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
