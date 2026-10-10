"use client";

import "./styles/services.css";
import Link from "next/link";
import Image from "next/image";

export default function Service({
    image,
    serviceImage,
    name,
    id,
    providerName,
    providerRating
}: {
    image: string;
    serviceImage?: string;
    name: string;
    id: number;
    providerName?: string;
    providerRating?: number | string;
}) {

    const rating = Number(providerRating || 0);

    const serviceImageSrc = serviceImage
        ? serviceImage.startsWith("/")
            ? serviceImage
            : `/images/${serviceImage}`
        : "/images/service_fallback.png";

    const providerImageSrc = image
        ? image.startsWith("/")
            ? image
            : `/images/${image}`
        : "/images/service_fallback.png";

    return (
        <div className="service">

            <div className="service-image">
                <Link href={`/service/${id}`}>
                     <Image
                    height={500}
                    width={800}
                    src={serviceImageSrc}
                    alt={name}
                    className="image"
                />
                </Link>
               

                <span className="more">
                    <Link href={`/service/${id}`}>
                        more
                    </Link>
                </span>

            </div>

            <div className="service-details">
                <h2>{name}</h2>
            </div>

            <div className="provider-profile">

                <div className="profile-image-container">

                    <Image
                        height={100}
                        width={100}
                        src={providerImageSrc}
                        alt={providerName || "Service provider"}
                        className="profile-image"
                    />

                </div>

                <div className="profile-details">

                    <p className="service-provider-name">
                        {providerName || "Provider"}
                    </p>

                    <div className="service-provider-rating">

                        <div className="service-rating-stars">

                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={
                                        star <= Math.round(rating)
                                            ? "service-rating-star filled"
                                            : "service-rating-star"
                                    }
                                >
                                    ★
                                </span>
                            ))}

                        </div>

                        <span className="service-rating-number">
                            {rating > 0 ? rating.toFixed(1) : "N/A"}
                        </span>

                    </div>

                </div>

            </div>

            <button className="book-now-btn">
                Book Now
            </button>

        </div>
    );
}