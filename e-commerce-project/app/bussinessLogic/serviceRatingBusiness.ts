import { serviceRatingDb } from "@/app/database/data";
import { prisma } from "@/lib/prisma";
import {
    serviceRatingEntityType,
    validateServiceRating,
} from "@/app/validation/serviceRatingValidation";

export const serviceRatingBusiness = {

    createReview: async function (
        data: serviceRatingEntityType,
        userId: string
    ) {
        const validation = validateServiceRating(data);

        if (!validation.success) {
            return {
                success: false,
                errors: validation.error.flatten().fieldErrors,
            };
        }

        const {
            serviceId,
            rating,
            review,
        } = validation.data;

        const booking = await prisma.booking.findFirst({
            where: {
                id: data.bookingId,
                serviceId,
                userId,
                status: "COMPLETED",
            },
        });

        if (!booking) {
            return {
                success: false,
                message: "You can only review a completed booking.",
            };
        }

        const existingReview =
            await serviceRatingDb.getUserServiceReview({
                userId,
                serviceId,
            });

        if (existingReview) {
            return {
                success: false,
                message: "You have already reviewed this service.",
            };
        }

        const createdReview =
            await serviceRatingDb.createReview({
                rating,
                comment: review,
                userId,
                serviceId,
                providerId: booking.providerId,
                bookingId: booking.id,
            });

        const providerRating =
            await serviceRatingDb.getProviderRating(
                booking.providerId
            );

        await prisma.serviceProvider.update({
            where: {
                id: booking.providerId,
            },
            data: {
                rating: providerRating.rating,
            },
        });

        return {
            success: true,
            data: createdReview,
        };
    },

    getServiceReviews: async function (serviceId: number) {
        const reviews =
            await serviceRatingDb.getServiceReviews(serviceId);

        const rating =
            await serviceRatingDb.getServiceRating(serviceId);

        return {
            reviews,
            ...rating,
        };
    },
};