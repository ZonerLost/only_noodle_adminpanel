import React, { useEffect, useState } from "react";

export default function DriverDrawer({
  open,
  onClose,
  value,
  onCreate,
  onUpdate,
}) {
  const [name, setName] = useState(value?.name || "");
  const [phone, setPhone] = useState(value?.phone || "");
  const [zone, setZone] = useState(value?.zone || "");
  const [status, setStatus] = useState(value?.status || "available");
  const [tipsTotal, setTipsTotal] = useState(value?.tipsTotal ?? 0);
  const isEdit = !!value?.id;

  useEffect(() => {
    setName(value?.name || "");
    setPhone(value?.phone || "");
    setZone(value?.zone || "");
    setStatus(value?.status || "available");
    setTipsTotal(value?.tipsTotal ?? 0);
  }, [value]);

  async function submit(e) {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      zone: zone.trim(),
      status,
      tipsTotal: Number(tipsTotal) || 0,
    };
    if (!payload.name || !payload.phone || !payload.zone) return;
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
            {isEdit ? "Edit driver" : "New driver"}
          </div>
          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <label className="block">
            <div className="text-sm muted">Full name</div>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Driver"
              required
            />
          </label>

          <label className="block">
            <div className="text-sm muted">Phone</div>
            <input
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+49…"
              required
            />
          </label>

          <label className="block">
            <div className="text-sm muted">Zone</div>
            <input
              className="input"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              placeholder="ZIP-10115"
              required
            />
          </label>

          <label className="block">
            <div className="text-sm muted">Status</div>
            <select
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="available">Available</option>
              <option value="on_delivery">On delivery</option>
              <option value="offline">Offline</option>
            </select>
          </label>

          <label className="block">
            <div className="text-sm muted">Tips total (€)</div>
            <input
              className="input"
              type="number"
              step="0.01"
              value={tipsTotal}
              onChange={(e) => setTipsTotal(e.target.value)}
            />
          </label>

          <div className="flex items-center gap-2">
            <button className="btn" type="submit">
              {isEdit ? "Save changes" : "Create driver"}
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
