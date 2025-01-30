import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = await prisma.expenseCategory.findMany();
        return NextResponse.json(categories);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}