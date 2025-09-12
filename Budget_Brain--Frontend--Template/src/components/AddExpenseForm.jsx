import { useState} from 'react';
import axios from 'axios';
export default function AddExpenseForm({ onExpenseAdded }) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Groceries');
    const [error, setError] = useState('');
    
    async function handleSubmit (e) {
        e.preventDefault();
        setError('');

        const desc = description.trim();
        const parsedAmount = parseFloat(amount);
    
        if (!description || isNaN(parsedAmount)) {
        setError("Enter a valid description and amount please.");
        return;
    }

        const payload = {
        description: description.trim(),
        amount: parsedAmount,
        category,
    };

        try {
            const res = await axios.post('/api/expenses/', payload, 
                { headers:{'Content-Type':'application/json'} });
   
    
            const saved = res.data ?? payload;
            onExpenseAdded?.(res.data);

            setDescription('');
            setAmount('');
            setCategory("Groceries");
            console.log('Form submitted!');
    }   
           catch (err) {
            const data = err.response?.data;
            let message = 'Could not save expense. Please try again.';
            if (data && typeof data === 'object') {
                const firstKey = Object.keys(data)[0];
                const firstMessage = data[firstKey][0];
                message = `${firstKey}: ${firstMessage}`;
                
            }
            console.error('AXIOS ERROR:', err.response?.data || err.message || err);
            setError(message);
    }
};
        

        
           
    

    return (
        <div className='max-w-md mx-auto mt-8'>
            <div className='bg-budget-off-white text-white rounded-xl p-6 shadow'>
                <h2 className='text-xl font-semibold mb-3'>Add New Expense</h2>
                
                {error && (<div className='bg-red-100 text-red-700 p-2 rounded mb-3'>{error}</div>)}
               
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium mb-1'>Description</label>
                         <input
                            type='text'
                            className='w-full bg-transparent border border-white/15 rounded px-3 py-2
                            text-white-placeholder-white/40
                       focus:outline-none focus:ring-2 focus:ring-budget-purple'
                            placeholder='Description'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            /> 
                         </div>
                         <div>
                         <label className='block text-sm font-medium mb-1'>Amount</label>
                         <input
                            type='number'
                            className='w-full bg-transparent border border-white/15 rounded px-3 py2
                            text-white-placeholder-white/40
                            focus:outline-none focus:ring-2 focus:ring-budget-purple'
                            placeholder='Amount'
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                            min='0'
                            step='0.01'
                         />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-1'>Category</label>
                        <select
                        className='w-full bg-white text-black border border-white/15 rounded px-3 py-2
                                   text-white-placeholder-white/40
                                   focus:outline-none focus:ring-2 focus:ring-budget-purple'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)} >
                            <option>Groceries</option>
                            <option>Gas</option>
                            <option>Utilties</option>
                            
                        </select>
                    </div>
                    <button type='submit' 
                    className='bg-budgetPurple hover:bg-budgetOrangeLight 
                    text-white font-semibold px-4 py-2 rounded shadow'>Add Expense</button>
                </form>    
                </div>
                </div>
                );
        }



