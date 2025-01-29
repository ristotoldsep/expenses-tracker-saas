

/**
 * This file handles the Stripe webhook events for the expenses tracker SaaS application.
 * It verifies the webhook signature to ensure the request is from Stripe and processes
 * the event accordingly. Specifically, it handles the "checkout.session.completed" event
 * to create a new membership in the database.
 */

/**
 * Handles the POST request for Stripe webhook events.
 *
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Promise<Response>} - A promise that resolves to an HTTP response object.
 */
import { prisma } from "@/lib/db";
import Stripe from "stripe";

export async function POST(request: Request) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-01-27.acacia",
    });

    const body = await request.text();

    // verify that webhook is from Stripe not from hackers :D
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            request.headers.get("stripe-signature")!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        console.error(`Webhook signature verification failed.`);
        if (error instanceof Error) {
            console.error(error.message);
        }
        return Response.json({ received: false }, { status: 400 });
    }

    // fulfill order
    switch (event.type) {
        case "checkout.session.completed":
            await prisma.membership.create({
                data: {
                    userId: event.data.object.client_reference_id!,
                    status: "active",
                },
            });
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // return 200 OK
    return Response.json({ received: true }, { status: 200 });
}