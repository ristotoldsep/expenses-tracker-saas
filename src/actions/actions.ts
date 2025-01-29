

/**
 * @file This file contains server-side actions for managing expenses and handling Stripe checkout sessions.
 */

"use server";

import { prisma } from "@/lib/db";
import { checkAuthenticationAndMembership } from "@/lib/server-utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Stripe from "stripe";

export async function addExpense(formData: FormData) {
    const user = await checkAuthenticationAndMembership();

    await prisma.expense.create({
        data: {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            amount: Number(formData.get("amount")),
            creatorId: user.id,
        },
    });

    revalidatePath("/app/dashboard");
}

export async function editExpense(formData: FormData, id: number) {
    await checkAuthenticationAndMembership();

    await prisma.expense.update({
        where: {
            id: id,
        },
        data: {
            description: formData.get("description") as string,
            amount: Number(formData.get("amount")),
        },
    });

    revalidatePath("/app/dashboard");
}

export async function deleteExpense(id: number) {
    await checkAuthenticationAndMembership();
    
    // Fetch the expense to check if the user is the creator
    const expense = await prisma.expense.findUnique({
        where: {
            id: id,
        },
        select: { creatorId: true }, // Only select the creatorId field to reduce the data transfer
    });

    // If no expense is found, throw an error
    if (!expense) {
        throw new Error("You are not authorized to delete this expense.");
    }

    // Proceed with the deletion if the user is the creator
    await prisma.expense.delete({
        where: {
            id: id,
        },
    });

    revalidatePath("/app/dashboard");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-01-27.acacia"
});

export async function createCheckoutSession() {
    // authentication check
    const { isAuthenticated, getUser } = getKindeServerSession();
    if (!(await isAuthenticated())) {
        return redirect("/api/auth/login");
    }

    const user = await getUser();
    const session = await stripe.checkout.sessions.create({
        customer_email: user.email!,
        client_reference_id: user.id,
        line_items: [
            {
                price: "price_1QmgyvCv85vSTgAFpfbelw9b",
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${process.env.CANONICAL_URL}/app/dashboard?payment=success`,
        cancel_url: `${process.env.CANONICAL_URL}`,
    });

    redirect(session.url!);
}
