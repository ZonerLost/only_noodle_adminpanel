// Tiny mock service with localStorage persistence for dashboard widgets
const LS_KEY = "fe-dashboard-widgets-v1";

const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const todayISO = () => new Date().toISOString().slice(0, 10);

function genSeries(days = 14, base = 100, noise = 0.25) {
  const out = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const factor = 1 + (Math.random() - 0.5) * noise * 2;
    out.push({
      date: d.toISOString().slice(0, 10),
      value: Math.max(0, Math.round(base * factor)),
    });
  }
  return out;
}

function genZones() {
  const zones = ["North", "East", "Central", "West", "South"];
  return zones.map((z) => ({
    zone: z,
    orders: Math.floor(Math.random() * 120 + 20),
  }));
}

export async function fetchKpis({ range = "7d" } = {}) {
  await wait(300);
  const multiplier = range === "30d" ? 4 : 1;
  return {
    orders: 125 * multiplier,
    revenue: 34210 * multiplier,
    aov: 19.6,
    activeDrivers: 14,
    updatedAt: todayISO(),
  };
}

export async function fetchOrdersSeries({ range = "7d" } = {}) {
  await wait(250);
  const days = range === "30d" ? 30 : 14;
  return genSeries(days, 120, 0.35);
}

export async function fetchRevenueSeries({ range = "7d" } = {}) {
  await wait(250);
  const days = range === "30d" ? 30 : 14;
  return genSeries(days, 2500, 0.28);
}

export async function fetchZoneHeat(options = {}) {
  await wait(220);
  const zones = genZones();
  if (options && typeof options.count === "number") {
    return zones.slice(0, options.count);
  }
  return zones;
}

// ---------- Widgets CRUD (localStorage) ----------
function readWidgets() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return defaultWidgets();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : defaultWidgets();
  } catch {
    return defaultWidgets();
  }
}
function writeWidgets(arr) {
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}
function defaultWidgets() {
  return [
    { id: "w-orders", type: "orders", title: "Orders Spark", span: 1 },
    { id: "w-revenue", type: "revenue", title: "Revenue Spark", span: 1 },
    { id: "w-zones", type: "zones", title: "Zone Heat (mini)", span: 2 },
  ];
}

export async function listWidgets() {
  await wait(120);
  return readWidgets();
}
export async function createWidget(input) {
  await wait(120);
  const widgets = readWidgets();
  const id = `w-${Math.random().toString(36).slice(2, 8)}`;
  const item = { id, ...input };
  widgets.push(item);
  writeWidgets(widgets);
  return item;
}
export async function updateWidget(id, patch) {
  await wait(100);
  const widgets = readWidgets();
  const idx = widgets.findIndex((w) => w.id === id);
  if (idx >= 0) {
    widgets[idx] = { ...widgets[idx], ...patch };
    writeWidgets(widgets);
    return widgets[idx];
  }
  throw new Error("Widget not found");
}
export async function deleteWidget(id) {
  await wait(100);
  let widgets = readWidgets().filter((w) => w.id !== id);
  writeWidgets(widgets);
  return { ok: true };
}
