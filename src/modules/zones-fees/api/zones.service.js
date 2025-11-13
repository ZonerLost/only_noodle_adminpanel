const K_ZONES = "zones.v1";
const K_FEES = "zones.fees.v1";
const K_RULES = "zones.rules.v1";

const sleep = (ms = 150) => new Promise((r) => setTimeout(r, ms));
const uid = (p = "") => `${p}${Math.random().toString(36).slice(2, 9)}`;
const read = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k) || JSON.stringify(d));
  } catch {
    return d;
  }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

function seed() {
  if (!localStorage.getItem(K_ZONES))
    write(K_ZONES, [
      { id: uid("z_"), name: "Z1 Downtown", type: "zip", zip: "10115" },
      {
        id: uid("z_"),
        name: "Z2 Airport",
        type: "radius",
        center: "52.55,13.40",
        radiusKm: 6,
      },
    ]);
  if (!localStorage.getItem(K_FEES))
    write(K_FEES, [
      { id: uid("f_"), zoneName: "Z1 Downtown", min: 10, fee: 2.5 },
      { id: uid("f_"), zoneName: "Z2 Airport", min: 20, fee: 4.0 },
    ]);
  if (!localStorage.getItem(K_RULES))
    write(K_RULES, [
      {
        id: uid("r_"),
        name: "Fri 18–21 surcharge",
        cond: "time",
        value: "Fri 18-21",
        effect: "+1€ fee",
      },
    ]);
}
seed();

export async function listZones() {
  await sleep();
  return read(K_ZONES, []);
}
export async function upsertZone(z) {
  await sleep();
  const rows = read(K_ZONES, []);
  if (!z.id) {
    rows.push({ ...z, id: uid("z_") });
  } else {
    const i = rows.findIndex((x) => x.id === z.id);
    rows[i] = { ...rows[i], ...z };
  }
  write(K_ZONES, rows);
  return { ok: true };
}
export async function deleteZone(id) {
  await sleep();
  write(
    K_ZONES,
    read(K_ZONES, []).filter((x) => x.id !== id)
  );
  return { ok: true };
}

export async function listFees() {
  await sleep();
  return read(K_FEES, []);
}
export async function upsertFee(f) {
  await sleep();
  const rows = read(K_FEES, []);
  if (!f.id) {
    rows.push({ ...f, id: uid("f_") });
  } else {
    const i = rows.findIndex((x) => x.id === f.id);
    rows[i] = { ...rows[i], ...f };
  }
  write(K_FEES, rows);
  return { ok: true };
}
export async function deleteFee(id) {
  await sleep();
  write(
    K_FEES,
    read(K_FEES, []).filter((x) => x.id !== id)
  );
  return { ok: true };
}

export async function listZoneRules() {
  await sleep();
  return read(K_RULES, []);
}
export async function upsertZoneRule(r) {
  await sleep();
  const rows = read(K_RULES, []);
  if (!r.id) {
    rows.push({ ...r, id: uid("r_") });
  } else {
    const i = rows.findIndex((x) => x.id === r.id);
    rows[i] = { ...rows[i], ...r };
  }
  write(K_RULES, rows);
  return { ok: true };
}
export async function deleteZoneRule(id) {
  await sleep();
  write(
    K_RULES,
    read(K_RULES, []).filter((x) => x.id !== id)
  );
  return { ok: true };
}
