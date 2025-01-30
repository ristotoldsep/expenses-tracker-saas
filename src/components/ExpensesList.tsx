"use client";

import { deleteExpense } from "@/actions/actions";
import { useState } from "react";

type Expense = {
    id: number;
    title: string;
    description: string | null;
    amount: number;
    creatorId: string;
    category?: { name: string }; // Updated to include category name
    createdAt: Date;
    updatedAt: Date;
};

type ExpensesListProps = {
    expenses: Expense[];
};

export default function ExpensesList({ expenses }: ExpensesListProps) {
    const [loading, setLoading] = useState<number | null>(null);

    console.log(expenses);

    return (
        <ul className="w-full bg-gray-800 rounded-lg shadow-md divide-y divide-gray-700 overflow-hidden">
            {expenses.length > 0 ? (
                expenses.map((expense) => (
                    <li
                        key={expense.id}
                        className="flex items-center px-4 py-3 text-white hover:bg-gray-700 transition"
                    >
                        {/* Expense Title & Category */}
                        <div>
                            <p className="font-semibold">{expense.title}</p>
                            <p className="text-sm text-gray-400">
                                {expense.category?.name || "Määramata kategooria"}
                            </p>
                        </div>

                        {/* Description */}
                        {expense.description && (
                            <p className="ml-6 text-sm text-gray-300 hidden sm:block max-w-[250px] break-words">
                                {expense.description}
                            </p>
                        )}

                        {/* Amount & Date */}
                        <div className="ml-auto text-right">
                            <p className="font-bold text-red-400">
                                €{expense.amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-400">
                                {new Date(expense.createdAt).toLocaleDateString("et-EE")}
                            </p>
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={async () => {
                                setLoading(expense.id);
                                await deleteExpense(expense.id);
                                setLoading(null);
                            }}
                            disabled={loading === expense.id}
                            className={`ml-3 text-xs h-[20px] w-[20px] flex items-center justify-center rounded-full transition ${
                                loading === expense.id
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-red-500 hover:bg-red-600"
                            }`}
                        >
                            {loading === expense.id ? (
                                "⌛"
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#ffffff"
                                    strokeLinecap="round"
                                    strokeWidth="1.5"
                                    >
                                    <path d="M8.464 15.535l7.072-7.07M8.464 8.465l7.072 7.07" />
                                </svg>
                            )}
                        </button>
                    </li>
                ))
            ) : (
                <li className="text-center py-4 text-gray-400">Kulutusi pole lisatud</li>
            )}
        </ul>
    );
}