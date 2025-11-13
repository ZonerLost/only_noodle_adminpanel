import React from "react";
export default function Badge({ children, tone = "default" }) {
  const bg =
    tone === "green"
      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
      : tone === "red"
      ? "bg-rose-500/15 text-rose-600 dark:text-rose-300"
      : "bg-slate-200/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs ${bg}`}>{children}</span>
  );
}
