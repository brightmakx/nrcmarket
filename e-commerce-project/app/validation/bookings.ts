import { z } from "zod";

export const bookingSchema = z.object({
    serviceId: z.number().int().positive("Invalid service"),

    name: z
        .string()
        .trim()
        .min(1, "Name is required"),

    email: z
        .email("Invalid email address"),

    phone: z
        .string()
        .trim()
        .min(1, "Phone number is required"),

    location: z
        .string()
        .trim()
        .min(1, "Location is required"),

    preferredDate: z
        .string()
        .nullable()
        .optional(),

    message: z
        .string()
        .trim()
        .optional(),
});

export type bookingEntityType = z.infer<typeof bookingSchema>;

export function validateBooking(data: unknown) {
    return bookingSchema.safeParse(data);
}