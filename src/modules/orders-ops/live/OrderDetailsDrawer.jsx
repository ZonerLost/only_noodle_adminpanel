import React, { useEffect, useState } from "react";
import {
  listDrivers,
  suggestDriverFor,
  updateOrder,
  assignDriver,
} from "../api/orders.service.js";

export default function OrderDetailsDrawer({ open, value, onClose, onSaved }) {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => {
    listDrivers().then(setDrivers);
  }, []);
  useEffect(() => {
    setForm(value ? { ...value } : null);
  }, [value]);

  useEffect(() => {
    (async () => {
      if (value && !value.driverId) {
        const d = await suggestDriverFor(value);
        if (d) setForm((f) => (f ? { ...f, driverId: d.id } : f));
      }
    })();
  }, [value]);

  if (!open || !form) return null;

  async function save() {
    await updateOrder(form.id, {
      prepMin: Number(form.prepMin) || 0,
      addr: form.addr,
      notes: form.notes || "",
      zone: form.zone,
    });
    if (form.driverId !== value.driverId) {
      await assignDriver(form.id, form.driverId || null);
    }
    onSaved && onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl card p-5 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Order {form.number}</div>
          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="muted text-xs">Customer</div>
              <div className="font-medium">{form.customer}</div>
            </div>
            <div className="text-right">
              <div className="muted text-xs">Total</div>
              <div className="font-medium">
                €{Number(form.total).toFixed(2)}
              </div>
            </div>
          </div>

          <label className="block">
            <div className="muted text-sm mb-1">Address</div>
            <input
              className="input"
              value={form.addr || ""}
              onChange={(e) => setForm((f) => ({ ...f, addr: e.target.value }))}
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <div className="muted text-sm mb-1">Zone</div>
              <input
                className="input"
                value={form.zone || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, zone: e.target.value }))
                }
              />
            </label>
            <label className="block">
              <div className="muted text-sm mb-1">Prep (min)</div>
              <input
                type="number"
                className="input"
                value={form.prepMin || 0}
                onChange={(e) =>
                  setForm((f) => ({ ...f, prepMin: e.target.value }))
                }
              />
            </label>
          </div>

          <label className="block">
            <div className="muted text-sm mb-1">Assign Driver</div>
            <select
              className="input"
              value={form.driverId || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, driverId: e.target.value || null }))
              }
            >
              <option value="">Unassigned</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.zone})
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="muted text-sm mb-1">Notes</div>
            <textarea
              className="input"
              rows={4}
              value={form.notes || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
            />
          </label>

          <div className="flex items-center gap-2">
            <button className="btn" onClick={save}>
              Save
            </button>
            <button className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
