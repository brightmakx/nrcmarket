
import { z } from "zod";


// =========================================================
// CREATE CATEGORY SCHEMA
// =========================================================

export const categoryEntitySchema = z.object({

    name: z
        .string()
        .trim()
        .min(2, "Category name must be at least 2 characters.")
        .max(50, "Category name cannot exceed 50 characters."),

    imageUrl: z
        .string()
        .trim()
        .min(1, "Category image is required."),

    description: z
        .string()
        .trim()
        .max(
            500,
            "Category description cannot exceed 500 characters."
        )
        .optional()
        .nullable(),

});


// =========================================================
// CATEGORY ENTITY TYPE
// =========================================================

export type categoryEntityType =
    z.infer<typeof categoryEntitySchema>;


// =========================================================
// VALIDATE CATEGORY
// =========================================================

export function validateCategory(
    data: unknown
) {

    return categoryEntitySchema.safeParse(data);

}

