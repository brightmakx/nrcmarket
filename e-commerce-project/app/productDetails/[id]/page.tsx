
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import ProductManagementButtons from "./productManagementButtons";
import ProductQuantity from "../productQuantity";
import "./productDetails.css";
import ProductReviews from "./productReviews";

export default async function ProductDetails({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId <= 0) {
        notFound();
    }

    const h = await headers();

    // =========================
    // PRODUCT
    // =========================

    const res = await fetch(
        `http://localhost:3000/api/products?id=${productId}`,
        {
            headers: {
                cookie: h.get("cookie") ?? "",
            },
            cache: "no-store",
        }
    );

    let product;

    if (res.ok) {
        const data = await res.json();
        product = data.data;
    }

    if (!product) {
        notFound();
    }

    // =========================
    // REVIEWS
    // =========================

    const reviewsRes = await fetch(
        `http://localhost:3000/api/products/reviews?productId=${productId}`,
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
        const data = await reviewsRes.json();
        reviewsData = data.data;
    }

    // =========================
    // PRODUCT DATA
    // =========================

    const price = Number(product.price);
    const rating = Number(
        reviewsData.rating ?? product.rating ?? 0
    );

    const imageSrc = product.imageUrl.startsWith("/")
        ? product.imageUrl
        : `/images/${product.imageUrl}`;

    return (
        <main className="product-details-page">
            <Link href="/" className="back-button">
                ← Back to Products
            </Link>

            <div className="product-details-card">
                {/* IMAGE */}

                <div className="details-image-container">
                    <Image
                        src={imageSrc}
                        alt={product.name}
                        width={500}
                        height={500}
                        priority
                        className="details-image"
                    />
                </div>

                {/* PRODUCT INFORMATION */}

                <div className="details-info">
                    <p className="details-category">
                        {product.category.name}
                    </p>

                    <h1 className="details-name">
                        {product.name}
                    </h1>

                    {/* RATING */}

                    <p className="details-rating">
                        {"★".repeat(
                            Math.min(5, Math.round(rating))
                        )}

                        {"☆".repeat(
                            Math.max(0, 5 - Math.round(rating))
                        )}

                        <span>
                            {" "}
                            ({rating.toFixed(1)}/5)
                        </span>
                    </p>

                    {/* PRICE */}

                    <p className="details-price">
                        ${price.toFixed(2)}
                    </p>

                    {/* DESCRIPTION */}

                    <div className="details-description">
                        <h3>Description</h3>

                        <p>
                            {product.description ||
                                "No description is available for this product."}
                        </p>
                    </div>

                    {/* STOCK */}

                    <div className="stock">
                        {product.quantity > 0 ? (
                            <span className="in-stock">
                                ● In Stock ({product.quantity} available)
                            </span>
                        ) : (
                            <span className="out-stock">
                                ● Out of Stock
                            </span>
                        )}
                    </div>

                    {/* QUANTITY AND ADD TO CART */}

                    {product.quantity > 0 && (
                        <ProductQuantity
                            product={{
                                id: productId,
                                name: product.name,
                                price,
                                image: imageSrc,
                                stock: product.quantity,
                            }}
                        />
                    )}

                    {/* PRODUCT MANAGEMENT */}

                    {product.owner && (
                        <ProductManagementButtons
                            productId={productId}
                            productName={product.name}
                            onOffer={product.onOffer}
                        />
                    )}
                </div>
            </div>

            {/* =========================
                REVIEWS
            ========================= */}

            <ProductReviews
                productId={productId}
                reviews={reviewsData.reviews}
                rating={Number(reviewsData.rating)}
                reviewCount={reviewsData.reviewCount}
            />
        </main>
    );
}

