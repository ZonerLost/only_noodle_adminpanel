import React, { useEffect, useState } from "react";

export default function UserDrawer({
  open,
  onClose,
  roles = [],
  value,
  onCreate,
  onUpdate,
}) {
  const [name, setName] = useState(value?.name || "");
  const [email, setEmail] = useState(value?.email || "");
  const [roleId, setRoleId] = useState(value?.roleId || roles[0]?.id || "");
  const [status, setStatus] = useState(value?.status || "active");
  const isEdit = !!value?.id;

  useEffect(() => {
    setName(value?.name || "");
    setEmail(value?.email || "");
    setRoleId(value?.roleId || roles[0]?.id || "");
    setStatus(value?.status || "active");
  }, [value, roles]);

  async function submit(e) {
    e.preventDefault();
    const payload = { name: name.trim(), email: email.trim(), roleId, status };
    if (!payload.name || !payload.email) return;
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
            {isEdit ? "Edit user" : "New user"}
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
              placeholder="Jane Doe"
              required
            />
          </label>

          <label className="block">
            <div className="text-sm muted">Email</div>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@company.com"
              required
            />
          </label>

          <label className="block">
            <div className="text-sm muted">Role</div>
            <select
              className="input"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="text-sm muted">Status</div>
            <select
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </label>

          <div className="flex items-center gap-2">
            <button className="btn" type="submit">
              {isEdit ? "Save changes" : "Create user"}
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
