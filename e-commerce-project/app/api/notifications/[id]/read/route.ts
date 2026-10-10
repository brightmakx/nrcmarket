import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You must be logged in",
                },
                { status: 401 }
            );
        }

        const { id } = await params;
        const notificationId = Number(id);

        if (!Number.isInteger(notificationId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid notification ID",
                },
                { status: 400 }
            );
        }

        const notification = await prisma.notification.findFirst({
            where: {
                id: notificationId,
                userId: session.user.id,
            },
        });

        if (!notification) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Notification not found",
                },
                { status: 404 }
            );
        }

        const updatedNotification =
            await prisma.notification.update({
                where: {
                    id: notification.id,
                },
                data: {
                    isRead: true,
                    readAt: new Date(),
                },
            });

        return NextResponse.json({
            success: true,
            data: updatedNotification,
        });
    } catch (error) {
        console.error("Mark notification as read error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to mark notification as read",
            },
            { status: 500 }
        );
    }
}