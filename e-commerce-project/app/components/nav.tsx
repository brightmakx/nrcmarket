
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import "../components/styles/nav.css";

export default function Navigation() {
    const path = usePathname();

    const [menuOpen, setMenuOpen] = useState(false);

    const exclude = path === "/createProduct";
    const login = path === "/login";

    if (exclude || login) {
        return null;
    }

    return (
        <>
            {/* =========================
                NAVIGATION BAR
            ========================= */}

            <div className="menu-tab">

                {/* LEFT SIDE - NAVIGATION LINKS */}

                <div className="nav-links">

                    <span>
                        <Link href="/">Home</Link>
                    </span>

                    <span>
                        <Link href="/all">All</Link>
                    </span>

                    <span>
                        <Link href="/service">Services</Link>
                    </span>

                    <span>
                        <Link href="/about">About</Link>
                    </span>

                    <span>
                        <Link href="/help">Help</Link>
                    </span>

                </div>


                {/* RIGHT SIDE - MENU BUTTON */}

                <button
                    className={`hamburger-button ${
                        menuOpen ? "active" : ""
                    }`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Open menu"
                    aria-expanded={menuOpen}
                >

                    <span></span>
                    <span></span>
                    <span></span>

                </button>

            </div>


            {/* =========================
                SIDE MENU
            ========================= */}

            <aside
                className={`side-menu ${
                    menuOpen ? "side-menu-open" : ""
                }`}
            >

                <div className="side-menu-header">

                    <h2>Menu</h2>

                    <button
                        className="close-menu"
                        onClick={() => setMenuOpen(false)}
                    >
                        ×
                    </button>

                </div>


                {/* =========================
                    ADD YOUR COMPONENTS HERE
                ========================= */}

                <div className="side-menu-content">

                    <Link
                        href="/account"
                        onClick={() => setMenuOpen(false)}
                    >
                        👤 Profile
                    </Link>
                    

                    <Link
                        href="/orders"
                        onClick={() => setMenuOpen(false)}
                    >
                        📦 My Orders
                    </Link>
                    <Link
                        href="/add-products"
                        onClick={() => setMenuOpen(false)}
                    >
                        🛍️ add product
                    </Link>
                    <Link
                        href="/about"
                        onClick={() => setMenuOpen(false)}
                    >
                        ℹ️ about
                    </Link>
                    <Link
                        href="/manageBanners"
                        onClick={() => setMenuOpen(false)}
                    >
                        🖼️ add banners
                    </Link>
                    <Link
                        href="/add-categories"
                        onClick={() => setMenuOpen(false)}
                    >
                        🗂️ add categories
                    </Link>


                    {/* ADD ANY COMPONENT HERE */}

                </div>

            </aside>


            {/* =========================
                BACKDROP
            ========================= */}

            {menuOpen && (
                <div
                    className="menu-backdrop"
                    onClick={() => setMenuOpen(false)}
                />
            )}


            {/* =========================
                CHATBOT
            ========================= */}

            <Link
                href="/chatbot"
                className="chat-button"
            >

                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >

                    <path
                        d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    <text
                        x="12"
                        y="11.8"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="currentColor"
                        fontSize="4"
                        fontWeight="700"
                        fontFamily="Arial, sans-serif"
                    >
                        AI
                    </text>

                    <path
                        d="M19 16l.6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                </svg>

            </Link>
        </>
    );
}

