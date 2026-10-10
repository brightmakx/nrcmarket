import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import {
    createBooking,
    findUserBookings,
} from "@/app/bussinessLogic/bookings";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const body = await request.json();

        const result = await createBooking(
            body,
            session.user.id
        );

        if (result.validationErrors) {
            return NextResponse.json(
                {
                    success: false,
                    validationErrors: result.validationErrors,
                },
                {
                    status: 400,
                }
            );
        }

        if (result.error) {
            return NextResponse.json(
                {
                    success: false,
                    message: result.error,
                },
                {
                    status: 400,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: result.data,
            },
            {
                status: 201,
            }
        );

    } catch (e) {
        console.error("POST /api/bookings error:", e);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create booking",
            },
            {
                status: 500,
            }
        );
    }
}


export async function GET() {
    try {
        const session = await getSession();

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const result = await findUserBookings(
            session.user.id
        );

        if (result.error) {
            return NextResponse.json(
                {
                    success: false,
                    message: result.error,
                },
                {
                    status: 400,
                }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data,
        });

    } catch (e) {
        console.error("GET /api/bookings error:", e);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve bookings",
            },
            {
                status: 500,
            }
        );
    }
}