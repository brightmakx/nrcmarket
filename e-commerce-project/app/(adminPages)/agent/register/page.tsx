
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./register.css";

type AgentForm = {
    name: string;
    email: string;
    phone: string;
    location: string;
};

export default function RegisterAgentPage() {
    const [form, setForm] = useState<AgentForm>({
        name: "",
        email: "",
        phone: "",
        location: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchingUser, setFetchingUser] = useState(true);
    const [submitted, setSubmitted] = useState(false);

    // Load the existing user's details
    useEffect(() => {
        async function fetchUserData() {
            try {
                const res = await fetch("/api/users", {
                    cache: "no-store",
                });

                if (!res.ok) {
                    setMessage(
                        res.status === 401
                            ? "Please log in to register as an agent."
                            : "Failed to load your account details."
                    );
                    return;
                }

                const result = await res.json();
                const user = result.data ?? result;

                setForm({
                    name: user.name ?? "",
                    email: user.email ?? "",
                    phone: user.phone ?? "",
                    location: user.location ?? "",
                });
            } catch {
                setMessage("Unable to load your account details.");
            } finally {
                setFetchingUser(false);
            }
        }

        fetchUserData();
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        setMessage("");
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setMessage("");

        try {
            const res = await fetch("/api/agents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const result = await res.json();

            if (!res.ok) {
                if (result.errors) {
                    const formatted: Record<string, string> = {};

                    if (Array.isArray(result.errors)) {
                        result.errors.forEach(
                            (error: {
                                path?: (string | number)[];
                                message: string;
                            }) => {
                                const field = error.path?.[0];

                                if (field) {
                                    formatted[String(field)] = error.message;
                                }
                            }
                        );
                    } else if (typeof result.errors === "object") {
                        Object.entries(result.errors).forEach(([field, error]) => {
                            formatted[field] =
                                typeof error === "string"
                                    ? error
                                    : JSON.stringify(error);
                        });
                    }

                    setErrors(formatted);
                    setMessage("Please correct the highlighted fields.");
                } else {
                    setMessage(
                        result.error ||
                            (res.status === 401
                                ? "Please log in to register as an agent."
                                : "Agent registration failed.")
                    );
                }

                return;
            }

            setSubmitted(true);
        } catch {
            setMessage("Unable to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (fetchingUser) {
        return (
            <main className="agent-register-page">
                <p>Loading your account details...</p>
            </main>
        );
    }

    if (submitted) {
        return (
            <main className="agent-register-page">
                <section className="agent-register-card agent-register-success">
                    <div className="agent-success-icon">✓</div>
                    <h1>Registration Successful</h1>
                    <p>Your agent registration has been submitted successfully.</p>
                    <Link href="/account" className="agent-back-link">
                        Back to Account
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="agent-register-page">
            <section className="agent-register-card">
                <Link href="/account" className="agent-back-link">
                    ← Back to Account
                </Link>

                <div className="agent-register-heading">
                    <h1>Become a seller</h1>
                    <p>
                        Your existing account details are filled in below.
                        Review them and complete your registration.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="agent-register-form"
                >
                    <div className="agent-form-field">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                        {errors.name && (
                            <span className="agent-field-error">
                                {errors.name}
                            </span>
                        )}
                    </div>

                    <div className="agent-form-field">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                        {errors.email && (
                            <span className="agent-field-error">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    <div className="agent-form-field">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            required
                        />
                        {errors.phone && (
                            <span className="agent-field-error">
                                {errors.phone}
                            </span>
                        )}
                    </div>

                    <div className="agent-form-field">
                        <label htmlFor="location">Location</label>
                        <input
                            id="location"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="Enter your location"
                            required
                        />
                        {errors.location && (
                            <span className="agent-field-error">
                                {errors.location}
                            </span>
                        )}
                    </div>

                    {message && (
                        <p
                            className={`agent-form-message ${
                                Object.keys(errors).length
                                    ? "failure"
                                    : "failure"
                            }`}
                            role="alert"
                        >
                            {message}
                        </p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Registering..." : "Register as Seller"}
                    </button>
                </form>
            </section>
        </main>
    );
}