// LocalStorage-backed IAM mock with CRUD + audit trail.
// Keys
const K_USERS = "iam.users.v1";
const K_DRIVERS = "iam.drivers.v1";
const K_ROLES = "iam.roles.v1";
const K_AUDIT = "iam.audit.v1";

// Small utility
const sleep = (ms = 240) => new Promise((r) => setTimeout(r, ms));
const uid = (p = "") => `${p}${Math.random().toString(36).slice(2, 10)}`;

// Seed
function seedOnce() {
  if (!localStorage.getItem(K_ROLES)) {
    localStorage.setItem(
      K_ROLES,
      JSON.stringify([
        { id: "r-admin", name: "Admin", description: "Full access" },
        {
          id: "r-manager",
          name: "Manager",
          description: "Manage menu, orders, zones",
        },
        {
          id: "r-support",
          name: "Support",
          description: "Resolve tickets & refunds",
        },
      ])
    );
  }
  if (!localStorage.getItem(K_USERS)) {
    const demo = [
      {
        id: uid("u_"),
        name: "Alice Martin",
        email: "alice@frencheyes.com",
        roleId: "r-admin",
        status: "active",
      },
      {
        id: uid("u_"),
        name: "Bob Keller",
        email: "bob@frencheyes.com",
        roleId: "r-manager",
        status: "active",
      },
      {
        id: uid("u_"),
        name: "Chloe Singh",
        email: "chloe@frencheyes.com",
        roleId: "r-support",
        status: "suspended",
      },
    ];
    localStorage.setItem(K_USERS, JSON.stringify(demo));
  }
  if (!localStorage.getItem(K_DRIVERS)) {
    const demo = [
      {
        id: uid("d_"),
        name: "Daniel Roy",
        phone: "+49170123456",
        zone: "ZIP-10115",
        status: "available",
        tipsTotal: 128.3,
      },
      {
        id: uid("d_"),
        name: "Emma Weiss",
        phone: "+49170234567",
        zone: "ZIP-10119",
        status: "on_delivery",
        tipsTotal: 93.0,
      },
      {
        id: uid("d_"),
        name: "Farid Khan",
        phone: "+49170345678",
        zone: "ZIP-10243",
        status: "offline",
        tipsTotal: 61.7,
      },
    ];
    localStorage.setItem(K_DRIVERS, JSON.stringify(demo));
  }
  if (!localStorage.getItem(K_AUDIT)) {
    localStorage.setItem(K_AUDIT, JSON.stringify([]));
  }
}
seedOnce();

// Helpers
function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}
function write(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}
function appendAudit(evt) {
  const list = read(K_AUDIT);
  const entry = { id: uid("a_"), ts: new Date().toISOString(), ...evt };
  list.unshift(entry);
  write(K_AUDIT, list);
}

// Generic list fn with search/sort/paginate
function filterSortPaginate({
  rows,
  q,
  fields = [],
  sort = "name",
  dir = "asc",
  page = 1,
  pageSize = 10,
}) {
  let out = [...rows];
  if (q) {
    const qq = q.toLowerCase();
    out = out.filter((r) =>
      fields.some((f) =>
        String(r[f] ?? "")
          .toLowerCase()
          .includes(qq)
      )
    );
  }
  out.sort((a, b) => {
    const av = (a[sort] ?? "").toString().toLowerCase();
    const bv = (b[sort] ?? "").toString().toLowerCase();
    if (av < bv) return dir === "asc" ? -1 : 1;
    if (av > bv) return dir === "asc" ? 1 : -1;
    return 0;
  });
  const total = out.length;
  const start = (page - 1) * pageSize;
  const data = out.slice(start, start + pageSize);
  return {
    data,
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

// ROLES
export async function listRoles() {
  await sleep();
  return read(K_ROLES);
}
export async function createRole({ name, description }) {
  await sleep();
  const roles = read(K_ROLES);
  const role = { id: uid("r_"), name, description: description || "" };
  roles.push(role);
  write(K_ROLES, roles);
  appendAudit({
    actor: "system",
    action: "role.create",
    entity: "role",
    entityId: role.id,
    meta: { name },
  });
  return role;
}
export async function updateRole(id, patch) {
  await sleep();
  const roles = read(K_ROLES);
  const i = roles.findIndex((r) => r.id === id);
  if (i === -1) throw new Error("Role not found");
  roles[i] = { ...roles[i], ...patch };
  write(K_ROLES, roles);
  appendAudit({
    actor: "system",
    action: "role.update",
    entity: "role",
    entityId: id,
    meta: patch,
  });
  return roles[i];
}
export async function deleteRole(id) {
  await sleep();
  write(
    K_ROLES,
    read(K_ROLES).filter((r) => r.id !== id)
  );
  appendAudit({
    actor: "system",
    action: "role.delete",
    entity: "role",
    entityId: id,
  });
  return { ok: true };
}

// USERS
export async function listUsers({
  q = "",
  sort = "name",
  dir = "asc",
  page = 1,
  pageSize = 10,
  roleId,
  status,
} = {}) {
  await sleep();
  let rows = read(K_USERS);
  if (roleId) rows = rows.filter((u) => u.roleId === roleId);
  if (status) rows = rows.filter((u) => u.status === status);
  return filterSortPaginate({
    rows,
    q,
    fields: ["name", "email"],
    sort,
    dir,
    page,
    pageSize,
  });
}
export async function createUser(input) {
  await sleep();
  const users = read(K_USERS);
  const user = { id: uid("u_"), status: "active", ...input };
  users.push(user);
  write(K_USERS, users);
  appendAudit({
    actor: "system",
    action: "user.create",
    entity: "user",
    entityId: user.id,
    meta: { email: user.email },
  });
  return user;
}
export async function updateUser(id, patch) {
  await sleep();
  const users = read(K_USERS);
  const i = users.findIndex((u) => u.id === id);
  if (i === -1) throw new Error("User not found");
  users[i] = { ...users[i], ...patch };
  write(K_USERS, users);
  appendAudit({
    actor: "system",
    action: "user.update",
    entity: "user",
    entityId: id,
    meta: patch,
  });
  return users[i];
}
export async function deleteUser(id) {
  await sleep();
  write(
    K_USERS,
    read(K_USERS).filter((u) => u.id !== id)
  );
  appendAudit({
    actor: "system",
    action: "user.delete",
    entity: "user",
    entityId: id,
  });
  return { ok: true };
}

// DRIVERS
export async function listDrivers({
  q = "",
  sort = "name",
  dir = "asc",
  page = 1,
  pageSize = 10,
  status,
  zone,
} = {}) {
  await sleep();
  let rows = read(K_DRIVERS);
  if (status) rows = rows.filter((d) => d.status === status);
  if (zone) rows = rows.filter((d) => d.zone === zone);
  return filterSortPaginate({
    rows,
    q,
    fields: ["name", "phone", "zone"],
    sort,
    dir,
    page,
    pageSize,
  });
}
export async function createDriver(input) {
  await sleep();
  const drivers = read(K_DRIVERS);
  const driver = { id: uid("d_"), status: "available", tipsTotal: 0, ...input };
  drivers.push(driver);
  write(K_DRIVERS, drivers);
  appendAudit({
    actor: "system",
    action: "driver.create",
    entity: "driver",
    entityId: driver.id,
    meta: { zone: driver.zone },
  });
  return driver;
}
export async function updateDriver(id, patch) {
  await sleep();
  const drivers = read(K_DRIVERS);
  const i = drivers.findIndex((d) => d.id === id);
  if (i === -1) throw new Error("Driver not found");
  drivers[i] = { ...drivers[i], ...patch };
  write(K_DRIVERS, drivers);
  appendAudit({
    actor: "system",
    action: "driver.update",
    entity: "driver",
    entityId: id,
    meta: patch,
  });
  return drivers[i];
}
export async function deleteDriver(id) {
  await sleep();
  write(
    K_DRIVERS,
    read(K_DRIVERS).filter((d) => d.id !== id)
  );
  appendAudit({
    actor: "system",
    action: "driver.delete",
    entity: "driver",
    entityId: id,
  });
  return { ok: true };
}

// AUDIT
export async function listAudit({ q = "", page = 1, pageSize = 20 } = {}) {
  await sleep();
  let rows = read(K_AUDIT);
  if (q) {
    const qq = q.toLowerCase();
    rows = rows.filter((r) =>
      [r.action, r.entity, r.entityId, r.actor].some((x) =>
        String(x ?? "")
          .toLowerCase()
          .includes(qq)
      )
    );
  }
  const total = rows.length;
  const start = (page - 1) * pageSize;
  const data = rows.slice(start, start + pageSize);
  return {
    data,
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
export async function clearAudit() {
  await sleep();
  write(K_AUDIT, []);
  return { ok: true };
}
