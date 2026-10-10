"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import "./review.css";

export default function ServiceReviewForm({
    serviceId,
    bookingId,
}: {
    serviceId: number;
    bookingId: number;
}) {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);

    async function submitReview() {
        if (!rating) {
            toast.error("Please select a rating");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/services/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    serviceId,
                    bookingId,
                    rating,
                    review,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(
                    result.message ||
                        "Failed to submit review"
                );
                return;
            }

            toast.success(
                "Review submitted successfully"
            );

            setRating(0);
            setReview("");

            window.location.reload();
        } catch {
            toast.error(
                "Failed to submit review"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="service-review-form">
            <h3>Rate this service</h3>

            <div className="review-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        disabled={loading}
                    >
                        <span
                            className={
                                star <= rating
                                    ? "star filled"
                                    : "star"
                            }
                        >
                            ★
                        </span>
                    </button>
                ))}
            </div>

            <textarea
                value={review}
                onChange={(e) =>
                    setReview(e.target.value)
                }
                placeholder="Write your review (optional)"
                maxLength={1000}
                disabled={loading}
            />

            <button
                type="button"
                onClick={submitReview}
                disabled={loading}
            >
                {loading
                    ? "Submitting..."
                    : "Submit Review"}
            </button>
        </div>
    );
}