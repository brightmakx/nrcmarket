
"use client";

import Link from "next/link";
import "./about.css";

export default function AboutPage() {
    return (
        <main className="about-page">

            {/* Hero */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <span className="about-badge">ABOUT OUR MARKETPLACE</span>

                    <h1>
                        Everything you need,
                        <span> all in one place.</span>
                    </h1>

                    <p>
                        Welcome to our marketplace — a simple and convenient
                        platform where you can discover products, explore
                        services, and get the help you need.
                    </p>

                    <div className="about-hero-buttons">
                        <Link href="/categoriesHome" className="about-primary-btn">
                            Explore Products
                        </Link>

                        <Link href="/service" className="about-secondary-btn">
                            Explore Services
                        </Link>
                    </div>
                </div>

                <div className="about-hero-card">
                    <div className="about-card-icon">🛍️</div>
                    <h3>One Marketplace</h3>
                    <p>
                        Products, services and customer support brought
                        together in one convenient platform.
                    </p>
                </div>
            </section>



            {/* Mission */}
            <section className="about-mission">
                <div className="mission-content">
                    <span>OUR MISSION</span>

                    <h2>
                        Making digital commerce
                        <br />
                        simple and accessible.
                    </h2>

                    <p>
                        We want to connect customers with useful products and
                        services while providing a smooth, friendly and
                        reliable online experience.
                    </p>
                </div>
            </section>


            {/* What we offer */}
            <section className="about-section">
                <div className="section-heading center">
                    <span>WHAT WE OFFER</span>
                    <h2>More than just a marketplace</h2>
                    <p>
                        Everything is designed around making the customer
                        experience easier.
                    </p>
                </div>

                <div className="about-features">

                    <div className="about-feature-card">
                        <div className="feature-icon">🛒</div>
                        <h3>Products</h3>
                        <p>
                            Browse different categories and discover products
                            that match your needs.
                        </p>

                        <Link href="/categoriesHome">
                            Browse products →
                        </Link>
                    </div>

                    <div className="about-feature-card">
                        <div className="feature-icon">⚙️</div>
                        <h3>Services</h3>
                        <p>
                            Explore useful services available through our
                            platform.
                        </p>

                        <Link href="/service">
                            View services →
                        </Link>
                    </div>

                    <div className="about-feature-card">
                        <div className="feature-icon">🤖</div>
                        <h3>AI Assistant</h3>
                        <p>
                            Get quick answers to common questions with our
                            built-in AI assistant.
                        </p>

                        <Link href="/chatbot">
                            Chat with AI →
                        </Link>
                    </div>

                    <div className="about-feature-card">
                        <div className="feature-icon">💬</div>
                        <h3>Customer Help</h3>
                        <p>
                            Find answers and get assistance whenever you need
                            help using the platform.
                        </p>

                        <Link href="/help">
                            Get help →
                        </Link>
                    </div>

                </div>
            </section>



            {/* Why choose us */}
            <section className="about-section">
                <div className="why-grid">

                    <div className="why-content">
                        <span>WHY CHOOSE US</span>

                        <h2>
                            Designed around
                            <br />
                            your experience.
                        </h2>

                        <p>
                            We focus on creating a marketplace that is easy to
                            navigate, useful and continuously improving.
                        </p>

                        <ul>
                            <li>
                                <span>✓</span>
                                Easy-to-use marketplace
                            </li>

                            <li>
                                <span>✓</span>
                                Products and services in one place
                            </li>

                            <li>
                                <span>✓</span>
                                Helpful customer support
                            </li>

                            <li>
                                <span>✓</span>
                                AI-powered assistance
                            </li>
                        </ul>
                    </div>

                    <div className="why-card">
                        <div className="why-card-top">
                            <span>MARKETPLACE</span>
                            <span>✦</span>
                        </div>

                        <h3>
                            Discover.
                            <br />
                            Choose.
                            <br />
                            Enjoy.
                        </h3>

                        <p>
                            A better way to discover what you need.
                        </p>
                    </div>

                </div>
            </section>

{/* Developers */}

<section className="developers-section">

    <div className="section-heading center">
        <span>MEET THE TEAM</span>

        <h2>
            The developers behind
            <br />
            the marketplace.
        </h2>

        <p>
            Our platform is built by developers who work together to create
            a simple, useful and reliable marketplace experience.
        </p>
    </div>

    <div className="developers-grid">

        <div className="developer-card">

            <div className="developer-avatar">
                👨‍💻
            </div>

            <div className="developer-info">
                <h3>BRIGHT MAKOPA</h3>

                <span className="developer-role">
                    Lead Developer
                </span>

                <p>
                    Responsible for the overall development of the platform,
                    application architecture, core features and integration
                    between the frontend, backend and database.
                </p>
            </div>

        </div>


        <div className="developer-card">

            <div className="developer-avatar">
                🎨
            </div>

            <div className="developer-info">
                <h3>BRIGHT MAKOPA</h3>

                <span className="developer-role">
                    Frontend Developer
                </span>

                <p>
                    Responsible for creating the user interface, responsive
                    layouts, navigation and overall user experience of the
                    marketplace.
                </p>
            </div>

        </div>


        <div className="developer-card">

            <div className="developer-avatar">
                ⚙️
            </div>

            <div className="developer-info">
                <h3>EDWARD MANDA</h3>

                <span className="developer-role">
                    Backend Developer
                </span>

                <p>
                    Responsible for APIs, authentication, database operations,
                    server-side functionality and the application's backend
                    infrastructure.
                </p>
            </div>

        </div>


        <div className="developer-card">

            <div className="developer-avatar">
                🤖
            </div>

            <div className="developer-info">
                <h3>BRIGHT MAKOPA</h3>

                <span className="developer-role">
                    AI Developer
                </span>

                <p>
                    Responsible for the AI assistant, frequently asked
                    questions, chatbot functionality and intelligent
                    customer support features.
                </p>
            </div>

        </div>

    </div>

</section>


            {/* CTA */}
            <section className="about-cta">
                <div>
                    <span>START EXPLORING</span>

                    <h2>
                        Find what you need,
                        <br />
                        right here.
                    </h2>

                    <p>
                        Explore our marketplace and discover products,
                        services and helpful tools.
                    </p>

                    <div className="cta-buttons">
                        <Link href="/categoriesHome">
                            Start Shopping
                        </Link>

                        <Link href="/chatbot">
                            Ask our AI
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}

