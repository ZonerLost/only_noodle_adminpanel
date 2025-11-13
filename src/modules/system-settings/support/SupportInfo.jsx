import React, { useEffect, useState } from "react";
import { getSupport, saveSupport } from "../api/settings.service.js";

export default function SupportInfo() {
  const [form, setForm] = useState({ email: "", phone: "", hours: "" });
  useEffect(() => {
    getSupport().then(setForm);
  }, []);

  async function save(e) {
    e.preventDefault();
    await saveSupport(form);
    alert("Support info saved");
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Support Info</h1>
          <div className="muted text-sm">Contacts shown in apps</div>
        </div>

        <form className="card p-4 space-y-3" onSubmit={save}>
          <input
            className="input"
            placeholder="Support email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <input
            className="input"
            placeholder="Support phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <input
            className="input"
            placeholder="Hours (e.g. 10:00–22:00)"
            value={form.hours}
            onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))}
          />
          <button className="btn">Save</button>
        </form>
      </div>
    </div>
  );
}
