import { useState} from 'react';
import axios from 'axios';
function AddExpenseForm({ onExpenseAdded }) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        console.log('Submit Fired');
        setError('');

    const parsedAmount = parseFloat(amount);
    
    if (!description || isNaN(parsedAmount)) {
        setError("Enter a valid description and amount please.");
        return;
    }

    const payload = {
        description: description.trim(),
        amount: parsedAmount,
    };

    try {
        const res = await axios.post('http://127.0.0.1:8000/api/expenses/', payload, {
            headers: {'Content-Type': 'application/json', },
            withCredentials: true, 
    }
);
        const saved = res.data ?? payload;
        onExpenseAdded?.(saved);

        setDescription('');
        setAmount('');
        console.log('Form submitted!');
    }   catch (err) {
            const data = err.response?.data
            let message = 'Could not save expense. Please try again.';
            if (data && typeof data === 'object') {
                const firstKey = Object.keys(data)[0];
                const firstMessage = data[firstKey][0];
                message = `${firstKey}: ${firstMessage}`;
                
            }
        console.error('AXIOS ERROR:', err.response?.data || err.message || err);
        setError(message);
    }
}
        

        
           
    

    return (
        <div className='container mt-4'>
            <div className='card p-4 bg-white text-dark shadow' style={{ maxWidth: 400, margin: "2rem auto" }}>
                <h2 className='mb-3'>Add New Expense</h2>
                {error && <div className='alert alert-danger'>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label className='form-label'>Description</label>
                         <input
                            type='text'
                            className='form-control'
                            placeholder='Description'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            /> 
                         </div>
                         <div className='mb-3'>
                         <input
                            type='number'
                            className='form-control'
                            placeholder='Amount'
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                            min='0'
                            step='0.01'
                         />
                    </div>
                    <button type='submit' className='btn btn-primary w-100'>Add Expense</button>
                </form>    
                </div>
                </div>
            );
        }

export default AddExpenseForm;
