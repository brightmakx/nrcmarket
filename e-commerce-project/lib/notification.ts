
import { prisma } from "@/lib/prisma";
import webpush from "@/lib/push";

type CreateNotificationData = {
    userId: string;
    title: string;
    message: string;
    type:
        | "ORDER"
        | "DELIVERY"
        | "BOOKING"
        | "SERVICE"
        | "PRODUCT"
        | "SYSTEM";
    entityType?: string;
    entityId?: string;
};

export async function createNotification(
    data: CreateNotificationData
) {
    const notification =
        await prisma.notification.create({
            data: {
                userId: data.userId,
                title: data.title,
                message: data.message,
                type: data.type,
                entityType: data.entityType,
                entityId: data.entityId,
            },
        });

    const subscriptions =
        await prisma.pushSubscription.findMany({
            where: {
                userId: data.userId
            }
        });

    for (const subscription of subscriptions) {
        try {
            await webpush.sendNotification(
                {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: subscription.p256dh,
                        auth: subscription.auth
                    }
                },
                JSON.stringify({
                    type: "NEW_NOTIFICATION",
                    notification: {
                        id: notification.id,
                        title: notification.title,
                        message: notification.message,
                        type: notification.type,
                        isRead: notification.isRead,
                        entityType: notification.entityType,
                        entityId: notification.entityId,
                        createdAt: notification.createdAt
                    }
                })
            );
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
            }
        }
    }

    return notification;
}

