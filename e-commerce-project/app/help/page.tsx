import Link from "next/link";
import "./help.css";

export default function HelpPage() {
    return (
        <main className="help-page">




            <section className="help-content">

                <div className="help-section-title">
                    <span>QUICK HELP</span>
                    <h2>What do you need help with?</h2>
                </div>


                <div className="help-grid">

                    <div className="help-card">
                        <div className="help-icon">🛍️</div>
                        <h3>Shopping</h3>
                        <p>
                            Learn how to find products, view product
                            information and place an order.
                        </p>
                        <Link href="/">
                            Browse Products →
                        </Link>
                    </div>

                    <div className="help-card">
                        <div className="help-icon">📦</div>
                        <h3>Orders & Parcels</h3>
                        <p>
                            Need information about an order or parcel?
                            Find tracking and delivery information.
                        </p>
                        <Link href="/parcel">
                            Track Parcel →
                        </Link>
                    </div>

                    <div className="help-card">
                        <div className="help-icon">🤖</div>
                        <h3>AI Assistant</h3>
                        <p>
                            Ask our AI assistant questions and get
                            instant answers.
                        </p>
                        <Link href="/chatbot">
                            Meet AI Assistant →
                        </Link>
                    </div>

                    <div className="help-card">
                        <div className="help-icon">⚙️</div>
                        <h3>Account</h3>
                        <p>
                            Get help with your account, login and
                            profile settings.
                        </p>
                        <Link href="/login">
                            Account Help →
                        </Link>
                    </div>

                </div>


                <div className="faq-section">

                    <div className="faq-heading">
                        <span>FAQ</span>
                        <h2>Frequently asked questions</h2>
                    </div>


                    <div className="faq-list">

                        <details>
                            <summary>
                                How do I place an order?
                                <span>+</span>
                            </summary>

                            <p>
                                Browse the products available on the website,
                                select a product and follow the checkout
                                process to complete your order.
                            </p>
                        </details>


                        <details>
                            <summary>
                                How can I track my parcel?
                                <span>+</span>
                            </summary>

                            <p>
                                Open the Parcel section of the website and
                                enter your order or tracking information.
                            </p>
                        </details>


                        <details>
                            <summary>
                                Can the AI assistant help me find products?
                                <span>+</span>
                            </summary>

                            <p>
                                Yes. You can describe what you are looking
                                for and the AI assistant can help you discover
                                suitable products.
                            </p>
                        </details>


                        <details>
                            <summary>
                                What can I ask the AI assistant?
                                <span>+</span>
                            </summary>

                            <p>
                                You can ask about products, orders, services,
                                parcels and general questions about using
                                the website.
                            </p>
                        </details>


                        <details>
                            <summary>
                                I still need help. What can I do?
                                <span>+</span>
                            </summary>

                            <p>
                                Start a conversation with our AI assistant
                                or contact the support team for additional
                                assistance.
                            </p>
                        </details>

                    </div>

                </div>


                <div className="help-bottom">

                    <div>
                        <span>NEED MORE HELP?</span>

                        <h2>
                            Ask our AI assistant.
                        </h2>

                        <p>
                            Get quick answers without waiting.
                        </p>
                    </div>

                    <Link href="/chatbot" className="help-chat-button">
                        Start Chatting →
                    </Link>

                </div>

            </section>

        </main>
    );
}