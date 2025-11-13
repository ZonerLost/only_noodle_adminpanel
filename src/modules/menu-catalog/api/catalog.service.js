const K_CAT = "catalog.categories.v1";
const K_PROD = "catalog.products.v1";

const sleep = (ms = 180) => new Promise((r) => setTimeout(r, ms));
const uid = (p = "") => `${p}${Math.random().toString(36).slice(2, 9)}`;

function seed() {
  if (!localStorage.getItem(K_CAT)) {
    const c = [
      { id: uid("c_"), name: "Burgers", description: "", sort: 1 },
      { id: uid("c_"), name: "Fries", description: "", sort: 2 },
      { id: uid("c_"), name: "Drinks", description: "", sort: 3 },
    ];
    localStorage.setItem(K_CAT, JSON.stringify(c));
  }
  if (!localStorage.getItem(K_PROD)) {
    const cats = JSON.parse(localStorage.getItem(K_CAT) || "[]");
    const burgers = cats.find((c) => c.name === "Burgers")?.id;
    const drinks = cats.find((c) => c.name === "Drinks")?.id;
    localStorage.setItem(
      K_PROD,
      JSON.stringify([
        {
          id: uid("p_"),
          name: "Classic Burger",
          categoryId: burgers,
          price: 8.9,
          active: true,
          options: [],
        },
        {
          id: uid("p_"),
          name: "Cola 0.5l",
          categoryId: drinks,
          price: 2.9,
          active: true,
          options: [
            {
              name: "Size",
              choices: [
                { label: "0.33l", delta: -0.5 },
                { label: "0.5l", delta: 0 },
              ],
            },
          ],
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

export async function listCategories({ q = "", page = 1, pageSize = 50 } = {}) {
  await sleep();
  let rows = read(K_CAT, []);
  if (q) {
    const qq = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(qq));
  }
  rows.sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name));
  const total = rows.length;
  const data = rows.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize
  );
  return {
    data,
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
export async function createCategory({ name, description = "", sort = 999 }) {
  await sleep();
  const rows = read(K_CAT, []);
  const row = { id: uid("c_"), name, description, sort: Number(sort) || 999 };
  rows.push(row);
  write(K_CAT, rows);
  return row;
}
export async function updateCategory(id, patch) {
  await sleep();
  const rows = read(K_CAT, []);
  const i = rows.findIndex((r) => r.id === id);
  if (i === -1) throw new Error("not found");
  rows[i] = { ...rows[i], ...patch };
  write(K_CAT, rows);
  return rows[i];
}
export async function deleteCategory(id) {
  await sleep();
  write(
    K_CAT,
    read(K_CAT, []).filter((r) => r.id !== id)
  );
  write(
    K_PROD,
    read(K_PROD, []).filter((p) => p.categoryId !== id)
  );
  return { ok: true };
}

export async function listProducts({
  q = "",
  categoryId,
  page = 1,
  pageSize = 20,
} = {}) {
  await sleep();
  let rows = read(K_PROD, []);
  if (categoryId) rows = rows.filter((p) => p.categoryId === categoryId);
  if (q) {
    const qq = q.toLowerCase();
    rows = rows.filter((p) => p.name.toLowerCase().includes(qq));
  }
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
export async function createProduct(input) {
  await sleep();
  const rows = read(K_PROD, []);
  const row = {
    id: uid("p_"),
    active: true,
    options: [],
    ...input,
    price: Number(input.price) || 0,
  };
  rows.push(row);
  write(K_PROD, rows);
  return row;
}
export async function updateProduct(id, patch) {
  await sleep();
  const rows = read(K_PROD, []);
  const i = rows.findIndex((r) => r.id === id);
  if (i === -1) throw new Error("not found");
  rows[i] = {
    ...rows[i],
    ...patch,
    price: patch.price != null ? Number(patch.price) || 0 : rows[i].price,
  };
  write(K_PROD, rows);
  return rows[i];
}
export async function deleteProduct(id) {
  await sleep();
  write(
    K_PROD,
    read(K_PROD, []).filter((r) => r.id !== id)
  );
  return { ok: true };
}
export async function toggleAvailability(id, active) {
  await sleep();
  const rows = read(K_PROD, []);
  const i = rows.findIndex((r) => r.id === id);
  if (i !== -1) {
    rows[i].active = !!active;
    write(K_PROD, rows);
  }
  return { ok: true };
}
