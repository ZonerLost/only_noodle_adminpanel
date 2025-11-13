import React from "react";
export default function Switch({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked
          ? "bg-blue-600 dark:bg-blue-500"
          : "bg-slate-300 dark:bg-slate-600"
      }`}
      aria-pressed={!!checked}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}
