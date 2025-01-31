"use client";

import { addExpense } from "@/actions/actions";
import { useState, useEffect, Fragment } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { et } from "date-fns/locale";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/solid";

export default function ExpensesForm() {
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
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
            }
        }
        fetchCategories();
    }, []);

    const handleSubmit = async (formData: FormData, formElement: HTMLFormElement) => {
        setError(null);
        setSuccess(null);
    
        if (!selectedDate) {
            setError("Palun vali kuupäev!");
            return;
        }
        if (!selectedCategory) {
            setError("Palun vali kategooria!");
            return;
        }
    
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        formData.set("date", formattedDate);
        formData.set("categoryId", selectedCategory.id.toString());
    
        try {
            await addExpense(formData);
            setSuccess("Kulu edukalt lisatud!");
    
            // ✅ Reset fields only on success
            setSelectedCategory(null);
            setSelectedDate(new Date());
            formElement.reset(); // Reset text and number inputs
    
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
            onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSubmit(formData, e.currentTarget); // Pass the form element for resetting
            }}
            className="w-full mt-8 bg-gray-800 p-6 rounded-lg shadow-md"
        >
            <h2 className="text-xl font-semibold text-white mb-4">Lisa uus kulu</h2>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Pealkiri"
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#5DC9A8]"
                    required
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Kirjeldus"
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#5DC9A8]"
                />
                <input
                    type="number"
                    name="amount"
                    placeholder="Summa (€)"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#5DC9A8]"
                    required
                />
                <div>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date ?? new Date())}
                        dateFormat="dd.MM.yyyy"
                        locale={et}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-[#5DC9A8]"
                    />
                </div>
            </div>

            {/* Custom Select Dropdown for Category */}
            <div className="mt-4">
                <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                    <div className="relative mt-1">
                        <ListboxButton className="relative w-full cursor-pointer rounded-md bg-gray-700 text-white py-2 pl-4 pr-10 text-left outline-none focus:ring-2 focus:ring-[#5DC9A8]">
                            <span className="block truncate">
                                {selectedCategory ? selectedCategory.name : "Vali kategooria"}
                            </span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </ListboxButton>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {/* Actual category options */}
                                {categories.map((category) => (
                                    <ListboxOption
                                        key={category.id}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                active ? "bg-[#5DC9A8] text-gray-900" : "text-white"
                                            }`
                                        }
                                        value={category}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${
                                                        selected ? "font-medium" : "font-normal"
                                                    }`}
                                                >
                                                    {category.name}
                                                </span>
                                                {selected && (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </Transition>
                    </div>
                </Listbox>
            </div>

            <button
                type="submit"
                className="w-full bg-[#EF4444] text-white font-bold py-2 mt-4 rounded-md hover:bg-[#DC2626] transition"
            >
                Lisa kulu
            </button>
        </form>
    );
}