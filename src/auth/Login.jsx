import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { PATHS } from "../routes/paths";
import { loginWithEmail, isAuthed } from "./api/auth.service.js";
import { useTheme } from "../theme/ThemeContext.jsx";

export default function Login() {
  const nav = useNavigate();
  const { theme, toggle } = useTheme();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  if (isAuthed()) return <Navigate to={PATHS.dashboard} replace />;

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await loginWithEmail(form);
      nav(PATHS.dashboard);
    } catch (ex) {
      setErr(ex.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen grid place-items-center"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <div className="card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">Only Noodle Admin</div>
          <button
            className="btn-ghost"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>
        <form className="grid gap-3" onSubmit={submit}>
          <label className="block">
            <div className="muted text-sm mb-1">Email</div>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="you@company.com"
            />
          </label>
          <label className="block">
            <div className="muted text-sm mb-1">Password</div>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              placeholder="••••••••"
            />
          </label>
          {err && <div className="text-[--danger]">{err}</div>}
          <button className="btn" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
