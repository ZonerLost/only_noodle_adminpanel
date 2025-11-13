import React from "react";

export default function DateRange({ from, to, onChange }) {
  const setDays = (n) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (n - 1));
    onChange({
      from: start.toISOString().slice(0, 10),
      to: end.toISOString().slice(0, 10),
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        className="input"
        type="date"
        value={from || ""}
        onChange={(e) => onChange({ from: e.target.value, to })}
      />
      <input
        className="input"
        type="date"
        value={to || ""}
        onChange={(e) => onChange({ from, to: e.target.value })}
      />
      <div className="flex gap-2">
        <button className="btn-ghost" onClick={() => setDays(7)}>
          7d
        </button>
        <button className="btn-ghost" onClick={() => setDays(30)}>
          30d
        </button>
        <button className="btn-ghost" onClick={() => setDays(90)}>
          90d
        </button>
      </div>
    </div>
  );
}
