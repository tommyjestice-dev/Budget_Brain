import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import ExpensesList from './ExpensesList';
import AddExpenseForm from './AddExpenseForm';
import axios from 'axios';

function App() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/expenses/')
      .then(response => setExpenses(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleExpenseAdded = (newExpense) => {
    setExpenses(prev => [...prev, newExpense]);
  };
 
 return ( <div>
    <h1>Budget Brain</h1>
    <AddExpenseForm onExpenseAdded={handleExpenseAdded}/>
    <ExpensesList expenses={expenses} />
    </div>
  );

  
}

export default App;
