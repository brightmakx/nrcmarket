import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

        const notifications = await prisma.notification.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const unreadCount = await prisma.notification.count({
            where: {
                userId: session.user.id,
                isRead: false,
            },
        });
        console.log("notifications: ", notifications);
        return NextResponse.json({
            success: true,
            data: notifications,
            unreadCount,
        });
    } catch (error) {
        console.error("Get notifications error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to load notifications",
            },
            { status: 500 }
        );
    }
}
