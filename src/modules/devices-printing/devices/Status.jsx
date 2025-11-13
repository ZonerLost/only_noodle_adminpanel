import React, { useEffect, useState } from "react";
import { listDevices, heartbeat, setStatus } from "../api/devices.service.js";

export default function Status() {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true);
    setRows(await listDevices({}));
    setBusy(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function ping(id) {
    await heartbeat(id);
    await load();
  }
  async function toggle(id, curr) {
    await setStatus(id, curr === "online" ? "offline" : "online");
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Device Status</h1>
          <div className="muted text-sm">Live heartbeat and connectivity</div>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">Device</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Last Seen</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {busy && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={4}>
                    Loading…
                  </td>
                </tr>
              )}
              {!busy && rows.length === 0 && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={4}>
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
                    <button className="btn-ghost" onClick={() => ping(r.id)}>
                      Ping
                    </button>
                    <button
                      className="btn-ghost"
                      onClick={() => toggle(r.id, r.status)}
                    >
                      {r.status === "online" ? "Go offline" : "Go online"}
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
