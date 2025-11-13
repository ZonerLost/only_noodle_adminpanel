import React from "react";
export default function Tabs({ tabs = [], value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      {tabs.map((t) => (
        <button
          key={t.value}
          className={`btn-ghost ${
            value === t.value ? "font-semibold underline" : ""
          }`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
