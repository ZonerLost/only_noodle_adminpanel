import React from "react";

export default function OptionEditor({ value = [], onChange }) {
  const options = value;

  function addOption() {
    const next = [
      ...options,
      { name: "Option", choices: [{ label: "Default", delta: 0 }] },
    ];
    onChange(next);
  }
  function updOption(i, patch) {
    const next = options.map((o, idx) => (idx === i ? { ...o, ...patch } : o));
    onChange(next);
  }
  function delOption(i) {
    onChange(options.filter((_, idx) => idx !== i));
  }

  function addChoice(i) {
    const next = options.map((o, idx) =>
      idx === i
        ? { ...o, choices: [...o.choices, { label: "New", delta: 0 }] }
        : o
    );
    onChange(next);
  }
  function updChoice(i, j, patch) {
    const next = options.map((o, idx) => {
      if (idx !== i) return o;
      const ch = o.choices.map((c, k) =>
        k === j ? { ...c, ...patch, delta: Number(patch.delta ?? c.delta) } : c
      );
      return { ...o, choices: ch };
    });
    onChange(next);
  }
  function delChoice(i, j) {
    const next = options.map((o, idx) =>
      idx === i ? { ...o, choices: o.choices.filter((_, k) => k !== j) } : o
    );
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">Options</div>
        <button type="button" className="btn-ghost" onClick={addOption}>
          + Add option
        </button>
      </div>

      {options.length === 0 && <div className="muted text-sm">No options</div>}

      {options.map((o, i) => (
        <div
          key={i}
          className="rounded-xl border p-3"
          style={{ borderColor: "var(--line)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <input
              className="input"
              value={o.name}
              onChange={(e) => updOption(i, { name: e.target.value })}
            />
            <button
              type="button"
              className="btn-ghost"
              onClick={() => delOption(i)}
            >
              Remove
            </button>
          </div>
          <div className="space-y-2">
            {o.choices.map((c, j) => (
              <div key={j} className="grid grid-cols-3 gap-2">
                <input
                  className="input"
                  placeholder="Label"
                  value={c.label}
                  onChange={(e) => updChoice(i, j, { label: e.target.value })}
                />
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  placeholder="Price delta"
                  value={c.delta}
                  onChange={(e) => updChoice(i, j, { delta: e.target.value })}
                />
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => delChoice(i, j)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => addChoice(i)}
            >
              + Add choice
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
