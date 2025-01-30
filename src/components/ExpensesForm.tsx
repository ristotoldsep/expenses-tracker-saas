"use client";

import { addExpense } from "@/actions/actions";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

export default function ExpensesForm() {
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Get today's date
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

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
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        setSuccess(null);

        if (!selectedDate) {
            setError("Palun vali kuupäev!");
            return;
        }

        // Format date to YYYY-MM-DD before submitting
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        formData.set("date", formattedDate);

        try {
            await addExpense(formData);
            setSuccess("Kulu edukalt lisatud!");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Midagi läks valesti!");
            }
        }
    };

    return (
        <form
            action={handleSubmit}
            className="w-full mt-8 bg-gray-800 p-6 rounded-lg shadow-md"
        >
            <h2 className="text-xl font-semibold text-white mb-4">Lisa uus kulu</h2>

            {/* Success/Error Messages */}
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

            {/* Title Input */}
            <input
                type="text"
                name="title"
                placeholder="Pealkiri"
                className="w-full px-4 py-2 mb-3 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#5DC9A8]"
                required
            />

            {/* Description Input */}
            <input
                type="text"
                name="description"
                placeholder="Kirjeldus"
                className="w-full px-4 py-2 mb-3 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#5DC9A8]"
            />

            {/* Amount Input */}
            <input
                type="number"
                name="amount"
                placeholder="Summa (€)"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 mb-3 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#5DC9A8]"
                required
            />

            {/* Date Picker (Fixed Type Issue) */}
            <div className="mb-3">
                <p className="text-white mb-2">Vali kuupäev:</p>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date ?? new Date())} // Fixes the error
                    dateFormat="yyyy-MM-dd"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-[#5DC9A8]"
                />
            </div>

            {/* Category Dropdown */}
            <div className="mb-3">
                {loading ? (
                    <p className="text-gray-400 text-sm">Laadimine...</p>
                ) : error ? (
                    <p className="text-red-400 text-sm">{error}</p>
                ) : (
                    <select
                        name="categoryId"
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-white outline-none focus:ring-2 focus:ring-[#5DC9A8]"
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

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-[#EF4444] text-white font-bold py-2 mt-3 rounded-md hover:bg-[#DC2626] transition"
            >
                Lisa kulu
            </button>
        </form>
    );
}