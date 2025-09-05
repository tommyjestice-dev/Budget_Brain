import React, {use, useState} from "react";
export default function ExpenseItem({expense, onDelete, onUpdate}) {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        description: expense.description ?? "",
        amount: expense.amount !== undefined && expense.amount !== null
        ? String(expense.amount) : "",

    });
    function startEdit() {
        setIsEditing(true);
        setError("");
    }
    function cancelEdit(){
        setIsEditing(false);
        setError("");
        setForm({
            description: expense.description ?? "", 
            amount:
            expense.amount !== undefined && expense.amount !== null 
            ? String(expense.amount) 
            : "",

        });
    }
    function updateField(k ,v) {
        setForm((f) => ({...f, [k]: v }));
        }
    async function saveEdit() {
        setSaving(true);
        setError("");
        try {
            const payload = {
                description: form.description,
                amount: form.amount === "" ? null : Number(form.amount),
            };
            await onUpdate(expense.id, payload);
            setIsEditing(false);
        }   catch (e) {
            setError(e?.message || "Update failed");
        }   finally {
                setSaving(false);
        }
        
    }
    if (isEditing) {
        return (
            <li className="list-group-item">
            <div className="mb-2">
                <input
                    className="form-control"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                />
        </div>
            <div className="mb-2">
                <input
                    className="form-control"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => updateField("amount", e.target.value)}
                    />
                    </div>
            <div className="d-flex gap-2">
                <button
                    className="btn btn-sm btn-primary"
                    onClick={saveEdit}
                    disabled={saving} >
                        {saving ? "Saving..." : "Save"}
                    </button>
                    <button 
                    className="btn btn-sm btn-secondary"
                    onClick={cancelEdit}
                    disabled={saving} >
                        Cancel
                    </button>
            </div>
            {error && <div className="text-danger small mt-2">{error} </div>}
            

            </li>

        )

    }

}