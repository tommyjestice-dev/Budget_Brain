import React, {useEffect, useState} from "react";
import axios from 'axios';

function ExpensesList() {
    const [expenses, setExpenses] =useState([])
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/expenses/')
        .then(response => setExpenses(response.data))
        .catch(error => console.error(error));
    }, []);



 

return (
    <div>
        <h2>Expenses</h2>
        <ul>
            {expenses.map(exp => (
                <li key={exp.id}>
                    {exp.description}: ${exp.amount}
                </li> 
            ))}
        </ul>
    </div>
);
}
export default ExpensesList