// src/components/Dashboard.jsx  (or src/Dashboard.jsx if that's where you keep it)
import React, { useEffect, useMemo, useState } from "react";
import CategorySelect from "./CategorySelect";
import { createExpense, fetchExpenses, deleteExpense } from "../pages/api"; // adjust path if needed
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ---------- helpers ----------
const CATEGORIES = ["Rent", "Utilities", "Gas", "Groceries"];
function getMonthStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function isInMonth(isoDateStr, monthStr) {
  return isoDateStr?.slice(0, 7) === monthStr;
}

// ---------- tiny components ----------
function ExpenseSummaryCard({ category, total, active }) {
  return (
    <div className={`rounded-lg p-4 shadow-md ${active ? "bg-white text-gray-900" : "bg-gray-100 text-gray-700"}`}>
      <h3 className="text-lg font-semibold">{category}</h3>
      <p className="text-xl font-bold">${(total ?? 0).toFixed(2)}</p>
    </div>
  );
}

function GoalCard({ label, value, percent, color }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>${value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ChatCard({ userMessage, response }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md text-gray-900">
      <div className="flex items-start mb-2">
        <img src="https://via.placeholder.com/40" alt="user" className="rounded-full mr-3" />
        <p className="text-sm">{userMessage}</p>
      </div>
      <p className="text-sm text-gray-700">{response}</p>
    </div>
  );
}

function ExpenseList({ items, onDelete }) {
  if (!items?.length) return <p className="text-gray-400 text-sm">No expenses this month.</p>;
  return (
    <ul className="divide-y divide-white/10">
      {items.map((e) => (
        <li key={e.id} className="py-2 flex items-center justify-between">
          <div className="text-sm">
            <div className="font-medium text-white">{e.name}</div>
            <div className="text-gray-400">${Number(e.amount).toFixed(2)} • {e.category}</div>
          </div>
          <button
            onClick={() => onDelete(e.id)}
            className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

function AddExpenseForm({ onAdded }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !amount || !category) return;
    await createExpense({ name, amount: Number(amount), category });
    setName(""); setAmount(""); setCategory("");
    onAdded?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm mb-1 text-gray-300">Item name</label>
        <input
          className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Gas stop"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1 text-gray-300">Amount</label>
          <input
            type="number" step="0.01"
            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 54.99"
          />
        </div>
        <CategorySelect value={category} onChange={setCategory} />
      </div>
      <button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded transition-colors">
        Add Expense
      </button>
    </form>
  );
}

// ---------- main ----------
export default function Dashboard() {
  const [monthStr, setMonthStr] = useState(getMonthStr());
  const [expenses, setExpenses] = useState([]);

  async function loadExpenses() {
    const data = await fetchExpenses();
    const list = Array.isArray(data) ? data : data.results || [];
    setExpenses(list.map((e) => ({ ...e, amount: typeof e.amount === "string" ? parseFloat(e.amount) : e.amount })));
  }

  useEffect(() => { loadExpenses(); }, []);

  const monthExpenses = useMemo(
    () => expenses.filter((e) => isInMonth(e.created_at, monthStr)),
    [expenses, monthStr]
  );

  const totalsByCategory = useMemo(() => {
    const base = Object.fromEntries(CATEGORIES.map((c) => [c, 0]));
    for (const e of monthExpenses) if (CATEGORIES.includes(e.category)) base[e.category] += Number(e.amount || 0);
    return base;
  }, [monthExpenses]);

  const monthTotal = useMemo(
    () => monthExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [monthExpenses]
  );

  const chartData = useMemo(
    () => CATEGORIES.map((c) => ({ name: c, value: totalsByCategory[c] || 0 })),
    [totalsByCategory]
  );

  async function handleDelete(id) {
    const prev = expenses;
    setExpenses((curr) => curr.filter((e) => e.id !== id));
    try { await deleteExpense(id); }
    catch (err) { console.error(err); alert("Delete failed: " + err.message); setExpenses(prev); }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          <span className="text-purple-400">Budget</span>{" "}
          <span className="text-orange-400">Brain</span>
        </h1>
        <input
          type="month"
          className="bg-gray-800 text-white rounded px-3 py-2 border border-white/10"
          value={monthStr}
          onChange={(e) => setMonthStr(e.target.value)}
        />
      </div>

      {/* Top: Add + Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
          <AddExpenseForm onAdded={loadExpenses} />
        </div>
        <div className="bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Goals</h2>
          <GoalCard label="Save for Vacation" value={540} percent={54} color="bg-purple-500" />
          <GoalCard label="Emergency Fund" value={75} percent={7.5} color="bg-gray-400" />
          <GoalCard label="Debt Repayment" value={130} percent={13} color="bg-red-500" />
        </div>
      </div>

      {/* Bottom: Expenses + Chat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Expenses</h2>

          {/* Summary tiles */}
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((c, i) => (
              <ExpenseSummaryCard key={c} category={c} total={totalsByCategory[c]} active={i === 0} />
            ))}
          </div>

          {/* Category bar chart */}
          <div className="mt-6 bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">By Category</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#cbd5e1" />
                  <YAxis stroke="#cbd5e1" />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* This Month's Expenses list */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">This Month's Expenses</h3>
            <ExpenseList items={monthExpenses} onDelete={handleDelete} />
          </div>
        </div>

        <ChatCard
          userMessage="Would a $500 handbag fit in my budget?"
          response={`You've spent $${monthTotal.toFixed(2)} in ${monthStr}. A $500 purchase would impact short-term goals. Proceed?`}
        />
      </div>
    </div>
  );
}
