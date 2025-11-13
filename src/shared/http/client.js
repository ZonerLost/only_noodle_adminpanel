const BASE = "/api";
export async function http(path, { method = "GET", body, headers } = {}) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json", ...(headers || {}) },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(BASE + path, opts);
  if (!res.ok) throw new Error(await res.text());
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}
