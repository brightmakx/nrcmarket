import { productEntityType } from "@/app/types/productTypes";
import Product from "../product/product";
import "../styles/latestProducts.css";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LatestProducts() {
    //loading products from api
    const h = await headers();

    const res = await fetch(
        "http://localhost:3000/api/products?order=desc&limit=14",
        {
            headers: {
                cookie: h.get("cookie") ?? "",
            },
        }
    );

    if (res.status === 401) {
        redirect("/login");
    }

    const dt = await res.json();
    const data: productEntityType[] = dt.data;

    return (
        <section className="latest">

            {/* =========================================================
            SECTION HEADER
            ========================================================= */}

            <div className="latest-header">
                <h3>Latest Products</h3>

                <Link
                    href="/all"
                    className="latest-view-all"
                >
                    View all <span>→</span>
                </Link>
            </div>

            {/* =========================================================
            PRODUCT GRID
            ========================================================= */}

            <div className="latest-products">

                {data.map((x: any) => (

                    <div
                        key={x.id}
                        className={
                            x.onOffer
                                ? "latest-product-offer"
                                : "latest-product"
                        }
                    >

                        {x.onOffer && (
                            <span className="latest-offer-badge">
                                OFFER
                            </span>
                        )}

                        <Product
                            description={x.description}
                            name={x.name}
                            image={`/images/${x.imageUrl}`}
                            price={x.price}
                            rate={x.rating}
                            id={x.id}
                        />

                    </div>

                ))}

            </div>

        </section>
    );
}