// Bonus items + Loyalty rules/ledger (localStorage CRUD)

const K_BONUS = "bl.bonus.v1";
const K_RULES = "bl.rules.v1";
const K_LEDGER = "bl.ledger.v1";

const sleep = (ms = 220) => new Promise((r) => setTimeout(r, ms));
const uid = (p = "") => `${p}${Math.random().toString(36).slice(2, 9)}`;

function seedOnce() {
  if (!localStorage.getItem(K_BONUS)) {
    const demo = [
      {
        id: uid("b_"),
        name: "Toy Surprise",
        type: "toy",
        minCart: 20.01,
        active: true,
      },
      {
        id: uid("b_"),
        name: "Free Drink",
        type: "drink",
        minCart: 25.0,
        active: true,
      },
      {
        id: uid("b_"),
        name: "Mini Dessert",
        type: "dessert",
        minCart: 30.0,
        active: false,
      },
    ];
    localStorage.setItem(K_BONUS, JSON.stringify(demo));
  }
  if (!localStorage.getItem(K_RULES)) {
    // Example: 1 point per €10, 100 pts => €10 voucher
    localStorage.setItem(
      K_RULES,
      JSON.stringify({
        pointsPerEuro: 0.5,
        redeemRate: 0.1, // € per point
        minRedeemPoints: 50,
        expiryDays: 365,
      })
    );
  }
  if (!localStorage.getItem(K_LEDGER)) {
    const now = new Date().toISOString();
    const demo = [
      {
        id: uid("l_"),
        userId: "U-1001",
        user: "Alice",
        ts: now,
        delta: +20,
        reason: "Welcome bonus",
      },
      {
        id: uid("l_"),
        userId: "U-1002",
        user: "Bob",
        ts: now,
        delta: +12,
        reason: "Order #O-1102",
      },
      {
        id: uid("l_"),
        userId: "U-1002",
        user: "Bob",
        ts: now,
        delta: -10,
        reason: "Redeem voucher",
      },
    ];
    localStorage.setItem(K_LEDGER, JSON.stringify(demo));
  }
}
seedOnce();

function read(k) {
  try {
    return JSON.parse(localStorage.getItem(k) || "[]");
  } catch {
    return [];
  }
}
function write(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
}

// BONUS ITEMS
export async function listBonusItems({
  q = "",
  active,
  page = 1,
  pageSize = 10,
} = {}) {
  await sleep();
  let rows = read(K_BONUS);
  if (q) {
    const qq = q.toLowerCase();
    rows = rows.filter(
      (b) =>
        b.name.toLowerCase().includes(qq) || b.type.toLowerCase().includes(qq)
    );
  }
  if (active === true) rows = rows.filter((b) => b.active);
  if (active === false) rows = rows.filter((b) => !b.active);

  const total = rows.length;
  const data = rows
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
  return {
    data,
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function createBonusItem(input) {
  await sleep();
  const rows = read(K_BONUS);
  const row = { id: uid("b_"), ...input };
  rows.push(row);
  write(K_BONUS, rows);
  return row;
}
export async function updateBonusItem(id, patch) {
  await sleep();
  const rows = read(K_BONUS);
  const i = rows.findIndex((r) => r.id === id);
  if (i === -1) throw new Error("Item not found");
  rows[i] = { ...rows[i], ...patch };
  write(K_BONUS, rows);
  return rows[i];
}
export async function deleteBonusItem(id) {
  await sleep();
  write(
    K_BONUS,
    read(K_BONUS).filter((r) => r.id !== id)
  );
  return { ok: true };
}

// LOYALTY RULES
export async function getLoyaltyRules() {
  await sleep();
  try {
    return JSON.parse(localStorage.getItem(K_RULES) || "{}");
  } catch {
    return {};
  }
}
export async function saveLoyaltyRules(patch) {
  await sleep();
  const curr = await getLoyaltyRules();
  const next = { ...curr, ...patch };
  localStorage.setItem(K_RULES, JSON.stringify(next));
  return next;
}

// LEDGER
export async function listLedger({ q = "", page = 1, pageSize = 20 } = {}) {
  await sleep();
  let rows = read(K_LEDGER);
  if (q) {
    const qq = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        (r.user || "").toLowerCase().includes(qq) ||
        (r.userId || "").toLowerCase().includes(qq) ||
        (r.reason || "").toLowerCase().includes(qq)
    );
  }
  const total = rows.length;
  const data = rows
    .sort((a, b) => new Date(b.ts) - new Date(a.ts))
    .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
  const balanceByUser = rows.reduce((m, r) => {
    m[r.userId] = (m[r.userId] || 0) + r.delta;
    return m;
  }, {});
  return {
    data,
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
    balanceByUser,
  };
}

export async function adjustPoints({ userId, user, delta, reason }) {
  await sleep();
  const rows = read(K_LEDGER);
  rows.unshift({
    id: uid("l_"),
    userId,
    user,
    ts: new Date().toISOString(),
    delta: Number(delta),
    reason: reason || "",
  });
  write(K_LEDGER, rows);
  return { ok: true };
}
