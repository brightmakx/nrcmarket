import { z } from "zod"
import { formatValidationErrors } from "./general"

export const userEntitySchema = z.object({
    email: z
        .email("Invalid email address")
        .endsWith("@gmail.com", "Email must be a Gmail address"),

    name: z
        .string()
        .min(1, "Name is required"),

    password: z
        .string()
        .min(8, "Password must contain at least 8 characters"),

    location: z
        .string()
        .optional(),

    phone: z
        .string()
        .optional()
})

export const userRes = userEntitySchema.pick({
    name: true,
    location: true
})

export function validateUserEntity(user: unknown) {
    const result = userEntitySchema.safeParse(user)

    if (!result.success) {
        return formatValidationErrors(
            result.error.flatten().fieldErrors
        )
    }

    return {
        success: true as const,
        data: result.data
    }
}