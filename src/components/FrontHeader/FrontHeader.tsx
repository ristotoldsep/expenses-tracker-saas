"use client";

import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import Link from "next/link";
import PurchaseBtnHeader from "./PurchaseBtnHeader";

interface FrontHeaderProps {
    isLoggedIn: boolean;
    isPayingMember: boolean;
}

export default function FrontHeader({ isLoggedIn, isPayingMember }: FrontHeaderProps) {

    return (
        <header className="flex items-center py-4 px-5 absolute top-0 left-0 right-0 z-10 bg-transparent backdrop-blur-md max-w-[1300px] mx-auto">
            <Link href="/">
                <Image
                    src="/rahavoog_logo.webp"
                    alt="Logo"
                    width={40}
                    height={40}
                    priority
                />
            </Link>

            <nav className="ml-auto">
                <ul className="flex items-center gap-2 text-xs">
                    {isLoggedIn ? (
                        isPayingMember ? (
                            <Link href="/app/dashboard" className="px-2 py-1 hover:text-white transition text-white/100">
                                Mine töölauale
                            </Link>
                        ) : (
                            <PurchaseBtnHeader />
                        )
                    ) : (
                        <>
                            <LoginLink className="px-2 py-1 hover:text-white transition text-white/80">Logi sisse</LoginLink>
                            <RegisterLink className="px-2 py-1 hover:text-white transition text-white/80">
                                Registreeri
                            </RegisterLink>
                        </>
                    )}
                </ul>
            </nav>

            {isLoggedIn && (
                <span className="text-white/40 px-3">|</span>
            )}

            {/* Show logout link if user is authenticated */}
            {isLoggedIn && (
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
            )}
        </header>
    );
}