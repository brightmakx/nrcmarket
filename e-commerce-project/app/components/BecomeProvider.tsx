import Link from "next/link";
import "./styles/becomeProvider.css";

export default function BecomeProvider() {
    return (
        <section className="become-provider">

            <div className="become-provider-content">

                <div className="become-provider-text">

                    <span className="become-provider-label">
                        FOR SERVICE PROVIDERS
                    </span>

                    <h2>
                        Turn your skills into opportunities
                    </h2>

                    <p>
                        Offer your services on Market and connect
                        with people looking for the skills you provide.
                    </p>

                    <Link
                        href="/account/become-provider"
                        className="become-provider-button"
                    >
                        Become a Provider
                        <span>→</span>
                    </Link>

                </div>

                <div className="become-provider-shape">
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                </div>

            </div>

        </section>
    );
}