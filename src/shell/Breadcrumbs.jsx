import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function Breadcrumbs({ className = "" }) {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  return (
    <nav className={className}>
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link className="muted hover:underline" to="/">
            Home
          </Link>
        </li>
        {parts.map((p, idx) => {
          const to = "/" + parts.slice(0, idx + 1).join("/");
          const label = p.replace(/-/g, " ");
          return (
            <li key={to} className="flex items-center gap-2">
              <span className="muted">/</span>
              <Link to={to} className="capitalize hover:underline">
                {label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
