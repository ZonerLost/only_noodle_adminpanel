import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  listUsers,
  listRoles,
  createUser,
  updateUser,
  deleteUser,
} from "../api/iam.service.js";
import UsersTable from "./components/UsersTable.jsx";
import UserDrawer from "./components/UserDrawer.jsx";

function usePager() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  return { page, setPage, pageSize, setPageSize };
}

export default function UsersList() {
  const [q, setQ] = useState("");
  const [roleId, setRoleId] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("name");
  const [dir, setDir] = useState("asc");
  const pager = usePager();

  const [roles, setRoles] = useState([]);
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    const rs = await listRoles();
    setRoles(rs);
    const r = await listUsers({
      q,
      roleId,
      status,
      sort,
      dir,
      page: pager.page,
      pageSize: pager.pageSize,
    });
    setRows(r.data);
    setTotal(r.total);
    setBusy(false);
  }, [q, roleId, status, sort, dir, pager.page, pager.pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const pages = useMemo(
    () => Math.max(1, Math.ceil(total / pager.pageSize)),
    [total, pager.pageSize]
  );

  async function onCreate(input) {
    await createUser(input);
    setOpen(false);
    setEditing(null);
    await load();
  }
  async function onUpdate(id, patch) {
    await updateUser(id, patch);
    setOpen(false);
    setEditing(null);
    await load();
  }
  async function onDelete(id) {
    if (!confirm("Delete this user?")) return;
    await deleteUser(id);
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Users</h1>
            <div className="muted text-sm">
              Create, edit, suspend and manage access
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="btn-ghost"
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              + New user
            </button>
          </div>
        </div>

        <div className="card p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <input
              className="input md:col-span-2"
              placeholder="Search name or email…"
              value={q}
              onChange={(e) => {
                pager.setPage(1);
                setQ(e.target.value);
              }}
            />
            <select
              className="input"
              value={roleId}
              onChange={(e) => {
                pager.setPage(1);
                setRoleId(e.target.value);
              }}
            >
              <option value="">All roles</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <select
              className="input"
              value={status}
              onChange={(e) => {
                pager.setPage(1);
                setStatus(e.target.value);
              }}
            >
              <option value="">Any status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
            <div className="flex gap-2">
              <select
                className="input"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="name">Sort: Name</option>
                <option value="email">Sort: Email</option>
                <option value="status">Sort: Status</option>
              </select>
              <button
                className="input"
                onClick={() => setDir((d) => (d === "asc" ? "desc" : "asc"))}
              >
                {dir === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>

        <div className="card overflow-x-auto">
          <UsersTable
            rows={rows}
            roles={roles}
            busy={busy}
            onEdit={(row) => {
              setEditing(row);
              setOpen(true);
            }}
            onDelete={(row) => onDelete(row.id)}
          />
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="muted text-sm">Total: {total}</div>
          <div className="flex items-center gap-2">
            <button
              className="btn-ghost"
              disabled={pager.page <= 1}
              onClick={() => pager.setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <div className="text-sm">
              {pager.page} / {pages}
            </div>
            <button
              className="btn-ghost"
              disabled={pager.page >= pages}
              onClick={() => pager.setPage((p) => p + 1)}
            >
              Next
            </button>
            <select
              className="input"
              value={pager.pageSize}
              onChange={(e) => {
                pager.setPage(1);
                pager.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}/page
                </option>
              ))}
            </select>
          </div>
        </div>

        {open && (
          <UserDrawer
            open={open}
            onClose={() => {
              setOpen(false);
              setEditing(null);
            }}
            roles={roles}
            value={editing}
            onCreate={onCreate}
            onUpdate={onUpdate}
          />
        )}
      </div>
    </div>
  );
}
