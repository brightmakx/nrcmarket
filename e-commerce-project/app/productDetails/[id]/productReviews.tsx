"use client";

import { useState } from "react";

type Review = {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        name: string;
        image: string | null;
    };
};

export default function ProductReviews({
    productId,
    reviews: initialReviews,
    rating: initialRating,
    reviewCount: initialReviewCount,
}: {
    productId: number;
    reviews: Review[];
    rating: number;
    reviewCount: number;
}) {
    const [reviews, setReviews] =
        useState<Review[]>(initialReviews);

    const [rating, setRating] =
        useState(initialRating);

    const [reviewCount, setReviewCount] =
        useState(initialReviewCount);

    const [selectedRating, setSelectedRating] =
        useState(0);

    const [comment, setComment] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    async function submitReview(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (selectedRating < 1) {
            setError("Please select a rating.");
            return;
        }

        if (!comment.trim()) {
            setError("Please enter a comment.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "/api/products/reviews",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        productId,
                        rating: selectedRating,
                        comment: comment.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.error ||
                    "Failed to submit review."
                );
                return;
            }

            const newReview = data.data.review;

            setReviews((current) => [
                newReview,
                ...current,
            ]);

            setRating(data.data.rating);
            setReviewCount(
                data.data.reviewCount
            );

            setSelectedRating(0);
            setComment("");

            setSuccess(
                "Your review has been submitted."
            );

        } catch {
            setError(
                "Something went wrong while submitting your review."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="product-reviews">

            <div className="reviews-header">

                <div>
                    <h2>Customer Reviews</h2>

                    <p>
                        {reviewCount}{" "}
                        {reviewCount === 1
                            ? "review"
                            : "reviews"}
                    </p>
                </div>

                <div className="reviews-summary">

                    <strong>
                        {rating.toFixed(1)}
                    </strong>

                    <div>
                        <div className="summary-stars">
                            {"★".repeat(
                                Math.round(rating)
                            )}
                            {"☆".repeat(
                                5 - Math.round(rating)
                            )}
                        </div>

                        <span>
                            Average rating
                        </span>
                    </div>

                </div>

            </div>


            {/* REVIEW FORM */}

            <form
                className="review-form"
                onSubmit={submitReview}
            >

                <h3>
                    Leave a Review
                </h3>

                <div className="rating-selector">

                    <span>Your rating</span>

                    <div className="rating-stars">

                        {[1, 2, 3, 4, 5].map(
                            (star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={
                                        star <=
                                        selectedRating
                                            ? "selected"
                                            : ""
                                    }
                                    onClick={() =>
                                        setSelectedRating(
                                            star
                                        )
                                    }
                                    aria-label={`${star} star`}
                                >
                                    ★
                                </button>
                            )
                        )}

                    </div>

                </div>


                <textarea
                    value={comment}
                    onChange={(e) =>
                        setComment(
                            e.target.value
                        )
                    }
                    placeholder="Share your experience with this product..."
                    rows={5}
                />


                {error && (
                    <div className="review-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="review-success">
                        {success}
                    </div>
                )}


                <button
                    type="submit"
                    className="review-submit"
                    disabled={loading}
                >
                    {loading
                        ? "Submitting..."
                        : "Submit Review"}
                </button>

            </form>


            {/* REVIEWS */}

            <div className="reviews-list">

                {reviews.length === 0 ? (

                    <div className="no-reviews">
                        <h3>
                            No reviews yet
                        </h3>

                        <p>
                            Be the first customer
                            to review this product.
                        </p>
                    </div>

                ) : (

                    reviews.map((review) => (

                        <article
                            className="review-item"
                            key={review.id}
                        >

                            <div className="review-user">

                                <div className="review-avatar">
                                    {review.user.name
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <strong>
                                        {review.user.name}
                                    </strong>

                                    <span>
                                        {review.createdAt}
                                    </span>
                                </div>

                            </div>


                            <div className="review-rating">
                                {"★".repeat(
                                    review.rating
                                )}
                                {"☆".repeat(
                                    5 - review.rating
                                )}
                            </div>


                            <p>
                                {review.comment}
                            </p>

                        </article>

                    ))

                )}

            </div>

        </section>
    );
}