export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, credentials: "include" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error ?? "API error");
  }
  return res.json();
}