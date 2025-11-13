import React, { useEffect, useState } from "react";
import {
  listCampaigns,
  upsertCampaign,
  deleteCampaign,
} from "../api/settings.service.js";

export default function Campaigns() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    title: "",
    segment: "all",
    schedule: "now",
    message: "",
  });

  async function load() {
    setRows(await listCampaigns());
  }
  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setForm({
      id: null,
      title: "",
      segment: "all",
      schedule: "now",
      message: "",
    });
    setOpen(true);
  }
  function startEdit(c) {
    setForm(c);
    setOpen(true);
  }

  async function save() {
    if (!form.title) return alert("Title required");
    await upsertCampaign(form);
    setOpen(false);
    await load();
  }
  async function del(id) {
    if (!confirm("Delete campaign?")) return;
    await deleteCampaign(id);
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Campaigns</h1>
            <div className="muted text-sm">
              Send scheduled push/email campaigns
            </div>
          </div>
          <button className="btn-ghost" onClick={startNew}>
            + New
          </button>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Segment</th>
                <th className="px-3 py-2">Schedule</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-8 text-center muted" colSpan={5}>
                    No campaigns
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t"
                  style={{ borderColor: "var(--line)" }}
                >
                  <td className="px-3 py-2">{r.title}</td>
                  <td className="px-3 py-2">{r.segment}</td>
                  <td className="px-3 py-2">{r.schedule}</td>
                  <td className="px-3 py-2">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button className="btn-ghost" onClick={() => startEdit(r)}>
                      Edit
                    </button>
                    <button className="btn-ghost" onClick={() => del(r.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {open && (
          <div className="fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-full max-w-xl card p-5 overflow-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold">
                  {form.id ? "Edit campaign" : "New campaign"}
                </div>
                <button className="btn-ghost" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>

              <div className="grid gap-2">
                <input
                  className="input"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
                <select
                  className="input"
                  value={form.segment}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, segment: e.target.value }))
                  }
                >
                  <option value="all">All users</option>
                  <option value="loyal">Loyal customers</option>
                  <option value="dormant">Dormant (30+ days)</option>
                </select>
                <select
                  className="input"
                  value={form.schedule}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, schedule: e.target.value }))
                  }
                >
                  <option value="now">Send now</option>
                  <option value="tonight">Tonight 8pm</option>
                  <option value="custom">Custom</option>
                </select>
                <textarea
                  className="input"
                  rows={6}
                  placeholder="Message"
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                />
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button className="btn" onClick={save}>
                  Save
                </button>
                <button className="btn-ghost" onClick={() => setOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
