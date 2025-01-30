"use client";

import { addExpense } from "@/actions/actions";
import { useState, useEffect } from "react";

export default function ExpensesForm() {
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch("/api/expense-categories");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                
                if (!Array.isArray(data)) {
                    throw new Error("Invalid data format");
                }

                setCategories(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    return (
        <form action={addExpense} className="w-full mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-white mb-4">Lisa uus kulu</h2>

            <input
                type="text"
                name="title"
                placeholder="Pealkiri"
                className="w-full px-4 py-2 mb-3 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#5DC9A8]"
                required
            />

            <input
                type="text"
                name="description"
                placeholder="Kirjeldus"
                className="w-full px-4 py-2 mb-3 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#5DC9A8]"
            />

            <input
                type="number"
                name="amount"
                placeholder="Summa (€)"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 mb-3 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#5DC9A8]"
                required
            />

            {/* Category Dropdown with Loading & Error Handling */}
            <div className="mb-3">
                {loading ? (
                    <p className="text-gray-400 text-sm">Laadimine...</p>
                ) : error ? (
                    <p className="text-red-400 text-sm">{error}</p>
                ) : (
                    <select
                        name="categoryId"
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#5DC9A8]"
                        required
                    >
                        <option value="">Vali kategooria</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-[#5DC9A8] text-black font-bold py-2 mt-3 rounded-md hover:bg-[#4cb292] transition"
            >
                Lisa kulu
            </button>
        </form>
    );
}