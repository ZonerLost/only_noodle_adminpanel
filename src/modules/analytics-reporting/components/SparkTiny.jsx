import React, { useMemo } from "react";

export default function SparkTiny({
  values = [],
  w = 120,
  h = 36,
  strokeWidth = 2,
  title,
}) {
  const path = useMemo(() => {
    if (!values.length) return "";
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const span = Math.max(1, maxVal - minVal);
    const stepX =
      values.length > 1 ? (w - strokeWidth) / (values.length - 1) : 0;

    const pts = values.map((v, i) => {
      const x = i * stepX + strokeWidth / 2;
      const y = h - ((v - minVal) / span) * (h - strokeWidth) - strokeWidth / 2;
      return [x, y];
    });
    const d = pts
      .map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`))
      .join(" ");
    return d;
  }, [values, w, h, strokeWidth]);

  return (
    <div className="flex items-center gap-2">
      {title && <div className="muted text-xs">{title}</div>}
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <path
          d={path}
          fill="none"
          stroke="rgb(59 130 246)"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
