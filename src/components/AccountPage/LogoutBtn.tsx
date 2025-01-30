"use client";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

export default function LogoutBtn() {
    return (
        <LogoutLink className="group flex justify-center items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 font-medium rounded-lg hover:bg-gray-600 transition">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24"
                className="fill-[#5DC9A8] group-hover:fill-white transition-colors duration-200"
            >
                <path d="M5 22a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3h-2V4H6v16h12v-2h2v3a1 1 0 0 1-1 1zm13-6v-3h-7v-2h7V8l5 4z"/>
            </svg>
            Logi välja
        </LogoutLink>
    );
}