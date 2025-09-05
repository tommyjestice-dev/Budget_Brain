import AddExpenseForm from "../components/AddExpenseForm";
import ExpensesList from "../ExpensesList";
import ExpenseCard from "../components/ExpenseCard";
import GoalRow from "../components/GoalRow"; 
import brainLogo from "../assets/brain.png";

export default function Dashboard() {
    const expensesSummary = [
        { title: 'Groceries', total: '$0000', active: true},
        { title: 'Gas', total: '$0001' },
        { title: 'Bills', total: '$0002'},
        { title: 'Misc', total: '$0003'},
    ];

    return (
        <header className="max-w-6x1 mx-auto px-6 py-6 flex items-center justify-between">
            <h1 className="font-serif-display text-3xl">
                <span className="text-budget-purple">Budget</span>{" "}
                <span className="text-budget-orange">Brain</span>
            </h1>
            <img
                src={brainLogo}
                alt="Budget Brain Logo"
                className="h-12 w-auto"
                />
                
            <main className="max-w-6x1 mx-auto px-6 pb-12">
                <div className=" grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <section className="lg:col-span-2-card">
                        <h2 className="section-title">Add and Delete Expenses</h2>
                        <div className="mt-4">
                            <AddExpenseForm/>
                        </div>
                    </section>
                    <section className="card">
                        <h2 className="section-title">Goals</h2>
                        <div className="space-y-4 mt-4">
                            <GoalRow label ='Emergency Fund' value='8.0%' bar='w-1/12'/>
                            <GoalRow label ='Dept Repayment' value='13.0%' bar='w-1/5'/>
                            <GoalRow label ='Retirement' value='20.0%' bar='w-3/5' accent/>
                        </div>
                    </section>
                    <section className="lg:col-span-2 card">
                        <h2 className="section-title">Expenses</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            {expensesSummary.map((e) => (
                                <ExpenseCard key={e.title} title={e.title} total={e.total} active={e.active} />
                            ))}
                        </div>
                    </section>

                </div>
            </main>
        </header>
    )
}