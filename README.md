# Budget Brain 🧠💸
Personal finance app that lets you **track expenses**, **visualize spending**, and **ask questions about your data in plain English** via an optional Gemini-powered chatbot.

## ✨ Features
- Add, edit, delete expenses (description, amount, category, date)
- CSV upload with validation (rejects bad rows with clear error messages)
- Interactive charts (spend by **category** and **month**)
- Filter/search (category, date ranges)
- REST API (Django REST Framework)
- Optional AI Q&A: “How much did I spend on groceries last month?”

---

## 🧱 Tech Stack
**Frontend:** React (Vite), TypeScript, Tailwind CSS, Recharts  
**Backend:** Django, Django REST Framework  
**Database:** SQLite (dev)  
**AI (optional):** Google Gemini API

---

## 🚀 Quickstart (5 minutes)

### Prereqs
- Node.js 18+ and npm
- Python 3.10+ and pip

### 1) Clone
```bash
git clone https://github.com/<your-username>/Budget_Brain.git
cd Budget_Brain

## Backend Setup
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt  # (ensure DRF is in requirements)
python manage.py migrate
python manage.py runserver

## Frontend Setup (React + Vite)
cd frontend
npm install
npm run dev

##Frontend (/frontend/.env):
VITE_API_BASE_URL=http://127.0.0.1:8000

##Backend (/backend/.env or add to settings):
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash

## Project Structure
budget-brain/
├─ backend/
│  ├─ manage.py
│  ├─ requirements.txt
│  ├─ <project_name>/
│  │  ├─ settings.py        # DATABASES uses sqlite3 by default
│  └─ expenses/
│     ├─ models.py          # Expense model
│     ├─ serializers.py     # ExpenseSerializer
│     ├─ views.py           # CRUD, summary, ai/query
│     ├─ urls.py            # /api/expenses, /api/summary, /api/ai/query
│
└─ frontend/
   ├─ src/
   │  ├─ pages/
   │  │  ├─ api.ts          # createExpense, getSummary, etc.
   │  ├─ components/
   │  │  ├─ AddExpenseForm.tsx
   │  │  └─ Charts.tsx
   │  └─ main.tsx
   ├─ index.html
   └─ package.json




##API Endpoints (summary)
Method	Endpoint	Description
GET	/api/expenses/	List expenses (supports filters)
POST	/api/expenses/	Create expense (JSON body)
GET	/api/expenses/:id/	Retrieve single expense
PATCH	/api/expenses/:id/	Update expense
DELETE	/api/expenses/:id/	Delete expense
GET	/api/summary	Aggregates (e.g., by category, month)
POST	/api/ai/query	(Optional) Ask a question about spending

