import React, { useEffect, useState } from "react";

export default function BonusDrawer({
  open,
  onClose,
  value,
  onCreate,
  onUpdate,
}) {
  const [name, setName] = useState(value?.name || "");
  const [type, setType] = useState(value?.type || "toy");
  const [minCart, setMinCart] = useState(value?.minCart ?? 20.01);
  const [active, setActive] = useState(!!value?.active);
  const isEdit = !!value?.id;

  useEffect(() => {
    setName(value?.name || "");
    setType(value?.type || "toy");
    setMinCart(value?.minCart ?? 20.01);
    setActive(!!value?.active);
  }, [value]);

  async function submit(e) {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      type,
      minCart: Number(minCart) || 0,
      active: !!active,
    };
    if (!payload.name) return;
    if (isEdit) await onUpdate(value.id, payload);
    else await onCreate(payload);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md card p-5 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">
            {isEdit ? "Edit bonus item" : "New bonus item"}
          </div>
          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <label className="block">
            <div className="text-sm muted">Name</div>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Free Drink"
              required
            />
          </label>

          <label className="block">
            <div className="text-sm muted">Type</div>
            <select
              className="input"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="toy">Toy</option>
              <option value="drink">Drink</option>
              <option value="dessert">Dessert</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className="block">
            <div className="text-sm muted">Min cart (€) to unlock</div>
            <input
              className="input"
              type="number"
              step="0.01"
              value={minCart}
              onChange={(e) => setMinCart(e.target.value)}
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-blue-500 w-5 h-5"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            Active
          </label>

          <div className="flex items-center gap-2">
            <button className="btn" type="submit">
              {isEdit ? "Save changes" : "Create item"}
            </button>
            <button className="btn-ghost" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
