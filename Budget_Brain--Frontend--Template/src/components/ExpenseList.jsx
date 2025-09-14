export default function ExpenseList({ items, onDelete }) {
  if (!items?.length) {
    return <p className="text-gray-400 text-sm">No expenses this month.</p>;
  }

  return (
    <ul className="divide-y divide-white/10">
      {items.map((e) => (
        <li key={e.id} className="py-2 flex items-center justify-between">
          <div className="text-sm">
            <div className="font-medium text-white">{e.name}</div>
            <div className="text-gray-400">
              ${Number(e.amount).toFixed(2)} • {e.category}
            </div>
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
