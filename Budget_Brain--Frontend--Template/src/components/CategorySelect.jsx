import React from "react";

const CATEGORIES = ["Rent", "Utilities", "Gas", "Groceries"];

export default function CategorySelect({ value, onChange, id = "category" }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm mb-1 text-gray-300">
        Category
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-white/10
                   focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">Select a category…</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
