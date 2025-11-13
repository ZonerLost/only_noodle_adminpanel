// Mock analytics with localStorage seed + filters + CSV generation

const K_ORDERS = "ar.orders.v1";
const K_TIPS = "ar.tips.v1";

const sleep = (ms = 220) => new Promise((r) => setTimeout(r, ms));

function seedOnce() {
  if (!localStorage.getItem(K_ORDERS)) {
    const zones = ["ZIP-10115", "ZIP-10119", "ZIP-10243", "ZIP-10405"];
    const pm = ["card", "cash", "paypal", "stripe"];
    const today = new Date();
    const orders = [];
    let id = 1000;

    for (let d = 0; d < 90; d++) {
      const day = new Date(today);
      day.setDate(today.getDate() - d);
      const count = Math.floor(Math.random() * 18) + 4;
      for (let i = 0; i < count; i++) {
        const amount = +(Math.random() * 45 + 8).toFixed(2);
        const tip =
          Math.random() < 0.65
            ? +(amount * (Math.random() * 0.12)).toFixed(2)
            : 0;
        orders.push({
          id: `O-${id++}`,
          ts: new Date(
            day.getFullYear(),
            day.getMonth(),
            day.getDate(),
            Math.floor(Math.random() * 14) + 9,
            Math.floor(Math.random() * 60)
          ).toISOString(),
          amount,
          tip,
          zone: zones[Math.floor(Math.random() * zones.length)],
          payMethod: pm[Math.floor(Math.random() * pm.length)],
          driver: ["Daniel Roy", "Emma Weiss", "Farid Khan", "Nina Bauer"][
            Math.floor(Math.random() * 4)
          ],
          status: "completed",
        });
      }
    }
    localStorage.setItem(K_ORDERS, JSON.stringify(orders));
  }
  if (!localStorage.getItem(K_TIPS)) {
    const orders = JSON.parse(localStorage.getItem(K_ORDERS) || "[]");
    const tips = orders
      .filter((o) => o.tip > 0)
      .map((o) => ({
        id: `T-${o.id}`,
        orderId: o.id,
        ts: o.ts,
        driver: o.driver,
        amount: o.tip,
        zone: o.zone,
      }));
    localStorage.setItem(K_TIPS, JSON.stringify(tips));
  }
}
seedOnce();

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function clampDateRange(from, to) {
  const start = from ? new Date(from) : new Date("2000-01-01");
  const end = to ? new Date(to) : new Date("2999-12-31");
  return { start, end };
}

function between(ts, start, end) {
  const t = new Date(ts);
  return t >= start && t <= end;
}

export async function getOverview({ from, to } = {}) {
  await sleep();
  const { start, end } = clampDateRange(from, to);
  const orders = read(K_ORDERS).filter((o) => between(o.ts, start, end));

  const totalSales = orders.reduce((s, o) => s + o.amount, 0);
  const totalTips = orders.reduce((s, o) => s + o.tip, 0);
  const totalOrders = orders.length;
  const aov = totalOrders ? totalSales / totalOrders : 0;

  // time series (by day)
  const dayKey = (d) => d.toISOString().slice(0, 10);
  const map = new Map();
  orders.forEach((o) => {
    const k = dayKey(new Date(o.ts));
    const prev = map.get(k) || { sales: 0, orders: 0, tips: 0 };
    prev.sales += o.amount;
    prev.orders += 1;
    prev.tips += o.tip;
    map.set(k, prev);
  });
  const series = Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([date, v]) => ({ date, ...v }));

  // top zones
  const z = new Map();
  orders.forEach((o) => {
    z.set(o.zone, (z.get(o.zone) || 0) + o.amount);
  });
  const topZones = Array.from(z.entries())
    .map(([zone, sales]) => ({ zone, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return {
    kpis: {
      totalSales: +totalSales.toFixed(2),
      totalTips: +totalTips.toFixed(2),
      totalOrders,
      aov: +aov.toFixed(2),
    },
    series,
    topZones,
  };
}

export async function listTips({
  from,
  to,
  q = "",
  page = 1,
  pageSize = 20,
} = {}) {
  await sleep();
  const { start, end } = clampDateRange(from, to);
  let tips = read(K_TIPS).filter((t) => between(t.ts, start, end));
  if (q) {
    const qq = q.toLowerCase();
    tips = tips.filter(
      (t) =>
        t.orderId.toLowerCase().includes(qq) ||
        (t.driver || "").toLowerCase().includes(qq) ||
        (t.zone || "").toLowerCase().includes(qq)
    );
  }
  const total = tips.length;
  const data = tips
    .sort((a, b) => new Date(b.ts) - new Date(a.ts))
    .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
  const sum = tips.reduce((s, t) => s + t.amount, 0);
  return {
    data,
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
    sum: +sum.toFixed(2),
  };
}

export async function listSales({ from, to, groupBy = "day" } = {}) {
  await sleep();
  const { start, end } = clampDateRange(from, to);
  const orders = read(K_ORDERS).filter((o) => between(o.ts, start, end));

  const keyFn = (d) => {
    const dt = new Date(d);
    if (groupBy === "week") {
      const onejan = new Date(dt.getFullYear(), 0, 1);
      const week = Math.ceil(
        ((dt - onejan) / 86400000 + onejan.getDay() + 1) / 7
      );
      return `${dt.getFullYear()}-W${String(week).padStart(2, "0")}`;
    }
    if (groupBy === "month")
      return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    return dt.toISOString().slice(0, 10);
  };

  const agg = new Map();
  orders.forEach((o) => {
    const k = keyFn(o.ts);
    const prev = agg.get(k) || { sales: 0, orders: 0, tips: 0 };
    prev.sales += o.amount;
    prev.orders += 1;
    prev.tips += o.tip;
    agg.set(k, prev);
  });
  const series = Array.from(agg.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([bucket, v]) => ({ bucket, ...v }));
  return { series };
}

export async function exportCSV({ from, to, type = "orders" } = {}) {
  await sleep();
  const { start, end } = clampDateRange(from, to);
  const orders = read(K_ORDERS).filter((o) => between(o.ts, start, end));

  if (type === "tips") {
    const tips = read(K_TIPS).filter((t) => between(t.ts, start, end));
    const header = ["id", "orderId", "ts", "driver", "zone", "amount"];
    const rows = tips.map((t) => [
      t.id,
      t.orderId,
      t.ts,
      t.driver,
      t.zone,
      t.amount,
    ]);
    return toCSV([header, ...rows]);
  }

  const header = [
    "id",
    "ts",
    "amount",
    "tip",
    "zone",
    "payMethod",
    "driver",
    "status",
  ];
  const rows = orders.map((o) => [
    o.id,
    o.ts,
    o.amount,
    o.tip,
    o.zone,
    o.payMethod,
    o.driver,
    o.status,
  ]);
  return toCSV([header, ...rows]);
}

function toCSV(rows) {
  return rows
    .map((r) =>
      r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");
}
