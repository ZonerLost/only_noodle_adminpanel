import React, { useEffect, useState } from "react";

const K_BUSY = "busy.mode.v1";
const read = () => {
  try {
    return JSON.parse(localStorage.getItem(K_BUSY) || "{}");
  } catch {
    return {};
  }
};
const write = (v) => localStorage.setItem(K_BUSY, JSON.stringify(v));

export default function BusyMode() {
  const [active, setActive] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);
  const [note, setNote] = useState("");

  useEffect(() => {
    const s = read();
    setActive(!!s.active);
    setMultiplier(Number(s.multiplier || 1));
    setNote(s.note || "");
  }, []);

  function save() {
    const payload = {
      active,
      multiplier: Number(multiplier) || 1,
      note,
      updatedAt: new Date().toISOString(),
    };
    write(payload);
    alert("Busy Mode saved");
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Busy Mode</h1>
          <div className="muted text-sm">
            Increase prep times globally during rush hours
          </div>
        </div>

        <div className="card p-4 space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="accent-blue-500 w-5 h-5"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <div className="font-medium">Enable Busy Mode</div>
          </label>

          <label className="block">
            <div className="muted text-sm mb-1">
              Multiplier (e.g. 1.5 makes all prep times 50% longer)
            </div>
            <input
              className="input"
              type="number"
              step="0.1"
              min="1"
              value={multiplier}
              onChange={(e) => setMultiplier(e.target.value)}
            />
          </label>

          <label className="block">
            <div className="muted text-sm mb-1">Operator Note (optional)</div>
            <textarea
              className="input"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Friday rush 6–9pm"
            />
          </label>

          <div className="flex items-center gap-2">
            <button className="btn" onClick={save}>
              Save
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                setActive(false);
                setMultiplier(1);
                setNote("");
              }}
            >
              Reset
            </button>
          </div>

          <div className="muted text-sm">
            Current effective multiplier: <b>{active ? multiplier : 1}×</b>
          </div>
        </div>
      </div>
    </div>
  );
}
