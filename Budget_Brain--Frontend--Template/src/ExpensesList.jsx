//import React, {useEffect, useState} from "react";
//import axios from 'axios';
import React from "react";

function ExpensesList( { expenses }) {
    return (
        <div className='container mt-4'>
            <h2>Expenses</h2>
            <ul className='list-group'>
                {expenses.map(exp => (
                    <li key={exp.id}>
                        {exp.description}: ${exp.amount}
                    </li> 
                ))}
            </ul>
        </div>
    );
    }

export default ExpensesList;