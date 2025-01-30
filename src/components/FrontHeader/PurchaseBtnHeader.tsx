"use client";

import { createCheckoutSession } from "@/actions/actions";

export default function PurchaseBtnHeader() {
    return (
        <button
            onClick={async () => {
                await createCheckoutSession();
            }}
            className="bg-black text-white px-5 py-2 rounded-lg font-medium border border-white/10 hover:bg-white hover:text-black transition mr-1"
        >
            Osta liikmelisus
        </button>
    );
}