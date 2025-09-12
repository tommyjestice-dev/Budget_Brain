import React from "react";
import ExpenseItem from "./ExpenseItem";

function ExpensesList({ expenses, onDelete, onUpdate }) {
  
  console.log("ExpensesList render, count:", expenses.length);

  return (
    <div className="container mt-4">
      <div
        className="card p-4 bg-white text-dark shadow"
        style={{ maxWidth: 400, margin: "2rem auto" }}
      >
        <h2 className="mb-3" >Expenses</h2>

        {expenses.length === 0 ? (
          <p className="text-muted">No expenses yet.</p>
        ) : (
          <ul className="list-group">
            {expenses.map((exp) => (
              <ExpenseItem
                key={exp.id}
                expense={exp}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))}
          </ul>
        )}
      </div>
     
    </div>
  );
}

export default ExpensesList;
