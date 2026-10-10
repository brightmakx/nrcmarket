"use server";

import { prisma } from "@/lib/prisma";
import { productReviewSchema } from "../validation/product-review-schema";
import { getSession } from "@/lib/session";

export async function createProductReview(
  input: unknown
) {
  // =========================
  // AUTHENTICATION
  // =========================

  const session = await getSession();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be logged in to review a product",
    };
  }

  // =========================
  // VALIDATION
  // =========================

  const validation =
    productReviewSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: "Invalid review data",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const {
    productId,
    rating,
    comment,
  } = validation.data;

  // =========================
  // CHECK PRODUCT
  // =========================

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
    },
  });

  if (!product) {
    return {
      success: false,
      error: "Product not found",
    };
  }

  // =========================
  // CHECK PURCHASE
  // =========================

  const deliveredOrder =
    await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: "DELIVERED",

        orderedProducts: {
          some: {
            productId,
          },
        },
      },

      select: {
        id: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  if (!deliveredOrder) {
    return {
      success: false,
      error:
        "You can only review products you have received",
    };
  }

  // =========================
  // PREVENT DUPLICATE REVIEW
  // =========================

  const existingReview =
    await prisma.productReview.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

  if (existingReview) {
    return {
      success: false,
      error: "You have already reviewed this product",
    };
  }

  // =========================
  // CREATE REVIEW
  // =========================

  const review =
    await prisma.productReview.create({
      data: {
        userId: session.user.id,
        productId,
        orderId: deliveredOrder.id,
        rating,
        comment,
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
    });

  // =========================
  // RECALCULATE RATING
  // =========================

  const ratingData =
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

  const averageRating =
    ratingData._avg.rating ?? 0;

  // =========================
  // UPDATE PRODUCT
  // =========================

  await prisma.product.update({
    where: {
      id: productId,
    },

    data: {
      rating: averageRating,
    },
  });

  // =========================
  // RESPONSE
  // =========================

  return {
    success: true,

    data: {
      review,
      rating: averageRating,
      reviewCount: ratingData._count.rating,
    },
  };
}