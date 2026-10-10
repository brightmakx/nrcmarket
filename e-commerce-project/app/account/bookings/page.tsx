"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./bookings.css";

type Booking = {
    id: number;
    name: string;
    email: string;
    phone: string;
    location: string;
    preferredDate: string | null;
    message: string | null;
    fee: number | string;
    status: "REQUESTED" | "ACCEPTED" | "CANCELLED";
    createdAt: string;
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
    };
};

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchBookings() {
            try {
                const res = await fetch("/api/bookings");

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

        fetchBookings();
    }, []);

    if (loading) {
        return (
            <main className="bookings-page">
                <div className="bookings-container">
                    <h1>My Bookings</h1>
                    <p>Loading bookings...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="bookings-page">
                <div className="bookings-container">
                    <h1>My Bookings</h1>
                    <p className="bookings-error">{error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="bookings-page">
            <div className="bookings-container">
                <div className="bookings-header">
                    <div>
                        <h1>My Bookings</h1>
                        <p>
                            View and track your service booking
                            requests.
                        </p>
                    </div>

                    <Link
                        href="/service"
                        className="browse-services-btn"
                    >
                        Browse Services
                    </Link>
                </div>

                {bookings.length === 0 ? (
                    <div className="no-bookings">
                        <h2>No bookings yet</h2>
                        <p>
                            You have not requested any services
                            yet.
                        </p>

                        <Link
                            href="/service"
                            className="browse-services-btn"
                        >
                            Find a Service
                        </Link>
                    </div>
                ) : (
                    <div className="bookings-list">
                        {bookings.map((booking) => (
                            <article
                                key={booking.id}
                                className="booking-card"
                            >
                                <div className="booking-card-top">
                                    <div>
                                        <span className="booking-label">
                                            Service
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

                                <div className="booking-card-details">
                                    <div>
                                        <span className="booking-label">
                                            Provider
                                        </span>
                                        <strong>
                                            {booking.provider.name}
                                        </strong>
                                    </div>

                                    <div>
                                        <span className="booking-label">
                                            Fee
                                        </span>
                                        <strong>
                                            MK{booking.fee}
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
                                </div>

                                {booking.message && (
                                    <div className="booking-message">
                                        <span className="booking-label">
                                            Message
                                        </span>
                                        <p>
                                            {booking.message}
                                        </p>
                                    </div>
                                )}

                                <div className="booking-card-footer">
                                    <span>
                                        Requested{" "}
                                        {new Date(
                                            booking.createdAt
                                        ).toLocaleDateString()}
                                    </span>

                                    <Link
                                        href={`/account/bookings/${booking.id}`}
                                        className="view-booking-btn"
                                    >
                                        View Booking
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