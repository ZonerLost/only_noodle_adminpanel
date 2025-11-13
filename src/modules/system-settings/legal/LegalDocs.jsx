import React, { useEffect, useState } from "react";
import { getLegal, saveLegal } from "../api/settings.service.js";

export default function LegalDocs() {
  const [form, setForm] = useState({ terms: "", privacy: "" });
  useEffect(() => {
    getLegal().then(setForm);
  }, []);

  async function save(e) {
    e.preventDefault();
    await saveLegal(form);
    alert("Legal docs saved");
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Legal Documents</h1>
          <div className="muted text-sm">Terms & Privacy HTML</div>
        </div>

        <form className="card p-4 space-y-3" onSubmit={save}>
          <label className="block">
            <div className="muted text-sm mb-1">Terms (HTML)</div>
            <textarea
              className="input"
              rows={10}
              value={form.terms}
              onChange={(e) =>
                setForm((f) => ({ ...f, terms: e.target.value }))
              }
            />
          </label>
          <label className="block">
            <div className="muted text-sm mb-1">Privacy (HTML)</div>
            <textarea
              className="input"
              rows={10}
              value={form.privacy}
              onChange={(e) =>
                setForm((f) => ({ ...f, privacy: e.target.value }))
              }
            />
          </label>
          <button className="btn">Save</button>
        </form>
      </div>
    </div>
  );
}
