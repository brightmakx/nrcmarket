import { headers } from "next/headers";
import Link from "next/link";
import Product from "../components/product/product";
import "./offers.css";

export default async function OffersPage() {

    const h = await headers();

    const response = await fetch(
        "http://localhost:3000/api/products?onOffer=true&limit=10&page=1",
        {
            headers: {
                cookie: h.get("cookie") ?? "",
            },
            cache: "no-store",
        }
    );

    if (!response.ok) {
        return (
            <main className="offers-page">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="offers-header">

                    <Link
                        href="/"
                        className="offers-back"
                    >
                        ← Back
                    </Link>

                    <h1>
                        Offers
                    </h1>

                    <p>
                        Discover products currently
                        available on offer.
                    </p>

                </div>


                {/* =========================
                    ERROR
                ========================= */}

                <div className="offers-message">

                    <h2>
                        Failed to load offers
                    </h2>

                    <p>
                        Please try again later.
                    </p>

                </div>

            </main>
        );
    }

    const result = await response.json();

    const products = result.data || [];


    return (
        <main className="offers-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="offers-header">

                <Link
                    href="/"
                    className="offers-back"
                >
                    ← Back
                </Link>

                <h1>
                    Offers
                </h1>

                <p>
                    Discover products currently
                    available on offer.
                </p>

            </div>


            {/* =========================
                PRODUCTS
            ========================= */}

            <div className="offers-section-header">

                <h2 className="offers-section-title">
                    Special Offers
                </h2>

                <span className="offers-count">
                    {products.length}{" "}
                    {products.length === 1
                        ? "Product"
                        : "Products"}
                </span>

            </div>


            {products.length === 0 ? (

                <div className="offers-message">

                    <h2>
                        No offers available
                    </h2>

                    <p>
                        There are currently no
                        products on offer.
                        Check back soon.
                    </p>

                </div>

            ) : (

                <div className="offers-grid">

                    {products.map(
                        (product: any) => {

                            const image =
                                product.imageUrl.startsWith(
                                    "/"
                                )
                                    ? product.imageUrl
                                    : `/images/${product.imageUrl}`;

                            return (
                                <div
                                    key={product.id}
                                    className="offer-product"
                                >

                                    {/* OFFER BADGE */}

                                    <span className="offer-badge">
                                        Offer
                                    </span>

                                    <Product
                                        id={product.id}
                                        name={product.name}
                                        image={image}
                                        price={Number(
                                            product.price
                                        )}
                                        rate={Number(
                                            product.rating
                                        )}
                                        description={
                                            product.description ||
                                            ""
                                        }
                                    />

                                </div>
                            );
                        }
                    )}

                </div>

            )}

        </main>
    );
}