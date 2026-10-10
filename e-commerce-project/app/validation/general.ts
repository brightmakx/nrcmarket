export function formatValidationErrors(
    fieldErrors: Record<string, string[] | undefined>
) {
    const errors: Record<string, string> = {}

    for (const [field, messages] of Object.entries(fieldErrors)) {
        if (messages && messages.length > 0) {
            errors[field] = messages[0]
        }
    }

    return {
        success: false as const,
        errors
    }
}