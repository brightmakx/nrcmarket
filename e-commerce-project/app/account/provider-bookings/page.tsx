"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./provider-bookings.css";

type Provider = {
    rating: number | string;
};

type Booking = {
    id: number;
    name: string;
    email: string;
    phone: string;
    location: string;
    preferredDate: string | null;
    message: string | null;
    fee: number | string;
    status:
        | "REQUESTED"
        | "ACCEPTED"
        | "CANCELLED"
        | "COMPLETED";
    createdAt: string;
    service: {
        id: number;
        name: string;
        description: string;
    };
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        location: string | null;
    };
};

export default function ProviderBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [provider, setProvider] = useState<Provider | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    async function fetchBookings() {
        try {
            const res = await fetch("/api/bookings/provider");
            const result = await res.json();

            if (!res.ok) {
                setError(
                    result.message ||
                        "Failed to retrieve bookings."
                );
                return;
            }

            setBookings(result.data || []);
        } catch {
            setError(
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    async function fetchProvider() {
        try {
            const res = await fetch("/api/providers");
            const result = await res.json();

            if (!res.ok) {
                return;
            }

            setProvider(result.data);
        } catch {
            // Provider rating is not critical to the page.
        }
    }

    useEffect(() => {
        fetchBookings();
        fetchProvider();
    }, []);

    async function updateStatus(
        id: number,
        status:
            | "ACCEPTED"
            | "CANCELLED"
            | "COMPLETED"
    ) {
        setUpdatingId(id);
        setError("");

        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(
                    result.message ||
                        "Failed to update booking."
                );
                return;
            }

            setBookings((current) =>
                current.map((booking) =>
                    booking.id === id
                        ? {
                              ...booking,
                              status,
                          }
                        : booking
                )
            );
        } catch {
            setError(
                "Something went wrong. Please try again."
            );
        } finally {
            setUpdatingId(null);
        }
    }

    if (loading) {
        return (
            <main className="provider-bookings-page">
                <div className="provider-bookings-container">
                    <h1>Booking Requests</h1>
                    <p>Loading bookings...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="provider-bookings-page">
            <div className="provider-bookings-container">
                <div className="provider-bookings-header">
                    <div>
                        <h1>Booking Requests</h1>
                        <p>
                            Manage requests from customers for
                            your services.
                        </p>
                    </div>

                    <div className="provider-bookings-header-right">
                        {provider && (
                            <div className="provider-rating">
                                <span>Your Rating</span>
                                <strong>
                                    ⭐{" "}
                                    {Number(provider.rating).toFixed(1)}
                                    {" / 5"}
                                </strong>
                            </div>
                        )}

                        <Link
                            href="/service"
                            className="provider-services-btn"
                        >
                            My Services
                        </Link>
                    </div>
                </div>

                {error && (
                    <p className="provider-bookings-error">
                        {error}
                    </p>
                )}

                {bookings.length === 0 ? (
                    <div className="no-provider-bookings">
                        <h2>No booking requests</h2>
                        <p>
                            You do not have any booking requests
                            yet.
                        </p>
                    </div>
                ) : (
                    <div className="provider-bookings-list">
                        {bookings.map((booking) => (
                            <article
                                key={booking.id}
                                className="provider-booking-card"
                            >
                                <div className="provider-booking-top">
                                    <div>
                                        <span className="booking-label">
                                            Booking #
                                            {booking.id}
                                        </span>

                                        <h2>
                                            {booking.service.name}
                                        </h2>
                                    </div>

                                    <span
                                        className={`booking-status ${booking.status.toLowerCase()}`}
                                    >
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="provider-booking-grid">
                                    <div>
                                        <span className="booking-label">
                                            Customer
                                        </span>

                                        <strong>
                                            {booking.name}
                                        </strong>
                                    </div>

                                    <div>
                                        <span className="booking-label">
                                            Phone
                                        </span>

                                        <strong>
                                            {booking.phone}
                                        </strong>
                                    </div>

                                    <div>
                                        <span className="booking-label">
                                            Email
                                        </span>

                                        <strong>
                                            {booking.email}
                                        </strong>
                                    </div>

                                    <div>
                                        <span className="booking-label">
                                            Location
                                        </span>

                                        <strong>
                                            {booking.location}
                                        </strong>
                                    </div>

                                    <div>
                                        <span className="booking-label">
                                            Preferred date
                                        </span>

                                        <strong>
                                            {booking.preferredDate
                                                ? new Date(
                                                      booking.preferredDate
                                                  ).toLocaleDateString()
                                                : "Not specified"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span className="booking-label">
                                            Service fee
                                        </span>

                                        <strong>
                                            MK{booking.fee}
                                        </strong>
                                    </div>
                                </div>

                                {booking.message && (
                                    <div className="provider-booking-message">
                                        <span className="booking-label">
                                            Customer message
                                        </span>

                                        <p>
                                            {booking.message}
                                        </p>
                                    </div>
                                )}

                                {booking.status === "REQUESTED" && (
                                    <div className="provider-booking-actions">
                                        <button
                                            type="button"
                                            className="accept-booking-btn"
                                            disabled={
                                                updatingId ===
                                                booking.id
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    booking.id,
                                                    "ACCEPTED"
                                                )
                                            }
                                        >
                                            {updatingId ===
                                            booking.id
                                                ? "Updating..."
                                                : "Accept"}
                                        </button>

                                        <button
                                            type="button"
                                            className="cancel-booking-btn"
                                            disabled={
                                                updatingId ===
                                                booking.id
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    booking.id,
                                                    "CANCELLED"
                                                )
                                            }
                                        >
                                            {updatingId ===
                                            booking.id
                                                ? "Updating..."
                                                : "Cancel"}
                                        </button>
                                    </div>
                                )}

                                {booking.status === "ACCEPTED" && (
                                    <div className="provider-booking-actions">
                                        <button
                                            type="button"
                                            className="accept-booking-btn"
                                            disabled={
                                                updatingId ===
                                                booking.id
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    booking.id,
                                                    "COMPLETED"
                                                )
                                            }
                                        >
                                            {updatingId ===
                                            booking.id
                                                ? "Updating..."
                                                : "Mark Completed"}
                                        </button>
                                    </div>
                                )}

                                <div className="provider-booking-footer">
                                    <span>
                                        Requested{" "}
                                        {new Date(
                                            booking.createdAt
                                        ).toLocaleDateString()}
                                    </span>

                                    <Link
                                        href={`/account/provider-bookings/${booking.id}`}
                                        className="provider-booking-details-link"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}