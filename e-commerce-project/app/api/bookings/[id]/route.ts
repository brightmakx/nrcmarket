import { NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import {
    findBookingById,
    updateBookingStatus,
} from "@/app/bussinessLogic/bookings";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    request: NextRequest,
    { params }: Params
) {

    try {

        const session = await getSession();

        if (!session?.user?.id) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const { id } = await params;
        const bookingId = Number(id);

        if (!Number.isInteger(bookingId) || bookingId <= 0) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid booking ID",
                },
                {
                    status: 400,
                }
            );
        }

        const result = await findBookingById(
            bookingId,
            session.user.id
        );

        if (result.error) {
            return Response.json(
                {
                    success: false,
                    message: result.error,
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json({
            success: true,
            data: result.data,
        });

    } catch (e) {

        console.error(
            "GET /api/bookings/[id] error:",
            e
        );

        return Response.json(
            {
                success: false,
                message: "Failed to retrieve booking",
            },
            {
                status: 500,
            }
        );
    }
}


export async function PATCH(
    request: NextRequest,
    { params }: Params
) {

    try {

        const session = await getSession();

        if (!session?.user?.id) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const { id } = await params;
        const bookingId = Number(id);

        if (!Number.isInteger(bookingId) || bookingId <= 0) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid booking ID",
                },
                {
                    status: 400,
                }
            );
        }

        const body = await request.json();

        if (
            body.status !== "ACCEPTED" &&
            body.status !== "CANCELLED" &&
            body.status !== "COMPLETED"
        ) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid booking status",
                },
                {
                    status: 400,
                }
            );
        }

        const result = await updateBookingStatus(
            bookingId,
            session.user.id,
            body.status
        );

        if (result.error) {
            return Response.json(
                {
                    success: false,
                    message: result.error,
                },
                {
                    status: 400,
                }
            );
        }

        return Response.json({
            success: true,
            data: result.data,
        });

    } catch (e) {

        console.error(
            "PATCH /api/bookings/[id] error:",
            e
        );

        return Response.json(
            {
                success: false,
                message: "Failed to update booking",
            },
            {
                status: 500,
            }
        );
    }
}