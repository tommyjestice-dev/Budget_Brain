import React, { useState } from 'react';
import axios from 'axios';
function AddExpenseForm({onExpenseAdded}) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!description.trim()) {
            setError('Description Box must have description in the field box.');
            return;
        }
        if (!amount || isNaN(amount) || Number(amount) <=0) {
            setError('Amount must be a positive number.');
            return;
        }
        console.log('Form submitted!');
        const newExpense = {
            description,
            amount: parseFloat(amount),
            category: "General",
            user: 1
        };
        try {
            console.log('Sending data:', newExpense);
            const response = await axios.post('http://127.0.0.1:8000/api/expenses/', newExpense);
            console.log('POST response:', response.data);
            onExpenseAdded(response.data);
            setDescription('');
            setAmount('');
        }  catch (error) {
            if (error.response && error.response.data) {
                setError('Server error: ' + JSON.stringify(error.reponse.data));     
            }  else {
                setError('Failed to add expense. Try again. ');
            }
              
            }
    };

    return (
         <form onSubmit={handleSubmit} className="p-4 rounded shadow bg-white" style={{ maxWidth: 400, margin: '2rem auto'}}>
            <h2 className="mb-4 text-center">Add</h2>
              {error && <div className='alert alert-danger'>{error}</div>}
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
                <label className='form-label'>Amount</label>
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
            );
}
export default AddExpenseForm;
