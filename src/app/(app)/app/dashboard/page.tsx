/**
 * This file defines the main dashboard page component for the expenses tracker SaaS application.
 * It handles user authentication, membership validation, and fetching user-specific expenses.
 * Depending on the payment status from the URL, it may redirect the user to the dashboard.
 * 
 * If the user is authenticated and has an active membership, the component renders the dashboard page.
 * 
 * If the user is authenticated but does not have an active membership, the component renders the marketing page.
 * 
 * If the user is not authenticated, the component redirects the user to the login page.
 * 
 * If the payment status is "success", the component redirects the user to the dashboard, this is coming from the Stripe checkout webhook (it has been set up in Stripe admin panel) (also check actions.ts and /api/stripe/route.js).
 * 
 * @param {Object} props - The properties object.
 * @param {Promise<Object>} props.searchParams - A promise that resolves to an object containing URL search parameters.
 * 
 * @returns {JSX.Element} The rendered dashboard page component.
 */

import ExpensesForm from "@/components/ExpensesForm";
import ExpensesList from "@/components/ExpensesList";
import { prisma } from "@/lib/db";
import { checkAuthenticationAndMembership } from "@/lib/server-utils";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const paymentValueFromUrl = (await searchParams).payment;

  // Passing waitMs to wait for 3 seconds before redirecting to the login page, because the Stripe webhook may take some time to update the membership status.
  const user = await checkAuthenticationAndMembership(
    paymentValueFromUrl === "success" ? 3000 : 0
  );

  if (paymentValueFromUrl === "success") {
    return redirect("/app/dashboard");
  }

  const expenses = await prisma.expense.findMany({
    where: {
      creatorId: user.id,
    },
    include: {
      category: true, // This joins the ExpenseCategory table to fetch category name
    },
    orderBy: {
      createdAt: "desc", // ✅ Sort by newest first
    },
  });

  return (
    <div className="w-full max-w-full lg:max-w-[1300px] mx-auto md:py-2">
      <h1 className="text-3xl font-bold text-white text-center">
        Tere{user?.given_name ? `, ${user.given_name}` : ""}! 👋
      </h1>

      <div className="max-w-full sm:max-w-[550px] mx-auto mt-8">
        <ExpensesList expenses={expenses} />

        <ExpensesForm />
      </div>
    </div>
  );
}