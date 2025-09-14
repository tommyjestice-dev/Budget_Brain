import { useState } from "react";
import { createExpense } from "../pages/api";

export default function AddExpenseForm({ onAdded }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const desc = description.trim();
    const parsedAmount = parseFloat(amount);

    if (!desc || isNaN(parsedAmount)) {
      setError("Enter a valid description and amount please.");
      return;
    }

    try {
       
        const saved = await createExpense({
          name: desc,
          amount: parsedAmount,
          category,
        });
  
        onAdded?.(saved);        // refresh list in Dashboard
        setDescription("");
        setAmount("");
        setCategory("Groceries");
        console.log("Form submitted!");
      } catch (err) {
        // Keep the error simple; your helper will throw if 4xx/5xx
        const data = err?.response?.data;
        let message = "Could not save expense. Please try again.";
        if (data && typeof data === "object") {
          const firstKey = Object.keys(data)[0];
          const firstMessage = data[firstKey]?.[0];
          if (firstKey && firstMessage) message = `${firstKey}: ${firstMessage}`;
        }
        console.error("createExpense failed:", err);
        setError(message);
      }
    }

  return (
    <div className="max-w-md">
      <div className="bg-budget-off-white text-white rounded-xl p-6 shadow">
        

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              className="w-full bg-transparent border border-white/15 rounded px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-budget-purple"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              className="w-full bg-transparent border border-white/15 rounded px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-budget-purple"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full bg-white text-black border border-white/15 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-budget-purple"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            > 
              <option>Rent</option>
              <option>Utilities</option>
              <option>Gas</option>
              <option>Groceries</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}




