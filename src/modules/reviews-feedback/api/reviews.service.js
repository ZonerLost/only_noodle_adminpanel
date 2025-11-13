const K_REV = "reviews.v1";
const sleep = (ms = 150) => new Promise((r) => setTimeout(r, ms));
const uid = (p = "") => `${p}${Math.random().toString(36).slice(2, 9)}`;

function seed() {
  if (!localStorage.getItem(K_REV)) {
    localStorage.setItem(
      K_REV,
      JSON.stringify([
        {
          id: uid("rv_"),
          orderNo: "FE-1001",
          name: "Luc",
          rating: 5,
          comment: "Great!",
          reply: null,
          createdAt: Date.now() - 86400e3,
        },
        {
          id: uid("rv_"),
          orderNo: "FE-1002",
          name: "Mila",
          rating: 3,
          comment: "Okay-ish",
          reply: null,
          createdAt: Date.now() - 3600e3,
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

export async function listReviews({ q = "", rating } = {}) {
  await sleep();
  let rows = read(K_REV, []);
  if (rating) rows = rows.filter((r) => r.rating === Number(rating));
  if (q) {
    const qq = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.orderNo.toLowerCase().includes(qq) ||
        r.name.toLowerCase().includes(qq) ||
        (r.comment || "").toLowerCase().includes(qq)
    );
  }
  rows.sort((a, b) => b.createdAt - a.createdAt);
  return rows;
}

export async function replyReview(id, text) {
  await sleep();
  const rows = read(K_REV, []);
  const i = rows.findIndex((r) => r.id === id);
  if (i !== -1) {
    rows[i].reply = { text, at: Date.now() };
    write(K_REV, rows);
  }
  return { ok: true };
}

export async function deleteReview(id) {
  await sleep();
  write(
    K_REV,
    read(K_REV, []).filter((r) => r.id !== id)
  );
  return { ok: true };
}
