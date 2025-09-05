import React from "react";
import ExpenseItem from "./ExpenseItem";

<<<<<<< HEAD
function ExpensesList({ expenses, onDelete, onUpdate }) {
  
  console.log("ExpensesList render, count:", expenses.length);
=======
function ExpensesList({ expenses, onDelete, onUpdate}) {
    return (
      
        <div className='container mt-4'>
            <div 
                className="card p-4 bg-white text-dark shadow" style={{ maxWidth: 400, margin: "2rem auto" }}>
                <h2 className="mb-3">Expenses</h2>
                {expenses.length === 0 ? (
                    <p className="text-muted">No expenses yet.</p>
                ) : (
                <ul className='list-group'>
                    {expenses.map((exp) => (
                        <li
                         key={exp.id} 
                         className="list-group-item d-flex justify-content-between align-items-center"
                         >
                            <div>
                            <strong>{exp.description}</strong> -{" "}
                            {(() => {
                                const n = Number(exp.amount);
                                return isNaN(n) ? "$0.00" : `$${n.toFixed(2)}`;
                                })()}
                            </div> 
                            <button
                            onClick={() => onDelete(exp.id)}
                            className="btn btn-danger btn-sm">Delete
                            
                            </button> 
                        </li>
                         ))}
                        </ul>
                )}
            </div>
        </div>
    
        );
    }
>>>>>>> 2879a069ec6e3b04768499ac30c8afe002e06969

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
