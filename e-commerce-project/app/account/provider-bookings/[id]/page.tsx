"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import "./provider-booking-details.css";

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
    updatedAt: string;
    service: {
        id: number;
        name: string;
        description: string;
    };
    provider: {
        id: number;
        name: string;
        email: string;
        phone: string;
        location: string;
        title: string | null;
        availability: string | null;
        rating: number | string;
    };
};

export default function ProviderBookingDetailsPage() {
    const { id } = useParams<{ id: string }>();

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        async function fetchBooking() {
            try {
                const res = await fetch(
                    `/api/bookings/${id}`
                );

                const result = await res.json();

                if (!res.ok) {
                    setError(
                        result.message ||
                            "Failed to retrieve booking."
                    );
                    return;
                }

                setBooking(result.data);
            } catch {
                setError(
                    "Something went wrong. Please try again."
                );
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchBooking();
        }
    }, [id]);

    async function updateStatus(
        status:
            | "ACCEPTED"
            | "CANCELLED"
            | "COMPLETED"
    ) {
        if (!booking) return;

        setUpdating(true);
        setError("");

        try {
            const res = await fetch(
                `/api/bookings/${booking.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                }
            );

            const result = await res.json();

            if (!res.ok) {
                setError(
                    result.message ||
                        "Failed to update booking."
                );
                return;
            }

            setBooking((current) =>
                current
                    ? {
                          ...current,
                          status,
                      }
                    : current
            );
        } catch {
            setError(
                "Something went wrong. Please try again."
            );
        } finally {
            setUpdating(false);
        }
    }

    if (loading) {
        return (
            <main className="provider-booking-details-page">
                <div className="provider-booking-details-container">
                    <p>Loading booking...</p>
                </div>
            </main>
        );
    }

    if (error || !booking) {
        return (
            <main className="provider-booking-details-page">
                <div className="provider-booking-details-container">
                    <Link
                        href="/account/provider-bookings"
                        className="provider-back-link"
                    >
                        ← Back to booking requests
                    </Link>

                    <div className="provider-booking-error">
                        {error || "Booking not found."}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="provider-booking-details-page">
            <div className="provider-booking-details-container">
                <Link
                    href="/account/provider-bookings"
                    className="provider-back-link"
                >
                    ← Back to booking requests
                </Link>

                <div className="provider-details-header">
                    <div>
                        <span className="provider-details-label">
                            Booking #{booking.id}
                        </span>

                        <h1>{booking.service.name}</h1>

                        <p>
                            Requested on{" "}
                            {new Date(
                                booking.createdAt
                            ).toLocaleDateString()}
                        </p>
                    </div>

                    <span
                        className={`provider-details-status ${booking.status.toLowerCase()}`}
                    >
                        {booking.status}
                    </span>
                </div>

                {error && (
                    <div className="provider-booking-error">
                        {error}
                    </div>
                )}

                <div className="provider-details-grid">
                    <section className="provider-details-card">
                        <h2>Customer</h2>

                        <div className="provider-detail-item">
                            <span>Name</span>
                            <strong>{booking.name}</strong>
                        </div>

                        <div className="provider-detail-item">
                            <span>Email</span>
                            <strong>{booking.email}</strong>
                        </div>

                        <div className="provider-detail-item">
                            <span>Phone</span>
                            <strong>{booking.phone}</strong>
                        </div>

                        <div className="provider-detail-item">
                            <span>Service location</span>
                            <strong>
                                {booking.location}
                            </strong>
                        </div>
                    </section>

                    <section className="provider-details-card">
                        <h2>Service</h2>

                        <div className="provider-detail-item">
                            <span>Service</span>
                            <strong>
                                {booking.service.name}
                            </strong>
                        </div>

                        <div className="provider-detail-item">
                            <span>Description</span>
                            <p>
                                {booking.service.description}
                            </p>
                        </div>

                        <div className="provider-detail-item">
                            <span>Service fee</span>
                            <strong>
                                MK{booking.fee}
                            </strong>
                        </div>
                    </section>

                    <section className="provider-details-card">
                        <h2>Booking details</h2>

                        <div className="provider-detail-item">
                            <span>Preferred date</span>
                            <strong>
                                {booking.preferredDate
                                    ? new Date(
                                          booking.preferredDate
                                      ).toLocaleDateString()
                                    : "Not specified"}
                            </strong>
                        </div>

                        <div className="provider-detail-item">
                            <span>Status</span>
                            <strong>
                                {booking.status}
                            </strong>
                        </div>

                        <div className="provider-detail-item">
                            <span>Requested</span>
                            <strong>
                                {new Date(
                                    booking.createdAt
                                ).toLocaleString()}
                            </strong>
                        </div>
                    </section>

                    <section className="provider-details-card">
                        <h2>Customer message</h2>

                        {booking.message ? (
                            <p className="provider-customer-message">
                                {booking.message}
                            </p>
                        ) : (
                            <p className="provider-no-message">
                                No message was provided.
                            </p>
                        )}
                    </section>
                </div>

                {booking.status === "REQUESTED" && (
                    <div className="provider-details-actions">
                        <button
                            type="button"
                            className="provider-accept-btn"
                            disabled={updating}
                            onClick={() =>
                                updateStatus("ACCEPTED")
                            }
                        >
                            {updating
                                ? "Updating..."
                                : "Accept Booking"}
                        </button>

                        <button
                            type="button"
                            className="provider-cancel-btn"
                            disabled={updating}
                            onClick={() =>
                                updateStatus("CANCELLED")
                            }
                        >
                            {updating
                                ? "Updating..."
                                : "Cancel Booking"}
                        </button>
                    </div>
                )}

                {booking.status === "ACCEPTED" && (
                    <div className="provider-details-actions">
                        <button
                            type="button"
                            className="provider-accept-btn"
                            disabled={updating}
                            onClick={() =>
                                updateStatus("COMPLETED")
                            }
                        >
                            {updating
                                ? "Updating..."
                                : "Mark as Completed"}
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}