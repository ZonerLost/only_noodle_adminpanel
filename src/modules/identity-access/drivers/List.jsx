import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  listDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../api/iam.service.js";
import DriversTable from "./components/DriversTable.jsx";
import DriverDrawer from "./components/DriverDrawer.jsx";

function usePager() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  return { page, setPage, pageSize, setPageSize };
}

export default function DriversList() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [zone, setZone] = useState("");
  const [sort, setSort] = useState("name");
  const [dir, setDir] = useState("asc");
  const pager = usePager();

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    const r = await listDrivers({
      q,
      status,
      zone,
      sort,
      dir,
      page: pager.page,
      pageSize: pager.pageSize,
    });
    setRows(r.data);
    setTotal(r.total);
    setBusy(false);
  }, [q, status, zone, sort, dir, pager.page, pager.pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const pages = useMemo(
    () => Math.max(1, Math.ceil(total / pager.pageSize)),
    [total, pager.pageSize]
  );

  async function onCreate(input) {
    await createDriver(input);
    setOpen(false);
    setEditing(null);
    await load();
  }
  async function onUpdate(id, patch) {
    await updateDriver(id, patch);
    setOpen(false);
    setEditing(null);
    await load();
  }
  async function onDelete(id) {
    if (!confirm("Delete this driver?")) return;
    await deleteDriver(id);
    await load();
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Drivers</h1>
            <div className="muted text-sm">
              Assign zones, track status and manage roster
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
              + New driver
            </button>
          </div>
        </div>

        <div className="card p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <input
              className="input md:col-span-2"
              placeholder="Search name, phone or zone…"
              value={q}
              onChange={(e) => {
                pager.setPage(1);
                setQ(e.target.value);
              }}
            />
            <select
              className="input"
              value={status}
              onChange={(e) => {
                pager.setPage(1);
                setStatus(e.target.value);
              }}
            >
              <option value="">Any status</option>
              <option value="available">Available</option>
              <option value="on_delivery">On delivery</option>
              <option value="offline">Offline</option>
            </select>
            <input
              className="input"
              placeholder="Filter zone (e.g., ZIP-10115)"
              value={zone}
              onChange={(e) => {
                pager.setPage(1);
                setZone(e.target.value);
              }}
            />
            <div className="flex gap-2">
              <select
                className="input"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="name">Sort: Name</option>
                <option value="zone">Sort: Zone</option>
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
          <DriversTable
            rows={rows}
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
          <DriverDrawer
            open={open}
            onClose={() => {
              setOpen(false);
              setEditing(null);
            }}
            value={editing}
            onCreate={onCreate}
            onUpdate={onUpdate}
          />
        )}
      </div>
    </div>
  );
}
