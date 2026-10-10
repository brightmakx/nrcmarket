import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { serviceRatingBusiness } from "@/app/bussinessLogic/serviceRatingBusiness";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication required",
                },
                { status: 401 }
            );
        }

        const body = await req.json();

        const result = await serviceRatingBusiness.createReview(
            body,
            session.user.id
        );

        if (!result.success) {
            return NextResponse.json(
                result,
                { status: 400 }
            );
        }

        return NextResponse.json(
            result,
            { status: 201 }
        );
    } catch (error) {
        console.error("Service review POST error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create service review",
            },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const serviceId = Number(
            req.nextUrl.searchParams.get("serviceId")
        );

        if (!serviceId || Number.isNaN(serviceId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid service ID",
                },
                { status: 400 }
            );
        }

        const data =
            await serviceRatingBusiness.getServiceReviews(
                serviceId
            );

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Service review GET error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to get service reviews",
            },
            { status: 500 }
        );
    }
}