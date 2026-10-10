import { NextRequest, NextResponse } from "next/server";
import { createProductReview } from "@/app/bussinessLogic/product-review-actions";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const result =
      await createProductReview(body);

    if (!result.success) {
      return NextResponse.json(
        result,
        {
          status:
            result.error ===
            "You must be logged in to review a product"
              ? 401
              : 400,
        }
      );
    }
    
    return NextResponse.json(
      result,
      { status: 201 }
    );

  } catch (error) {
    console.error(
      "Product review API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product review",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest
) {
  try {
    const productId =
      Number(
        request.nextUrl.searchParams.get(
          "productId"
        )
      );

    if (!productId || !Number.isInteger(productId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product ID",
        },
        { status: 400 }
      );
    }

    const reviews =
      await prisma.productReview.findMany({
        where: {
          productId,
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    const rating =
      await prisma.productReview.aggregate({
        where: {
          productId,
        },

        _avg: {
          rating: true,
        },

        _count: {
          rating: true,
        },
      });

    return NextResponse.json({
      success: true,

      data: {
        reviews,
        rating: rating._avg.rating ?? 0,
        reviewCount: rating._count.rating,
      },
    });

  } catch (error) {
    console.error(
      "Product reviews GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product reviews",
      },
      { status: 500 }
    );
  }
}