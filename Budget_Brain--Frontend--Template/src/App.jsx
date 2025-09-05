import { useEffect, useState } from 'react';
/*import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';*/
import ExpensesList from './ExpensesList';
import AddExpenseForm from './AddExpenseForm';
import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.withCredentials = true; 
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default function App() {


  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios.get('/api/expenses/')
      .then(response => setExpenses(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleExpenseAdded = (newExpense) => {
    setExpenses(prev => [...prev, newExpense]);
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}/`, { 
        withCredentials: true,
    });
    setExpenses((prev) => prev.filter(exp => exp.id !== id));
  } catch (err) {
    console.error('Delete Failed:', err);
    
  }
};
const handleUpdateExpense = async (id, partial) => {
  try {
    const res = await axios.patch(`/api/expenses/${id}/`, partial,             
      {withCredentials: true}
    );
    const updated = res.data;
    setExpenses(prev => prev.map(e =>(e.id ===id ? updated : e)))
    return updated;
   }catch (err) {
    console.error('Update Failed:', err);
    throw err;
    }
    
  };
<<<<<<< HEAD
  return (
  <div className="p-8 space-y-6"> 

  <div className='min-h-screen bg-budget-navy text-white font-sans'> 
    <h1 className='text-white font-brand-serif text-4xl mb-4'>
      <span className='text-budget-purple'>Budget</span> {" "}
      <span className='text-budget-orange'>Brain</span>
      </h1>
      <div className="card card--brand mb-6">
        <h2 className="card-title">Expenses</h2>
        <p className="text-slate-300 font-brand-sans"> Track, edit, and analyze your spending. </p>
        </div>

  <AddExpenseForm onExpenseAdded={handleExpenseAdded}/>
  <div className="card card--muted mt-6">
  <h3 className="text-slate-300 font-brand-sans">Categories</h3>
  <p className="text-slate-300 font-brand-sans">This week</p>
  <div className="text-slate-300 font-brand-sans">Groceries, Gas, Utilities</div>
</div>

<div className="card card--outline mt-6">
  <h3 className="card-title">Quick number figures</h3>
  </div>
  <ExpensesList 
        expenses={expenses}
        onDelete={handleDeleteExpense}
        onUpdate={handleUpdateExpense} 
        />
    </div>
     </div>
  );
}


=======


  return (
    <div className='container py-4'>
      <h1>Budget Brain</h1>
      <AddExpenseForm onExpenseAdded={handleExpenseAdded}/>
      <ExpensesList expenses={expenses} onDelete={handleDeleteExpense} />
    </div>
            );



          }


export default App;
>>>>>>> 2879a069ec6e3b04768499ac30c8afe002e06969
