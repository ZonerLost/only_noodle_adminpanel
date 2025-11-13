export async function loginWithEmail({ email, password }) {
  await new Promise((r) => setTimeout(r, 300));
  if (!email || !password) throw new Error("Missing credentials");
  localStorage.setItem("auth.token", "demo-token");
  return { ok: true };
}
export function isAuthed() {
  return !!localStorage.getItem("auth.token");
}
