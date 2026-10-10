import { bookingsDb } from "@/app/database/data"
import { createNotification } from "@/lib/notification";
import {
    bookingEntityType,
    validateBooking,
} from "@/app/validation/bookings";

class bookingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "bookingError";
    }
}

function validationErrors(result: any) {

    const errors: Record<string, string> = {};

    if (result.error?.issues) {
        for (const issue of result.error.issues) {
            const field = issue.path[0];

            if (field && !errors[field]) {
                errors[field] = issue.message;
            }
        }
    }

    return errors;
}

export async function createBooking(
    data: bookingEntityType,
    userId: string
) {
    try {

        const result = validateBooking(data);

        if (!result.success) {
            return {
                validationErrors: validationErrors(result),
            };
        }

        const service = await bookingsDb.getServiceForBooking(
            result.data.serviceId
        );

        if (!service) {
            return {
                error: "Service not found",
            };
        }

        const provider = service.provider?.serviceProvider;

        if (!provider) {
            return {
                error: "This service does not currently have a provider",
            };
        }

        if (service.fee === null) {
            return {
                error: "This service does not have a fee configured",
            };
        }

        let preferredDate: Date | null = null;

        if (result.data.preferredDate) {

            const parsedDate = new Date(
                `${result.data.preferredDate}T00:00:00`
            );

            if (isNaN(parsedDate.getTime())) {
                return {
                    validationErrors: {
                        preferredDate: "Invalid preferred date",
                    },
                };
            }

            preferredDate = parsedDate;
        }

        const booking = await bookingsDb.createBooking({
            serviceId: service.id,
            providerId: provider.id,
            userId,

            name: result.data.name,
            email: result.data.email,
            phone: result.data.phone,
            location: result.data.location,

            preferredDate,
            message: result.data.message || null,

            fee: Number(service.fee),
        });

        createNotification({
            userId: provider.userId,
            title: "New Booking Request",
            message: `You have a new booking request for ${service.name}`,
            type: "BOOKING",
            entityId: String(booking.id),
            entityType:"BOOKING"
        }); 

        return {
            data: booking,
        };

    } catch (e) {

        console.error("createBooking error:", e);

        return {
            error: "Failed to create booking",
        };
    }
}


export async function findBookingById(
    id: number,
    userId: string
) {
    try {

        const booking = await bookingsDb.getBooking(id);

        if (!booking) {
            return {
                error: "Booking not found",
            };
        }

        const isCustomer = booking.userId === userId;
        const isProvider = booking.provider.userId === userId;

        if (!isCustomer && !isProvider) {
            return {
                error: "You are not authorized to view this booking",
            };
        }

        return {
            data: booking,
        };

    } catch (e) {

        console.error("findBookingById error:", e);

        return {
            error: "Failed to retrieve booking",
        };
    }
}


export async function findUserBookings(userId: string) {

    try {

        const data = await bookingsDb.getUserBookings(userId);

        return {
            data,
        };

    } catch (e) {

        console.error("findUserBookings error:", e);

        return {
            error: "Failed to retrieve bookings",
        };
    }
}


export async function findProviderBookings(userId: string) {

    try {

        const provider = await bookingsDb.getProviderBookingsByUserId?.(
            userId
        );

        return {
            data: provider,
        };

    } catch (e) {

        console.error("findProviderBookings error:", e);

        return {
            error: "Failed to retrieve provider bookings",
        };
    }
}


export async function updateBookingStatus(
    id: number,
    userId: string,
    status: "ACCEPTED" | "CANCELLED" | "COMPLETED"
) {

    try {

        const booking = await bookingsDb.getBooking(id);

        if (!booking) {
            return {
                error: "Booking not found",
            };
        }

        if (booking.provider.userId !== userId) {
            return {
                error: "You are not authorized to update this booking",
            };
        }

        if (
            status === "ACCEPTED" &&
            booking.status !== "REQUESTED"
        ) {
            return {
                error: "Only requested bookings can be accepted",
            };
        }

        if (
            status === "CANCELLED" &&
            booking.status !== "REQUESTED"
        ) {
            return {
                error: "Only requested bookings can be cancelled",
            };
        }

        if (
            status === "COMPLETED" &&
            booking.status !== "ACCEPTED"
        ) {
            return {
                error: "Only accepted bookings can be completed",
            };
        }

        console.log("updating info: ",{id,providerId:booking.provider.id,status})
        const result =
            await bookingsDb.updateProviderBookingStatus({
                id,
                providerId: booking.provider.id,
                status,
            });

        if (result.count === 0) {
            return {
                error: "Booking could not be updated",
            };
        }

        const updatedBooking = await bookingsDb.getBooking(id);

        return {
            data: updatedBooking,
        };

    } catch (e) {

        console.error("updateBookingStatus error:", e);

        return {
            error: "Failed to update booking",
        };
    }
}