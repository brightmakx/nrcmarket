import { getSession } from "@/lib/session";
import { findProviderBookings } from "@/app/bussinessLogic/bookings";

export async function GET() {
    try {
        const session = await getSession();

        if (!session?.user?.id) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const result = await findProviderBookings(
            session.user.id
        );

        if (result.error) {
            return Response.json(
                {
                    success: false,
                    message: result.error,
                },
                { status: 400 }
            );
        }

        return Response.json({
            success: true,
            data: result.data,
        });
    } catch (e) {
        console.error(
            "GET /api/bookings/provider error:",
            e
        );

        return Response.json(
            {
                success: false,
                message: "Failed to retrieve provider bookings",
            },
            { status: 500 }
        );
    }
}