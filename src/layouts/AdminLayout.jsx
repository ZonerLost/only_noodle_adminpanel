import React from "react";
import { Outlet } from "react-router-dom";
import "../index.css";

export default function AdminLayout() {
  return (
    <div className="app-shell">
      <header className="p-4 border-b">Admin header</header>
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}
