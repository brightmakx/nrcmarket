import { prisma } from "@/lib/prisma"
import { usersDb } from "../database/data"
import { userEntityType } from "../types/userTypes"

export async function saveUser(data: userEntityType) {
    try {
        const result = await usersDb.createUser(data)

        return result
    } catch (error) {
        console.error("Failed to save user:", error)

        return null
    }
}

export async function deleteUser(email: string) {
    return usersDb.deleteUserByEmail(email)
}

export async function getUser(
    userId: string,
    includeOrders = false
) {
    return prisma.user.findUnique({
        where: {
            id: userId
        },

        include: includeOrders
            ? {
                orders: {
                    include: {
                        orderedProducts: true
                    }
                }
            }
            : undefined
    })
}