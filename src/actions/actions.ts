

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

    // Extract and validate form data
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const amount = formData.get("amount") as string | null;
    const categoryId = formData.get("categoryId") as string | null;
    const date = formData.get("date") as string | null; // Get date from form

    if (!title || title.trim() === "") {
        throw new Error("Pealkiri on kohustuslik!");
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        throw new Error("Summa peab olema positiivne number!");
    }

    if (!categoryId || isNaN(Number(categoryId))) {
        throw new Error("Kategooria on kohustuslik!");
    }

    if (!date || isNaN(Date.parse(date))) {
        throw new Error("Kehtiv kuupäev on kohustuslik!");
    }

    // Ensure category exists
    const category = await prisma.expenseCategory.findUnique({
        where: { id: Number(categoryId) },
    });

    if (!category) {
        throw new Error("Valitud kategooriat ei eksisteeri!");
    }

    // Create the expense
    await prisma.expense.create({
        data: {
            title,
            description: description || "",
            amount: Number(amount),
            creatorId: user.id,
            categoryId: Number(categoryId),
            createdAt: new Date(date), // Store selected date
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
        throw new Error("Sul pole piisavalt õigusi et seda kulu kustutada.");
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
                price: "price_1QoYE2Cv85vSTgAFU7vGcZtP", // Price ID for the product I created in the Stripe dashboard
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${process.env.CANONICAL_URL}/app/dashboard?payment=success`, // Redirect URL after successful payment
        cancel_url: `${process.env.CANONICAL_URL}`, // Redirect URL after payment cancellation or failure
    });

    redirect(session.url!);
}
