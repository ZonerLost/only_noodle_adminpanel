import React, { useEffect, useState } from "react";
import { getBrand, saveBrand } from "../api/settings.service.js";

export default function Branding() {
  const [form, setForm] = useState({ name: "", logo: "", primary: "#6366f1" });

  useEffect(() => {
    getBrand().then(setForm);
  }, []);

  async function save(e) {
    e.preventDefault();
    await saveBrand(form);
    alert("Branding saved");
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Branding</h1>
          <div className="muted text-sm">Logo, name and primary color</div>
        </div>

        <form className="card p-4 space-y-3 max-w-3xl" onSubmit={save}>
          <label className="block">
            <div className="muted text-sm mb-1">App name</div>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label className="block">
            <div className="muted text-sm mb-1">Logo URL</div>
            <input
              className="input"
              value={form.logo}
              onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))}
            />
          </label>
          <label className="block">
            <div className="muted text-sm mb-1">Primary color</div>
            <input
              className="input"
              type="color"
              value={form.primary}
              onChange={(e) =>
                setForm((f) => ({ ...f, primary: e.target.value }))
              }
            />
          </label>

          <div className="flex items-center gap-2">
            <button className="btn">Save</button>
            {form.logo && (
              <img src={form.logo} alt="logo" className="h-8 w-8 rounded-lg" />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
