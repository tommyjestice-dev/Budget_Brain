function GoalCard({ label, value, percent, color }) {
    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>{label}</span>
          <span>${value}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${color}`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    );
  }
  