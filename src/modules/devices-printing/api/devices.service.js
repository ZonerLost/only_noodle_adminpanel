const K_DEV = "dev.print.devices.v1";
const K_TPL = "dev.print.templates.v1";

const sleep = (ms = 200) => new Promise((r) => setTimeout(r, ms));
const uid = (p = "") => `${p}${Math.random().toString(36).slice(2, 9)}`;

function seed() {
  if (!localStorage.getItem(K_DEV)) {
    localStorage.setItem(
      K_DEV,
      JSON.stringify([
        {
          id: uid("d_"),
          name: "Kitchen POS #1",
          iccid: "8931440400000012345",
          status: "online",
          lastSeen: new Date().toISOString(),
        },
        {
          id: uid("d_"),
          name: "Front Desk Printer",
          iccid: "8931440400000045678",
          status: "offline",
          lastSeen: new Date(Date.now() - 3600e3).toISOString(),
        },
      ])
    );
  }
  if (!localStorage.getItem(K_TPL)) {
    localStorage.setItem(
      K_TPL,
      JSON.stringify([
        {
          id: uid("t_"),
          name: "Standard 58mm",
          width: 58,
          body: "Order #{orderId}\n{items}\nTotal: €{total}",
        },
        {
          id: uid("t_"),
          name: "Compact 58mm",
          width: 58,
          body: "#{orderId} {total}\n{items}",
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

export async function listDevices({ q = "" } = {}) {
  await sleep();
  let rows = read(K_DEV, []);
  if (q) {
    const qq = q.toLowerCase();
    rows = rows.filter(
      (d) => d.name.toLowerCase().includes(qq) || (d.iccid || "").includes(qq)
    );
  }
  rows.sort((a, b) => a.name.localeCompare(b.name));
  return rows;
}
export async function registerDevice({ name, iccid }) {
  await sleep();
  const rows = read(K_DEV, []);
  const row = {
    id: uid("d_"),
    name,
    iccid,
    status: "online",
    lastSeen: new Date().toISOString(),
  };
  rows.push(row);
  write(K_DEV, rows);
  return row;
}
export async function removeDevice(id) {
  await sleep();
  write(
    K_DEV,
    read(K_DEV, []).filter((d) => d.id !== id)
  );
  return { ok: true };
}
export async function heartbeat(id) {
  await sleep(120);
  const rows = read(K_DEV, []);
  const i = rows.findIndex((d) => d.id === id);
  if (i !== -1) {
    rows[i].status = "online";
    rows[i].lastSeen = new Date().toISOString();
    write(K_DEV, rows);
  }
  return { ok: true };
}
export async function setStatus(id, status) {
  await sleep(120);
  const rows = read(K_DEV, []);
  const i = rows.findIndex((d) => d.id === id);
  if (i !== -1) {
    rows[i].status = status;
    rows[i].lastSeen = new Date().toISOString();
    write(K_DEV, rows);
  }
  return { ok: true };
}

export async function listTemplates() {
  await sleep();
  return read(K_TPL, []);
}
export async function upsertTemplate(tpl) {
  await sleep();
  const rows = read(K_TPL, []);
  if (!tpl.id) rows.push({ ...tpl, id: uid("t_") });
  else {
    const i = rows.findIndex((t) => t.id === tpl.id);
    if (i === -1) throw new Error("template not found");
    rows[i] = { ...rows[i], ...tpl };
  }
  write(K_TPL, rows);
  return { ok: true };
}
export async function deleteTemplate(id) {
  await sleep();
  write(
    K_TPL,
    read(K_TPL, []).filter((t) => t.id !== id)
  );
  return { ok: true };
}

// simulate print preview
export async function previewTemplate(tplId, sample) {
  await sleep();
  const tpl = read(K_TPL, []).find((t) => t.id === tplId);
  if (!tpl) throw new Error("Template not found");
  let out = tpl.body;
  Object.entries(sample || {}).forEach(([k, v]) => {
    out = out.replaceAll(`{${k}}`, String(v));
  });
  return { width: tpl.width, body: out };
}
