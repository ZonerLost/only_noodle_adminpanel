const K_BRAND = "settings.brand.v1";
const K_TPL = "settings.templates.v1";
const K_CAMP = "settings.campaigns.v1";
const K_LEGAL = "settings.legal.v1";
const K_SUPPORT = "settings.support.v1";

const sleep = (ms = 160) => new Promise((r) => setTimeout(r, ms));
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
  if (!localStorage.getItem(K_BRAND))
    write(K_BRAND, { name: "French Eyes", logo: "", primary: "#6366f1" });
  if (!localStorage.getItem(K_TPL))
    write(K_TPL, [
      {
        id: uid("t_"),
        key: "order_update",
        name: "Order Update",
        body: "Your order #{orderNo} is {status}",
      },
    ]);
  if (!localStorage.getItem(K_CAMP)) write(K_CAMP, []);
  if (!localStorage.getItem(K_LEGAL))
    write(K_LEGAL, { terms: "<h2>Terms</h2>", privacy: "<h2>Privacy</h2>" });
  if (!localStorage.getItem(K_SUPPORT))
    write(K_SUPPORT, {
      email: "support@french-eyes.com",
      phone: "+49 123 456",
      hours: "10:00–22:00",
    });
}
seed();

export async function getBrand() {
  await sleep();
  return read(K_BRAND, {});
}
export async function saveBrand(payload) {
  await sleep();
  write(K_BRAND, payload);
  return { ok: true };
}

export async function listTemplates() {
  await sleep();
  return read(K_TPL, []);
}
export async function upsertTemplate(t) {
  await sleep();
  const rows = read(K_TPL, []);
  if (!t.id) {
    rows.push({ ...t, id: uid("t_") });
  } else {
    const i = rows.findIndex((x) => x.id === t.id);
    rows[i] = { ...rows[i], ...t };
  }
  write(K_TPL, rows);
  return { ok: true };
}
export async function deleteTemplate(id) {
  await sleep();
  write(
    K_TPL,
    read(K_TPL, []).filter((x) => x.id !== id)
  );
  return { ok: true };
}

export async function listCampaigns() {
  await sleep();
  return read(K_CAMP, []);
}
export async function upsertCampaign(c) {
  await sleep();
  const rows = read(K_CAMP, []);
  if (!c.id) {
    rows.push({ ...c, id: uid("c_"), createdAt: Date.now() });
  } else {
    const i = rows.findIndex((x) => x.id === c.id);
    rows[i] = { ...rows[i], ...c };
  }
  write(K_CAMP, rows);
  return { ok: true };
}
export async function deleteCampaign(id) {
  await sleep();
  write(
    K_CAMP,
    read(K_CAMP, []).filter((x) => x.id !== id)
  );
  return { ok: true };
}

export async function getLegal() {
  await sleep();
  return read(K_LEGAL, { terms: "", privacy: "" });
}
export async function saveLegal(v) {
  await sleep();
  write(K_LEGAL, v);
  return { ok: true };
}

export async function getSupport() {
  await sleep();
  return read(K_SUPPORT, { email: "", phone: "", hours: "" });
}
export async function saveSupport(v) {
  await sleep();
  write(K_SUPPORT, v);
  return { ok: true };
}
