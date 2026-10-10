import { z } from "zod";

export const serviceRatingSchema = z.object({
    serviceId: z.number().int().positive("Invalid service"),

    bookingId: z.number().int().positive("Invalid booking"),

    rating: z
        .number()
        .int()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot be greater than 5"),

    review: z
        .string()
        .trim()
        .max(1000, "Review is too long")
        .optional(),
});

export type serviceRatingEntityType = z.infer<
    typeof serviceRatingSchema
>;

export function validateServiceRating(data: unknown) {
    return serviceRatingSchema.safeParse(data);
}