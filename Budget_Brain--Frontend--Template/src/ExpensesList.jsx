//import React, {useEffect, useState} from "react";
//import axios from 'axios';
import React from "react";

function ExpensesList( { expenses }) {
    return (
        <div className='container mt-4'>
            <div className="card p-4 bg-white text-dark shadow" style={{ maxWidth: 400, margin: "2rem auto" }}>
                <h2 className="mb-3">Expenses</h2>
                {expenses.length === 0 ? (
                    <p className="text-muted">No expenses yet.</p>
                ) : (
                <ul className='list-group'>
                    {expenses.map((exp) => (
                        <li key={exp.id} className="list-group-item d-flex justify-content-between">
                            <span>{exp.description}</span>
                            <span>
                                {(() => {
                                    const n = Number(exp.amount);
                                    return isNaN(n) ? "$0.00" : `$${n.toFixed(2)}`;
                                })()}
                            </span>
                    </li> 
                ))}
            </ul>
                )}
        </div>
    </div>
        );
    }

export default ExpensesList;