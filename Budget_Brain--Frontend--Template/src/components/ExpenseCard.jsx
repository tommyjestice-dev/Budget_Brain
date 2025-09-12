function ExpenseSummaryCard({ category, spending, total, active }) {
    return (
      <div
        className={`rounded-lg p-4 shadow-md ${
          active ? "bg-white text-gray-900" : "bg-gray-100 text-gray-700"
        }`}
      >
        <h3 className="text-lg font-semibold">{category}</h3>
        <p className="text-sm">Spending: ${spending}</p>
        <p className="text-xl font-bold">${total}</p>
      </div>
      
    );
  }
  