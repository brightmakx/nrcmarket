
"use client";

import Link from "next/link";
import { useState } from "react";
import "./chatbot.css";

type Message = {
    id: number;
    type: "user" | "ai";
    text: string;
};

const faqQuestions = [
    {
        question: "How can I find a product?",
        answer:
            "You can search for products using the search bar, or tell me what you are looking for. For example, you can say: 'I need a laptop for programming' and I'll help guide you."
    },
    {
        question: "How can I place an order?",
        answer:
            "To place an order, open the product you want, choose the quantity, add it to your cart, and then proceed to checkout."
    },
    {
        question: "How can I track my order?",
        answer:
            "You can track your order by going to the Orders page from your account. Select an order to see its current status and delivery information."
    },
    {
        question: "How can I contact a seller?",
        answer:
            "Open the product you are interested in and look for the seller information. You can use the available contact or messaging option to communicate with the seller."
    },
    {
        question: "How do I create an account?",
        answer:
            "Click the account or sign-up option and provide your required information. Once your account is created, you can start shopping and managing your orders."
    },
    {
        question: "How can I add a product to my cart?",
        answer:
            "Open the product you want, select the quantity if necessary, and click the Add to Cart button. You can then open your cart to review your items."
    },
    {
        question: "Can I cancel my order?",
        answer:
            "Order cancellation depends on the current status of the order. Go to your Orders page and check whether the cancellation option is available."
    },
    {
        question: "What services are available?",
        answer:
            "You can discover products and services available from sellers on the marketplace. Use the search feature to find what you need."
    }
];

export default function ChatbotPage() {

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            type: "ai",
            text:
                "Hello! 👋 I'm your AI shopping assistant. Choose a frequently asked question below and I'll help you."
        }
    ]);

    const [typing, setTyping] = useState(false);

    const askQuestion = (question: string, answer: string) => {

        // Prevent multiple clicks while answering
        if (typing) return;

        const userMessage: Message = {
            id: Date.now(),
            type: "user",
            text: question
        };

        setMessages((previous) => [
            ...previous,
            userMessage
        ]);

        setTyping(true);

        // Simulate AI thinking
        setTimeout(() => {

            const aiMessage: Message = {
                id: Date.now() + 1,
                type: "ai",
                text: answer
            };

            setMessages((previous) => [
                ...previous,
                aiMessage
            ]);

            setTyping(false);

        }, 900);
    };


    return (
        <main className="chatbot-page">

            {/* HERO */}

            <section className="chatbot-hero">

                <div className="chatbot-hero-content">

                    <div className="ai-badge">
                        ✦ AI POWERED ASSISTANT
                    </div>

                    <h1>
                        Your personal shopping
                        <span> assistant.</span>
                    </h1>

                    <p>
                        Get instant answers, discover products, track parcels,
                        find services and get help anytime with our smart AI assistant.
                    </p>

                    <div className="chatbot-actions">

                        <a
                            href="#faq-chat"
                            className="start-chat"
                        >
                            Start Chatting
                            <span>→</span>
                        </a>

                        <Link
                            href="/help"
                            className="learn-more"
                        >
                            Learn More
                        </Link>

                    </div>

                    <div className="chatbot-trust">

                        <div className="avatars">
                            <span>👤</span>
                            <span>👩</span>
                            <span>👨</span>
                        </div>

                        <div>
                            <strong>Always ready to help</strong>
                            <small>Fast answers. Simple shopping.</small>
                        </div>

                    </div>

                </div>


                {/* CHAT PREVIEW */}

                <div className="chatbot-preview">

                    <div className="glow-circle"></div>

                    <div className="ai-card">

                        <div className="ai-card-header">

                            <div className="ai-avatar">
                                ✦
                            </div>

                            <div>
                                <strong>AI Assistant</strong>

                                <small>
                                    <span className="online-dot"></span>
                                    Online now
                                </small>
                            </div>

                            <div className="ai-menu">
                                ⋮
                            </div>

                        </div>


                        <div className="ai-messages">

                            <div className="message ai-message">
                                Hello! 👋
                                <br />
                                How can I help you today?
                            </div>

                            <div className="message user-message">
                                I need help finding a product.
                            </div>

                            <div className="message ai-message">
                                Absolutely! ✨
                                <br />
                                Tell me what you're looking for and
                                I'll help you find it.
                            </div>

                        </div>


                        <div className="fake-input">
                            <span>Ask anything...</span>
                            <button>↑</button>
                        </div>

                    </div>

                </div>

            </section>


            {/* REAL CHAT */}

            <section
                className="faq-chat"
                id="faq-chat"
            >

                <div className="faq-chat-container">

                    <div className="faq-heading">

                        <span>AI ASSISTANT</span>

                        <h2>
                            How can we help?
                        </h2>

                        <p>
                            Choose a frequently asked question and
                            our assistant will answer you instantly.
                        </p>

                    </div>


                    {/* CHAT WINDOW */}

                    <div className="real-chat-window">

                        <div className="real-chat-header">

                            <div className="real-ai-avatar">
                                ✦
                            </div>

                            <div>
                                <strong>AI Assistant</strong>

                                <small>
                                    <span className="online-dot"></span>
                                    Online
                                </small>
                            </div>

                        </div>


                        {/* MESSAGES */}

                        <div className="real-chat-messages">

                            {messages.map((message) => (

                                <div
                                    key={message.id}
                                    className={
                                        message.type === "ai"
                                            ? "chat-message ai-chat-message"
                                            : "chat-message user-chat-message"
                                    }
                                >

                                    {message.text}

                                </div>

                            ))}


                            {/* Typing indicator */}

                            {typing && (

                                <div className="typing-message">

                                    <span></span>
                                    <span></span>
                                    <span></span>

                                </div>

                            )}

                        </div>


                        {/* FAQ QUESTIONS */}

                        <div className="faq-section">

                            <div className="faq-title">
                                Frequently asked questions
                            </div>

                            <div className="faq-grid">

                                {faqQuestions.map((faq, index) => (

                                    <button
                                        key={index}
                                        className="faq-question"
                                        onClick={() =>
                                            askQuestion(
                                                faq.question,
                                                faq.answer
                                            )
                                        }
                                        disabled={typing}
                                    >

                                        <span>
                                            {faq.question}
                                        </span>

                                        <strong>
                                            →
                                        </strong>

                                    </button>

                                ))}

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* FEATURES */}

            <section className="chatbot-features">

                <div className="section-heading">

                    <span>SMARTER SHOPPING</span>

                    <h2>
                        Everything you need,
                        <br />
                        right in one conversation.
                    </h2>

                    <p>
                        Our AI assistant makes your experience faster,
                        easier and more convenient.
                    </p>

                </div>


                <div className="feature-grid">

                    <div className="feature-card">

                        <div className="feature-icon">
                            🔎
                        </div>

                        <h3>
                            Find Products
                        </h3>

                        <p>
                            Describe what you're looking for and let the
                            assistant help you discover suitable products.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            📦
                        </div>

                        <h3>
                            Track Parcels
                        </h3>

                        <p>
                            Get quick information about your orders and
                            parcel delivery status.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            💬
                        </div>

                        <h3>
                            Instant Answers
                        </h3>

                        <p>
                            Ask questions about products, services,
                            orders and your account.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            ⚡
                        </div>

                        <h3>
                            Available Anytime
                        </h3>

                        <p>
                            Get assistance whenever you need it without
                            waiting for a human support agent.
                        </p>

                    </div>

                </div>

            </section>


            {/* CTA */}

            <section className="chatbot-cta">

                <div>

                    <span>
                        READY TO GET STARTED?
                    </span>

                    <h2>
                        Let AI make your
                        shopping easier.
                    </h2>

                    <p>
                        Start a conversation and see what your
                        AI assistant can do.
                    </p>

                    <a
                        href="#faq-chat"
                        className="cta-button"
                    >
                        Start Chatting →
                    </a>

                </div>

            </section>

        </main>
    );
}

