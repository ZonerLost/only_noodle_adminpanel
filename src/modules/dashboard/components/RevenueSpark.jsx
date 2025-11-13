import React from "react";

function toArea(points, w, h, pad = 8) {
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

  if (!coords.length) return "";
  const top = coords
    .map((c, i) => (i === 0 ? `M ${c[0]},${c[1]}` : `L ${c[0]},${c[1]}`))
    .join(" ");
  const last = coords[coords.length - 1];
  const first = coords[0];
  return `${top} L ${last[0]},${h - pad} L ${first[0]},${h - pad} Z`;
}

export default function RevenueSpark({
  data = [],
  total = 0,
  label = "Revenue",
  currency = "EUR",
}) {
  const w = 280,
    h = 80;
  const area = toArea(data, w, h);
  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  return (
    <div className="card p-4">
      <div className="text-sm muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold">
        {fmt.format(total || 0)}
      </div>
      <div className="mt-3">
        {/* responsive svg */}
        <svg
          className="w-full h-20"
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <path d={area} fill="rgba(99,102,241,.15)" />
          <path
            d={area.replace("Z", "")}
            fill="none"
            stroke="rgb(59 130 246)"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}
