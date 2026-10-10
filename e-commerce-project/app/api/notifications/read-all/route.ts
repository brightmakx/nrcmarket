import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PATCH() {
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

        const result = await prisma.notification.updateMany({
            where: {
                userId: session.user.id,
                isRead: false,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            message: "All notifications marked as read",
            updatedCount: result.count,
        });
    } catch (error) {
        console.error(
            "Mark all notifications as read error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to mark notifications as read",
            },
            { status: 500 }
        );
    }
}