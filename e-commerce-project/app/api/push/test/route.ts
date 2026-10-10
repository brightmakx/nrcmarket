import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import webpush from "@/lib/push";
import { getSession } from "@/lib/session";
import { createNotification } from "../../../../lib/notification";

export async function POST() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You must be logged in"
                },
                { status: 401 }
            );
        }


        
        await fetch(`http://localhost:3000/api/notifications/${1}/read`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            }
        })



        const subscriptions =
            await prisma.pushSubscription.findMany({
                where: {
                    userId: session.user.id
                }
            });

        if (subscriptions.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No push subscriptions found"
                },
                { status: 404 }
            );
        }

        const payload = JSON.stringify({
            title: "Test notification",
            message: "Your Web Push setup is working!"
        });

        for (const subscription of subscriptions) {
            try {
                const response = await webpush.sendNotification(
                    {
                        endpoint: subscription.endpoint,
                        keys: {
                            p256dh: subscription.p256dh,
                            auth: subscription.auth
                        }
                    },
                    payload
                );

                console.log("PUSH RESPONSE:", {
                    subscriptionId: subscription.id,
                    statusCode: response.statusCode
                });

            } catch (error: any) {

                console.error(
                    `Push failed for subscription ${subscription.id}:`,
                    error
                );

                if (
                    error.statusCode === 404 ||
                    error.statusCode === 410
                ) {
                    await prisma.pushSubscription.delete({
                        where: {
                            id: subscription.id
                        }
                    });

                    console.log(
                        `Deleted stale subscription ${subscription.id}`
                    );
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: "Notification processing completed"
        });

    } catch (error) {
        console.error("Push notification error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to send notification"
            },
            { status: 500 }
        );
    }
}