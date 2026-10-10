import Link from "next/link";
import "./styles/specialOffers.css";

export default function SpecialOffers() {
    return (
        <section className="special-offers">

            <div className="special-offers-content">

                <div className="special-offers-text">
                    <span className="special-offers-label">
                        SPECIAL OFFERS
                    </span>

                    <h2>
                        Great deals are waiting
                    </h2>

                    <p>
                        Discover selected products and enjoy
                        special prices while they last.
                    </p>

                    <Link
                        href="/offers"
                        className="special-offers-button"
                    >
                        Shop Offers
                        <span>→</span>
                    </Link>
                </div>

                <div className="special-offers-decoration">
                    <span>SALE</span>
                </div>

            </div>

        </section>
    );
}