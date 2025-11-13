import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../routes/paths";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  return (
    <div className="relative">
      <button className="btn-ghost" onClick={() => setOpen((v) => !v)}>
        <img src="/favicon.ico" alt="" className="h-6 w-6 rounded-full" />
        <span className="hidden sm:block">Admin</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 card p-2 shadow">
          <button
            className="btn-ghost w-full justify-start"
            onClick={() => nav(PATHS.settingsBrand)}
          >
            Settings
          </button>
          <button
            className="btn-ghost w-full justify-start"
            onClick={() => {
              localStorage.removeItem("auth.token");
              nav(PATHS.login);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
