import { loginRedirect } from "@/lib/actions/redirects";
import "../../components/styles/services1.css";
import Image from "next/image";
import { headers } from "next/headers";
import ServiceMediaGallery from "./ServiceMediaGallery";
import BookingForm from "../booking/booking";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const h = await headers();

    const userRes = await fetch(`http://localhost:3000/api/users`, {
        headers: {
            cookie: h.get("cookie") ?? "",
        },
    });

    if (!userRes.ok) {
        loginRedirect();
    }

    const userResult = await userRes.json();
    const user = userResult.data;

    const res = await fetch(
        `http://localhost:3000/api/services?id=${id}`,
        {
            headers: {
                cookie: h.get("cookie") ?? "",
            },
        }
    );

    let data;

    if (!res.ok) {

    } else {
        const d = await res.json();
        data = d.data[0];
    }

    const reviewsRes = await fetch(
        `http://localhost:3000/api/services/reviews?serviceId=${id}`,
        {
            headers: {
                cookie: h.get("cookie") ?? "",
            },
            cache: "no-store",
        }
    );

    let reviewsData = {
        reviews: [],
        rating: 0,
        reviewCount: 0,
    };

    if (reviewsRes.ok) {
        const reviewsResult = await reviewsRes.json();
        reviewsData = reviewsResult.data;
    }

    if (data) {
        const conditions = data.conditions;

        return (
            <div className="service-detail-page">

                {/* =================================================
                   SERVICE HEADER
                ================================================= */}

                <div className="service-detail-header">

                    <h1 className="service-header">
                        {data.name}
                    </h1>

                </div>


                {/* =================================================
                   MAIN SERVICE AREA
                ================================================= */}

                <div className="service-main-area">

                    {/* SERVICE VIDEO */}

                    <div className="service-main-media">

    <ServiceMediaGallery
        images={data.serviceImages || []}
        videos={data.serviceVideos || []}
    />

</div>


                    {/* PROVIDER / BOOKING SIDEBAR */}

                    <div className="service-sidebar">

                        {/* PROVIDER PROFILE */}

                        <Provider
                            data={data}
                            rating={Number(reviewsData.rating)}
                        />


                        {/* SERVICE FEE + BOOKING */}

                        <div className="booking-section">

                            <div className="booking-price">

                                <span>
                                    Service fee
                                </span>

                                <strong>
                                    {data.fee
                                        ? `MK${data.fee}`
                                        : "Price not provided"
                                    }
                                </strong>

                            </div>


                            <div className="booking-actions">

                                <BookingForm
                                    serviceId={data.id}
                                    serviceName={data.name}
                                    providerName={
                                        data.provider?.name ||
                                        "Provider"
                                    }
                                    fee={data.fee}
                                    user={{
                                        name: user?.name || "",
                                        email: user?.email || "",
                                        phone: user?.phone || "",
                                        location: user?.location || "",
                                    }}
                                />
                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                   WHAT WE DO
                ================================================= */}

                <div className="service-introduction">

                    <div className="provider-section-header">
                        <h3>What we do</h3>
                    </div>

                    <div className="service-introduction-content">

                        <p className="service-description">
                            {data.description}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   SPECIFICATIONS + PROVIDER INFORMATION
                ================================================= */}

                <div className="service-details-grid">

                    {/* SPECIFICATIONS */}

                    <div className="service-specifications">

                        <div className="provider-section-header">
                            <h3>Specifications</h3>
                        </div>

                        <div className="specifications-content">

                            {conditions?.length > 0 ? (
                                <ul>

                                    {conditions.map((x: any) => {
                                        return (
                                            <li key={x}>
                                                {x}
                                            </li>
                                        );
                                    })}

                                </ul>
                            ) : (
                                <p className="empty-information">
                                    No specifications provided.
                                </p>
                            )}

                        </div>

                    </div>


                    {/* PROVIDER INFORMATION */}

                    <div className="provider-information">

                        <div className="provider-section-header">
                            <h3>Provider Information</h3>
                        </div>

                        <div className="provider-information-grid">

                            <div className="provider-information-item">

                                <span className="provider-information-icon">
                                    📍
                                </span>

                                <div>

                                    <span className="provider-information-label">
                                        Location
                                    </span>

                                    <p>
                                        {data.provider?.location ||
                                            "Not provided"}
                                    </p>

                                </div>

                            </div>


                            <div className="provider-information-item">

                                <span className="provider-information-icon">
                                    📞
                                </span>

                                <div>

                                    <span className="provider-information-label">
                                        Phone
                                    </span>

                                    <p>
                                        {data.provider?.phone ||
                                            "Not provided"}
                                    </p>

                                </div>

                            </div>


                            <div className="provider-information-item">

                                <span className="provider-information-icon">
                                    ✉
                                </span>

                                <div>

                                    <span className="provider-information-label">
                                        Email
                                    </span>

                                    <p>
                                        {data.provider?.email ||
                                            "Not provided"}
                                    </p>

                                </div>

                            </div>


                            <div className="provider-information-item">

                                <span className="provider-information-icon">
                                    🕐
                                </span>

                                <div>

                                    <span className="provider-information-label">
                                        Availability
                                    </span>

                                    <p>
                                        {data.provider?.availability ||
                                            "Not provided"}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                   SERVICE INFORMATION
                ================================================= */}

                <div className="service-information">

                    <div className="provider-section-header">
                        <h3>Service Information</h3>
                    </div>

                    <div className="service-information-grid">

                        <div>

                            <span>
                                Service fee
                            </span>

                            <strong>
                                {data.fee
                                    ? `MK${data.fee}`
                                    : "Price not provided"
                                }
                            </strong>

                        </div>
                        <div>

                            <span>
                                Service area
                            </span>

                            <strong>
                                {data.provider?.location ||
                                    "Not provided"}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================================
                   RATINGS
                ================================================= */}

                <Ratings
                    rating={Number(reviewsData.rating)}
                    reviewCount={reviewsData.reviewCount}
                    reviews={reviewsData.reviews}
                />

            </div>
        );
    }

    return null;
}


function Provider({
    data,
    rating,
}: {
    data: any;
    rating: number;
}) {

    return (
        <div className="provider">

            <div className="provider-profile-header">
                Service Provider Profile
            </div>


            <div className="provider-details-container">

                <div className="provider-profile-photo">

                    {data.providerImage ? (
                        <Image
                            width={100}
                            height={100}
                            src={`/images/${data.providerImage}`}
                            alt={
                                data.provider?.name ||
                                "Service provider"
                            }
                            className="provider-profile-image"
                        />
                    ) : (
                        <div className="provider-image-placeholder">
                            👤
                        </div>
                    )}

                </div>


                <div className="provider-details">

                    <h3 className="provider-name">
                        {data.provider?.name ||
                            "Provider"}
                    </h3>


                    <div className="provider-rating">

                        <div className="rating-stars">

                            {[1, 2, 3, 4, 5].map(
                                (star) => (
                                    <span
                                        key={star}
                                        className={
                                            star <=
                                            Math.round(
                                                rating
                                            )
                                                ? "star filled"
                                                : "star"
                                        }
                                    >
                                        ★
                                    </span>
                                )
                            )}

                        </div>

                        <span className="rating-number">
                            {rating.toFixed(1)}
                        </span>

                        <span className="rating-placeholder">
                            ({rating > 0 ? "reviews" : "no reviews"})
                        </span>

                    </div>


                    <p className="experience">
                        {data.provider?.title ||
                            "Professional service provider"}
                    </p>

                </div>

            </div>

        </div>
    );
}


function Ratings({
    rating,
    reviewCount,
    reviews,
}: {
    rating: number;
    reviewCount: number;
    reviews: any[];
}) {

    return (
        <div className="ratings-section">

            <div className="provider-section-header">

                <div>

                    <h3>
                        Ratings & Reviews
                    </h3>

                    <p>
                        See what customers think about
                        this provider.
                    </p>

                </div>

            </div>


            <div className="ratings-summary">

                <div className="overall-rating">

                    <strong>
                        {rating.toFixed(1)}
                    </strong>

                    <div className="rating-stars large">

                        {[1, 2, 3, 4, 5].map(
                            (star) => (
                                <span
                                    key={star}
                                    className={
                                        star <=
                                        Math.round(
                                            rating
                                        )
                                            ? "star filled"
                                            : "star"
                                    }
                                >
                                    ★
                                </span>
                            )
                        )}

                    </div>

                    <span>
                        {reviewCount}{" "}
                        {reviewCount === 1
                            ? "review"
                            : "reviews"}
                    </span>

                </div>


                <div className="rating-breakdown">

                    <RatingBar
                        label="5"
                        value={getRatingPercentage(
                            reviews,
                            5
                        )}
                    />

                    <RatingBar
                        label="4"
                        value={getRatingPercentage(
                            reviews,
                            4
                        )}
                    />

                    <RatingBar
                        label="3"
                        value={getRatingPercentage(
                            reviews,
                            3
                        )}
                    />

                    <RatingBar
                        label="2"
                        value={getRatingPercentage(
                            reviews,
                            2
                        )}
                    />

                    <RatingBar
                        label="1"
                        value={getRatingPercentage(
                            reviews,
                            1
                        )}
                    />

                </div>

            </div>


            {reviews.length > 0 ? (

                <div className="reviews-placeholder">

                    {reviews.map((review: any) => (

                        <div
                            key={review.id}
                            className="review"
                        >

                            <div className="review-header">

                                <strong>
                                    {review.user?.name ||
                                        "Customer"}
                                </strong>

                                <span>
                                    {review.rating}/5 ★
                                </span>

                            </div>

                            {review.comment && (
                                <p>
                                    {review.comment}
                                </p>
                            )}

                            <small>
                                {new Date(
                                    review.createdAt
                                ).toLocaleDateString()}
                            </small>

                        </div>

                    ))}

                </div>

            ) : (

                <div className="reviews-placeholder">

                    <div className="review-placeholder-icon">
                        ★
                    </div>

                    <h4>
                        Customer reviews are coming soon
                    </h4>

                    <p>
                        Once customers complete services,
                        they will be able to share their
                        experience and rate this provider.
                    </p>

                </div>

            )}

        </div>
    );
}


function getRatingPercentage(
    reviews: any[],
    rating: number
) {
    if (!reviews.length) {
        return 0;
    }

    const count = reviews.filter(
        (review) => review.rating === rating
    ).length;

    return Math.round(
        (count / reviews.length) * 100
    );
}


function RatingBar({
    label,
    value,
}: {
    label: string;
    value: number;
}) {

    return (
        <div className="rating-bar">

            <span>
                {label} ★
            </span>

            <div className="rating-bar-track">

                <div
                    className="rating-bar-fill"
                    style={{
                        width: `${value}%`,
                    }}
                />

            </div>

            <span>
                {value}%
            </span>

        </div>
    );
}
