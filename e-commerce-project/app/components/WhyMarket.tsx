import "./styles/whyMarket.css";

export default function WhyMarket() {
    return (
        <section className="why-market">

            <div className="why-market-header">
                <span>WHY MARKET?</span>

                <h2>
                    Everything you need, in one place
                </h2>

                <p>
                    Shop products, discover services, and connect
                    with providers through one simple marketplace.
                </p>
            </div>

            <div className="why-market-items">

                <div className="why-market-item">
                    <div className="why-market-icon">
                        ✓
                    </div>

                    <div>
                        <h3>Easy Shopping</h3>

                        <p>
                            Find the products you need and order
                            them with ease.
                        </p>
                    </div>
                </div>

                <div className="why-market-item">
                    <div className="why-market-icon">
                        ✓
                    </div>

                    <div>
                        <h3>Local Services</h3>

                        <p>
                            Discover useful services from providers
                            around you.
                        </p>
                    </div>
                </div>

                <div className="why-market-item">
                    <div className="why-market-icon">
                        ✓
                    </div>

                    <div>
                        <h3>Simple Delivery</h3>

                        <p>
                            Get your orders delivered without
                            unnecessary complexity.
                        </p>
                    </div>
                </div>

                <div className="why-market-item">
                    <div className="why-market-icon">
                        ✓
                    </div>

                    <div>
                        <h3>One Marketplace</h3>

                        <p>
                            Products and services brought together
                            in one convenient place.
                        </p>
                    </div>
                </div>

            </div>

        </section>
    );
}