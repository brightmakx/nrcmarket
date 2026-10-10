import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You must be logged in"
                },
                { status: 401 }
            );
        }

        const subscription = await request.json();

        const { endpoint, keys } = subscription;

        if (!endpoint || !keys?.p256dh || !keys?.auth) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid push subscription"
                },
                { status: 400 }
            );
        }

        const savedSubscription =
            await prisma.pushSubscription.upsert({
                where: {
                    endpoint
                },
                update: {
                    p256dh: keys.p256dh,
                    auth: keys.auth,
                    userId: session.user.id
                },
                create: {
                    endpoint,
                    p256dh: keys.p256dh,
                    auth: keys.auth,
                    userId: session.user.id
                }
            });

        return NextResponse.json({
            success: true,
            subscription: savedSubscription
        });

    } catch (error) {
        console.error("Failed to save push subscription:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to save subscription"
            },
            { status: 500 }
        );
    }
}