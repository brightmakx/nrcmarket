"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import "./booking-details.css";
import ServiceReviewForm from "@/app/service/booking/review";

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

    review: {
        id: number;
        rating: number;
        comment: string | null;
        createdAt: string;
    } | null;
};

export default function BookingDetailsPage() {
    const { id } = useParams<{ id: string }>();

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchBooking() {
            try {
                const res = await fetch(`/api/bookings/${id}`);
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

    if (loading) {
        return (
            <main className="booking-details-page">
                <div className="booking-details-container">
                    <p>Loading booking...</p>
                </div>
            </main>
        );
    }

    if (error || !booking) {
        return (
            <main className="booking-details-page">
                <div className="booking-details-container">
                    <Link
                        href="/account/bookings"
                        className="back-link"
                    >
                        ← Back to bookings
                    </Link>

                    <div className="booking-details-error">
                        {error || "Booking not found."}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="booking-details-page">
            <div className="booking-details-container">
                <Link
                    href="/account/bookings"
                    className="back-link"
                >
                    ← Back to bookings
                </Link>

                <div className="booking-details-header">
                    <div>
                        <span className="booking-label">
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
                        className={`booking-status ${booking.status.toLowerCase()}`}
                    >
                        {booking.status}
                    </span>
                </div>

                <div className="booking-details-grid">
                    <section className="booking-details-card">
                        <h2>Service</h2>

                        <div className="detail-item">
                            <span>Service</span>
                            <strong>
                                {booking.service.name}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Description</span>
                            <p>
                                {booking.service.description}
                            </p>
                        </div>

                        <div className="detail-item">
                            <span>Service fee</span>
                            <strong>
                                MK{booking.fee}
                            </strong>
                        </div>
                    </section>

                    <section className="booking-details-card">
                        <h2>Provider</h2>

                        <div className="detail-item">
                            <span>Name</span>
                            <strong>
                                {booking.provider.name}
                            </strong>
                        </div>

                        {booking.provider.title && (
                            <div className="detail-item">
                                <span>Title</span>
                                <strong>
                                    {booking.provider.title}
                                </strong>
                            </div>
                        )}

                        <div className="detail-item">
                            <span>Email</span>
                            <strong>
                                {booking.provider.email}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Phone</span>
                            <strong>
                                {booking.provider.phone}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Location</span>
                            <strong>
                                {booking.provider.location}
                            </strong>
                        </div>
                    </section>

                    <section className="booking-details-card">
                        <h2>Your booking information</h2>

                        <div className="detail-item">
                            <span>Name</span>
                            <strong>{booking.name}</strong>
                        </div>

                        <div className="detail-item">
                            <span>Email</span>
                            <strong>{booking.email}</strong>
                        </div>

                        <div className="detail-item">
                            <span>Phone</span>
                            <strong>{booking.phone}</strong>
                        </div>

                        <div className="detail-item">
                            <span>Service location</span>
                            <strong>
                                {booking.location}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Preferred date</span>
                            <strong>
                                {booking.preferredDate
                                    ? new Date(
                                          booking.preferredDate
                                      ).toLocaleDateString()
                                    : "Not specified"}
                            </strong>
                        </div>
                    </section>

                    {booking.message && (
                        <section className="booking-details-card">
                            <h2>Your message</h2>

                            <p className="booking-message">
                                {booking.message}
                            </p>
                        </section>
                    )}

                    {booking.status === "COMPLETED" && (
                        <section className="booking-details-card">
                            {booking.review ? (
                                <>
                                    <h2>Your review</h2>

                                    <div className="detail-item">
                                        <span>Rating</span>

                                        <strong>
                                            {"★".repeat(
                                                booking.review.rating
                                            )}
                                            {"☆".repeat(
                                                5 -
                                                    booking.review
                                                        .rating
                                            )}
                                        </strong>
                                    </div>

                                    {booking.review.comment && (
                                        <div className="detail-item">
                                            <span>
                                                Your comment
                                            </span>

                                            <p>
                                                {
                                                    booking.review
                                                        .comment
                                                }
                                            </p>
                                        </div>
                                    )}

                                    <div className="detail-item">
                                        <span>
                                            Reviewed on
                                        </span>

                                        <strong>
                                            {new Date(
                                                booking.review.createdAt
                                            ).toLocaleDateString()}
                                        </strong>
                                    </div>
                                </>
                            ) : (
                                <ServiceReviewForm
                                    serviceId={
                                        booking.service.id
                                    }
                                    bookingId={booking.id}
                                />
                            )}
                        </section>
                    )}
                </div>
            </div>
        </main>
    );
}