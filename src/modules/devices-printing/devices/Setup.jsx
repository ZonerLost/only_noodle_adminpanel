import React, { useEffect, useState } from "react";
import {
  listDevices,
  registerDevice,
  removeDevice,
} from "../api/devices.service.js";

export default function Setup() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [iccid, setIccid] = useState("");

  const load = React.useCallback(async () => {
    setBusy(true);
    setRows(await listDevices({ q }));
    setBusy(false);
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  async function add() {
    if (!name || !iccid) return;
    await registerDevice({ name, iccid });
    setName("");
    setIccid("");
    await load();
  }
  async function del(id) {
    if (!confirm("Remove device?")) return;
    await removeDevice(id);
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Devices Setup</h1>
          <div className="muted text-sm">
            Register handheld printers (SIM-based)
          </div>
        </div>

        <div className="card p-3 mb-3">
          <div className="grid gap-2 md:grid-cols-4">
            <input
              className="input md:col-span-2"
              placeholder="Search name or ICCID…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <input
              className="input"
              placeholder="Device name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input"
              placeholder="ICCID"
              value={iccid}
              onChange={(e) => setIccid(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button className="btn" onClick={add}>
              Add device
            </button>
          </div>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">ICCID</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Last Seen</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {busy && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={5}>
                    Loading…
                  </td>
                </tr>
              )}
              {!busy && rows.length === 0 && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={5}>
                    No devices
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t"
                  style={{ borderColor: "var(--line)" }}
                >
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2">{r.iccid}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        r.status === "online"
                          ? "bg-green-500/15 text-green-700"
                          : "bg-gray-500/15 text-gray-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {new Date(r.lastSeen).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button className="btn-ghost" onClick={() => del(r.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
