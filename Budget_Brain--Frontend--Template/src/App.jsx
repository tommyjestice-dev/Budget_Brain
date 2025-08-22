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

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/expenses/${id}/`, { 
        withCredentials: true,
    });
    setExpenses((prev) => prev.filter(exp => exp.id !== id));
  } catch (err) {
    console.error('Delete Failed:', err);
    
  }
};
const handleUpdateExpense = async (id, partial) => {
  try {
    const res = await axios.patch(`http://127.0.0.1:8000/api/expenses/${id}/`, partial,             
      {withCredentials: true /*check this later in case of bug*/}
    );
    const updated = res.data;
    setExpenses(prev => prev.map(e =>(e.id ===id ? updated : e)))
    return updated;
    } catch (err) {
      console.error('Update Failed:', err);
      throw err;
    }
    
  };


  return (
    <div className='container py-4'>
      <h1>Budget Brain</h1>
      <AddExpenseForm onExpenseAdded={handleExpenseAdded}/>
      <ExpensesList expenses={expenses} onDelete={handleDeleteExpense} />
    </div>
            );



          }


export default App;
