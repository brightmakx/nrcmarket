"use client";

import { useState } from "react";
import "./booking.css";

type BookingFormProps = {
    serviceId: number;
    serviceName: string;
    providerName: string;
    fee?: number | string;
    user: {
        name: string;
        email: string;
        phone: string;
        location: string;
    };
};

export default function BookingForm({
    serviceId,
    serviceName,
    providerName,
    fee,
    user,
}: BookingFormProps) {
    const [open, setOpen] = useState(false);

    const [name, setName] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");
    const [phone, setPhone] = useState(user.phone || "");
    const [location, setLocation] = useState(user.location || "");
    const [date, setDate] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function openBookingForm() {
        setError("");
        setOpen(true);
    }

    function closeBookingForm() {
        if (loading) return;

        setError("");
        setOpen(false);
    }

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setError("");

        if (!name || !email || !phone || !location) {
            setError(
                "Please complete your contact information."
            );
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    serviceId,
                    name,
                    email,
                    phone,
                    location,
                    preferredDate: date || null,
                    message: message || null,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(
                    result.message ||
                        "Failed to request booking."
                );
                return;
            }

            alert("Booking request sent successfully.");

            setDate("");
            setMessage("");
            setOpen(false);

        } catch {
            setError(
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    if (!open) {
        return (
            <button
                type="button"
                className="booking"
                onClick={openBookingForm}
            >
                Request Booking
            </button>
        );
    }

    return (
        <div className="booking-form-container">
            <div className="booking-form-header">
                <h2>Request Booking</h2>

                <p>
                    Request <strong>{serviceName}</strong> from{" "}
                    <strong>{providerName}</strong>.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="booking-form"
            >
                <div className="booking-service-summary">
                    <div>
                        <span>Service</span>
                        <strong>{serviceName}</strong>
                    </div>

                    <div>
                        <span>Provider</span>
                        <strong>{providerName}</strong>
                    </div>

                    {fee !== undefined && (
                        <div>
                            <span>Service fee</span>
                            <strong>MK{fee}</strong>
                        </div>
                    )}
                </div>

                <h3>Your information</h3>

                <div className="booking-form-grid">
                    <div className="booking-field">
                        <label htmlFor="booking-name">
                            Name
                        </label>

                        <input
                            id="booking-name"
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="booking-field">
                        <label htmlFor="booking-email">
                            Email
                        </label>

                        <input
                            id="booking-email"
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="booking-field">
                        <label htmlFor="booking-phone">
                            Phone
                        </label>

                        <input
                            id="booking-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="booking-field">
                        <label htmlFor="booking-location">
                            Location
                        </label>

                        <input
                            id="booking-location"
                            type="text"
                            value={location}
                            onChange={(e) =>
                                setLocation(e.target.value)
                            }
                            placeholder="Where should the service be provided?"
                            required
                        />
                    </div>
                </div>

                <h3>Booking details</h3>

                <div className="booking-field">
                    <label htmlFor="booking-date">
                        Preferred date{" "}
                        <span>(optional)</span>
                    </label>

                    <input
                        id="booking-date"
                        type="date"
                        value={date}
                        min={
                            new Date()
                                .toISOString()
                                .split("T")[0]
                        }
                        onChange={(e) =>
                            setDate(e.target.value)
                        }
                    />
                </div>

                <div className="booking-field">
                    <label htmlFor="booking-message">
                        Message <span>(optional)</span>
                    </label>

                    <textarea
                        id="booking-message"
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        placeholder="Tell the provider what you need..."
                        rows={5}
                    />
                </div>

                {error && (
                    <p className="booking-form-error">
                        {error}
                    </p>
                )}

                <div className="booking-form-actions">
                    <button
                        type="button"
                        className="booking-cancel-btn"
                        disabled={loading}
                        onClick={closeBookingForm}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="booking-submit-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Sending..."
                            : "Request Booking"}
                    </button>
                </div>
            </form>
        </div>
    );
}