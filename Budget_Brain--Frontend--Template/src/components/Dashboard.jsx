import React, { useEffect, useMemo, useState } from "react";
import { createExpense, fetchExpenses, deleteExpense } from "../pages/api";
import AddExpenseForm from "./AddExpenseForm";
import ExpenseList from "./ExpenseList";
import BrainChat from "./BrainChat";
import ByCategoryChart from "./ByCategoryChart";
import { ErrorBoundary } from "./Safe";

const CATEGORIES = ["Rent", "Utilities", "Gas", "Groceries"];

function formatFullDate(d = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeZone: "America/Chicago",
  }).format(d);
}
function getMonthStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function isInMonth(isoDateStr, monthStr) {
  return isoDateStr?.slice(0, 7) === monthStr;
}

// ✅ Define HookProbe OUTSIDE JSX (either here or at top of Dashboard, before return)
function HookProbe() {
  const r = React.useRef(null);
  return <div data-probe ref={r}>Category</div>;
}

function ExpenseSummaryCard({ category, total, active }) {
  return (
    <div className={`rounded-lg p-4 shadow-md ${active ? "bg-white text-gray-900" : "bg-gray-100 text-gray-700"}`}>
      <h3 className="text-lg font-semibold">{category}</h3>
      <p className="text-xl font-bold">${(total ?? 0).toFixed(2)}</p>
    </div>
  );
}

export default function Dashboard() {
  console.log("React version (Dashboard):", React.version);

  const [monthStr, setMonthStr] = useState(getMonthStr());
  const [expenses, setExpenses] = useState([]);
  const todayFull = useMemo(() => formatFullDate(), []);

  async function loadExpenses() {
    try {
      const data = await fetchExpenses();
      const list = Array.isArray(data) ? data : data?.results || [];
      setExpenses(
        list.map((e) => ({
          ...e,
          amount: typeof e.amount === "string" ? parseFloat(e.amount) : e.amount,
        }))
      );
    } catch (err) {
      console.error("fetchExpenses failed:", err);
      setExpenses([]);
    }
  }

  useEffect(() => { loadExpenses(); }, []);

  const monthExpenses = useMemo(
    () => expenses.filter((e) => isInMonth(e.created_at, monthStr)),
    [expenses, monthStr]
  );

  const totalsByCategory = useMemo(() => {
    const base = Object.fromEntries(CATEGORIES.map((c) => [c, 0]));
    for (const e of monthExpenses) {
      if (CATEGORIES.includes(e.category)) {
        base[e.category] += Number(e.amount || 0);
      }
    }
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
    catch (err) {
      console.error(err);
      alert("Delete failed: " + err.message);
      setExpenses(prev);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          <span className="text-purple-400">Budget</span>{" "}
          <span className="text-orange-400">Brain</span>
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300">{todayFull}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg p-6 shadow-md flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-center">Add an Expense</h2>
          <AddExpenseForm onAdded={loadExpenses} />
        </div>
        <div className="bg-gray-800 rounded-lg p-6 shadow-md">
          <BrainChat />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Expenses</h2>

          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((c, i) => (
              <ExpenseSummaryCard
                key={c}
                category={c}
                total={totalsByCategory[c]}
                active={i === 0}
              />
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">This Month's Expenses</h3>
            {/* ✅ monthExpenses is in scope here */}
            <ExpenseList items={monthExpenses} onDelete={handleDelete} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-md">
          <ErrorBoundary>
            {/* ✅ HookProbe rendered safely */}
            <HookProbe />
            <div className="w-full h-72">
              <ByCategoryChart chartData={chartData} />
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
