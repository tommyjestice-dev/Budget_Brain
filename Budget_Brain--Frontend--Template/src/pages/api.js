const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function createExpense(payload) {
  const res = await fetch(`${BASE_URL}/api/expenses/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Create failed: ${res.status}`);
  return res.json();
}

export async function fetchExpenses() {
    const res = await fetch(`${BASE_URL}/api/expenses/`);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json();
}
export async function deleteExpense(id) {
  const res = await fetch(`http://127.0.0.1:8000/api/expenses/${id}/`, {
    method: "DELETE",
    mode: "cors",
  });
  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(`Delete failed: ${res.status} ${text}`);
  }
  return true;
}