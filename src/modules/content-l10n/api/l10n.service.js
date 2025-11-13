const K_LOCALES = "l10n.locales.v1";
const K_STRINGS = "l10n.strings.v1"; // [{key, values:{en,de,fr}}]
const K_PAGES = "l10n.pages.v1"; // [{id, slug, values:{en,de,fr}}]

const sleep = (ms = 180) => new Promise((r) => setTimeout(r, ms));
const uid = (p = "") => `${p}${Math.random().toString(36).slice(2, 9)}`;

function seed() {
  if (!localStorage.getItem(K_LOCALES))
    localStorage.setItem(K_LOCALES, JSON.stringify(["en", "de", "fr"]));
  if (!localStorage.getItem(K_STRINGS)) {
    localStorage.setItem(
      K_STRINGS,
      JSON.stringify([
        {
          key: "app.title",
          values: { en: "French Eyes", de: "French Eyes", fr: "French Eyes" },
        },
        {
          key: "checkout.pay",
          values: {
            en: "Pay now",
            de: "Jetzt bezahlen",
            fr: "Payer maintenant",
          },
        },
      ])
    );
  }
  if (!localStorage.getItem(K_PAGES)) {
    localStorage.setItem(
      K_PAGES,
      JSON.stringify([
        {
          id: uid("pg_"),
          slug: "terms",
          values: {
            en: "<h2>Terms</h2>",
            de: "<h2>Bedingungen</h2>",
            fr: "<h2>Conditions</h2>",
          },
        },
        {
          id: uid("pg_"),
          slug: "privacy",
          values: {
            en: "<h2>Privacy</h2>",
            de: "<h2>Datenschutz</h2>",
            fr: "<h2>Confidentialité</h2>",
          },
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

export async function getLocales() {
  await sleep();
  return read(K_LOCALES, ["en", "de", "fr"]);
}

export async function listStrings({ q = "", page = 1, pageSize = 20 } = {}) {
  await sleep();
  let rows = read(K_STRINGS, []);
  if (q) {
    const qq = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.key.toLowerCase().includes(qq) ||
        Object.values(r.values || {})
          .join("|")
          .toLowerCase()
          .includes(qq)
    );
  }
  const total = rows.length;
  const data = rows
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
  return {
    data,
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function upsertString(key, values) {
  await sleep();
  const rows = read(K_STRINGS, []);
  const i = rows.findIndex((r) => r.key === key);
  if (i === -1) rows.push({ key, values });
  else rows[i] = { key, values };
  write(K_STRINGS, rows);
  return { ok: true };
}

export async function deleteString(key) {
  await sleep();
  write(
    K_STRINGS,
    read(K_STRINGS, []).filter((r) => r.key !== key)
  );
  return { ok: true };
}

export async function listPages({ q = "" } = {}) {
  await sleep();
  let rows = read(K_PAGES, []);
  if (q) {
    const qq = q.toLowerCase();
    rows = rows.filter((p) => p.slug.toLowerCase().includes(qq));
  }
  rows.sort((a, b) => a.slug.localeCompare(b.slug));
  return rows;
}

export async function upsertPage({ id, slug, values }) {
  await sleep();
  if (!slug) throw new Error("slug is required");
  const rows = read(K_PAGES, []);
  if (!id) {
    const row = { id: uid("pg_"), slug, values };
    rows.push(row);
  } else {
    const i = rows.findIndex((r) => r.id === id);
    if (i === -1) throw new Error("page not found");
    rows[i] = { ...rows[i], slug, values };
  }
  write(K_PAGES, rows);
  return { ok: true };
}

export async function deletePage(id) {
  await sleep();
  write(
    K_PAGES,
    read(K_PAGES, []).filter((r) => r.id !== id)
  );
  return { ok: true };
}
