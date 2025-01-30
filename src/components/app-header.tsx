"use client";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
    {
        label: "Töölaud",
        path: "/app/dashboard",
    },
    {
        label: "Minu konto",
        path: "/app/account",
    },
];

export default function AppHeader() {
    const pathname = usePathname();

    return (
        <header className="flex items-center justify-between border-b border-white/10 py-4">
            {/* Logo */}
            <Link href="/">
                <Image
                    src="/rahavoog_logo.webp"
                    alt="Logo"
                    width={40}
                    height={40}
                    priority
                    className="cursor-pointer"
                />
            </Link>

            {/* Navigation */}
            <nav>
                <ul className="flex gap-4 text-sm">
                    {routes.map((route) => (
                        <li key={route.path}>
                            <Link
                                href={route.path}
                                className={`px-3 py-2 rounded-md transition ${
                                    route.path === pathname
                                        ? "bg-[#5DC9A8] text-black font-semibold"
                                        : "text-white/80 hover:text-white"
                                }`}
                            >
                                {route.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout Button */}
            <LogoutLink className="group flex items-center gap-2 text-white/70 text-sm hover:text-white transition" title="Logi välja">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24"
                    className="fill-[#5DC9A8] group-hover:fill-white transition-colors duration-200"
                >
                    <path d="M5 22a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3h-2V4H6v16h12v-2h2v3a1 1 0 0 1-1 1zm13-6v-3h-7v-2h7V8l5 4z"/>
                </svg>
            </LogoutLink>
        </header>
    );
}