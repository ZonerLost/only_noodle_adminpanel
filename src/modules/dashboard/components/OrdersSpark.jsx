import React from "react";

function toPath(points, w, h, pad = 8) {
  if (!points?.length) return "";
  const ys = points.map((p) => p.value);
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const span = Math.max(1, max - min);
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;

  const coords = points.map((p, i) => {
    const x = pad + (i / (points.length - 1)) * innerW;
    const y = pad + innerH - ((p.value - min) / span) * innerH;
    return [x, y];
  });

  return coords
    .map((c, i) => (i === 0 ? `M ${c[0]},${c[1]}` : `L ${c[0]},${c[1]}`))
    .join(" ");
}

export default function OrdersSpark({
  data = [],
  total = 0,
  label = "Orders",
  delta = 0,
}) {
  const w = 280,
    h = 80;
  const path = toPath(data, w, h);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm muted">{label}</div>
        <div
          className={`text-xs ${
            delta >= 0 ? "text-green-600" : "text-rose-600"
          }`}
        >
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
        </div>
      </div>

      <div className="mt-1 text-2xl font-semibold">
        {Intl.NumberFormat().format(total)}
      </div>

      <div className="mt-3">
        {/* responsive svg: scale to container width while keeping aspect ratio */}
        <svg
          className="w-full h-20"
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <path d={path} fill="none" stroke="var(--primary)" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
