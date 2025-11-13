const K_ORDERS = "orders.v1";
const K_RULES = "orders.autoRules.v1";
const K_DRIVERS = "orders.drivers.v1";

const sleep = (ms = 180) => new Promise((r) => setTimeout(r, ms));
const uid = (p = "") => `${p}${Math.random().toString(36).slice(2, 9)}`;

function seed() {
  if (!localStorage.getItem(K_DRIVERS)) {
    localStorage.setItem(
      K_DRIVERS,
      JSON.stringify([
        { id: uid("d_"), name: "Anna M", zone: "Z1", phone: "+4912345678" },
        { id: uid("d_"), name: "Ben S", zone: "Z2", phone: "+4912345679" },
      ])
    );
  }
  if (!localStorage.getItem(K_ORDERS)) {
    localStorage.setItem(
      K_ORDERS,
      JSON.stringify([
        {
          id: uid("o_"),
          number: "FE-1001",
          customer: "Luc",
          addr: "Main Str 10",
          zone: "Z1",
          total: 23.5,
          status: "incoming",
          prepMin: 15,
          driverId: null,
          createdAt: Date.now() - 20 * 60e3,
        },
        {
          id: uid("o_"),
          number: "FE-1002",
          customer: "Mila",
          addr: "Park 5",
          zone: "Z2",
          total: 42.9,
          status: "preparing",
          prepMin: 25,
          driverId: null,
          createdAt: Date.now() - 45 * 60e3,
        },
        {
          id: uid("o_"),
          number: "FE-1000",
          customer: "Jon",
          addr: "Airport T1",
          zone: "Z1",
          total: 19.9,
          status: "onway",
          prepMin: 10,
          driverId: null,
          createdAt: Date.now() - 70 * 60e3,
        },
      ])
    );
  }
  if (!localStorage.getItem(K_RULES)) {
    localStorage.setItem(
      K_RULES,
      JSON.stringify([
        {
          id: uid("r_"),
          name: "Zone Z1 → Anna",
          type: "zone",
          value: "Z1",
          driverHint: "Anna M",
        },
        {
          id: uid("r_"),
          name: "Zone Z2 → Ben",
          type: "zone",
          value: "Z2",
          driverHint: "Ben S",
        },
      ])
    );
  }
}
seed();

const read = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k) || JSON.stringify(d));
  } catch {
    return d;
  }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export async function listDrivers() {
  await sleep();
  return read(K_DRIVERS, []);
}

export async function listOrders({ status, q = "" } = {}) {
  await sleep();
  let rows = read(K_ORDERS, []);
  if (status) rows = rows.filter((o) => o.status === status);
  if (q) {
    const qq = q.toLowerCase();
    rows = rows.filter(
      (o) =>
        o.number.toLowerCase().includes(qq) ||
        o.customer.toLowerCase().includes(qq) ||
        (o.addr || "").toLowerCase().includes(qq)
    );
  }
  rows.sort((a, b) => b.createdAt - a.createdAt);
  return rows;
}

export async function getOrder(id) {
  await sleep();
  return read(K_ORDERS, []).find((o) => o.id === id);
}

export async function createOrder(input) {
  await sleep();
  const rows = read(K_ORDERS, []);
  const row = {
    id: uid("o_"),
    status: "incoming",
    createdAt: Date.now(),
    driverId: null,
    prepMin: 15,
    ...input,
  };
  rows.push(row);
  write(K_ORDERS, rows);
  return row;
}

export async function updateOrder(id, patch) {
  await sleep();
  const rows = read(K_ORDERS, []);
  const i = rows.findIndex((o) => o.id === id);
  if (i === -1) throw new Error("Order not found");
  rows[i] = { ...rows[i], ...patch };
  write(K_ORDERS, rows);
  return rows[i];
}

export async function deleteOrder(id) {
  await sleep();
  write(
    K_ORDERS,
    read(K_ORDERS, []).filter((o) => o.id !== id)
  );
  return { ok: true };
}

export async function transitionOrder(id, nextStatus) {
  return updateOrder(id, { status: nextStatus });
}

export async function assignDriver(id, driverId) {
  return updateOrder(id, { driverId });
}

export async function listAutoRules() {
  await sleep();
  return read(K_RULES, []);
}
export async function upsertAutoRule(rule) {
  await sleep();
  const rows = read(K_RULES, []);
  if (!rule.id) {
    rows.push({ ...rule, id: uid("r_") });
  } else {
    const i = rows.findIndex((r) => r.id === rule.id);
    if (i === -1) throw new Error("Rule not found");
    rows[i] = { ...rows[i], ...rule };
  }
  write(K_RULES, rows);
  return { ok: true };
}
export async function deleteAutoRule(id) {
  await sleep();
  write(
    K_RULES,
    read(K_RULES, []).filter((r) => r.id !== id)
  );
  return { ok: true };
}

export async function suggestDriverFor(order) {
  await sleep(80);
  const rules = read(K_RULES, []);
  const drivers = read(K_DRIVERS, []);
  const byZone = rules.find((r) => r.type === "zone" && r.value === order.zone);
  if (byZone) {
    const d = drivers.find(
      (dd) => dd.name === byZone.driverHint || dd.zone === order.zone
    );
    if (d) return d;
  }
  return drivers[0] || null;
}
