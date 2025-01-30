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
        <header className="flex items-center py-2 px-5 absolute top-0 left-0 right-0 z-10 bg-transparent backdrop-blur-md max-w-[1300px] mx-auto">
            <Link href="/">
                <Image
                    src="/rahavoog.webp"
                    alt="Logo"
                    width={40}
                    height={40}
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

            {/* Show logout link if user is authenticated */}
            {isLoggedIn && (
                <LogoutLink className="text-white/70 text-[12px] ml-[10px]">
                    Logi välja
                </LogoutLink>
            )}
        </header>
    );
}