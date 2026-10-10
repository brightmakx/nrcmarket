
"use client";

import Link from "next/link";
import { signOut } from "@/lib/actions/auth-actios";
import { useState, useEffect } from "react";
import "../components/styles/account.css";

export default function AccountPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/users?includeOrders=true", {
                    cache: "no-store",
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "Failed to load account");
                    return;
                }

                setUser(data.data);
            } catch {
                setError("Error while fetching account details");
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    if (loading) return <div className="account-state">Loading...</div>;
    if (error) return <div className="account-state">{error}</div>;

    const initials = (user?.name || "User")
        .split(" ")
        .filter(Boolean)
        .map((name: string) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <main className="account-page">
            <div className="account-container">
                <section className="account-header">
                    <div>
                        <span className="account-eyebrow">MY ACCOUNT</span>
                        <h1>Welcome back, {user?.name}</h1>
                        <p>
                            Manage your profile, orders and services from
                            your account.
                        </p>
                    </div>
                </section>

                <div className="account-layout">
                    <div className="account-main">
                        {/* PROFILE */}

                        <section className="account-card profile-card">
                            <div className="profile-top">
                                <div className="profile-avatar">
                                    {initials}
                                </div>

                                <div className="profile-info">
                                    <h2>{user?.name}</h2>
                                    <p>{user?.email}</p>
                                    <span className="profile-location">
                                        {user?.location || "Location not provided"}
                                    </span>
                                </div>

                                <Link
                                    href="/account/profile"
                                    className="edit-profile"
                                >
                                    Edit Profile
                                </Link>
                            </div>

                            <div className="profile-details">
                                <div className="detail-item">
                                    <span className="detail-label">Phone</span>
                                    <strong>{user?.phone || "Not provided"}</strong>
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">
                                        Member Since
                                    </span>
                                    <strong>
                                        {user?.createdAt?.slice(0, 10) || "N/A"}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">Orders</span>
                                    <strong>{user?.orders?.length ?? 0}</strong>
                                </div>
                            </div>
                        </section>

                        {/* ACCOUNT MENU */}

                        <section className="account-card">
                            <div className="card-heading">
                                <h2>Account</h2>
                                <p>Manage your account and activity.</p>
                            </div>

                            <div className="account-menu">
                                <Link href="/orders" className="account-menu-item">
                                    <div className="menu-icon orders-icon">≡</div>
                                    <div className="menu-content">
                                        <strong>My Orders</strong>
                                        <span>View and manage your orders</span>
                                    </div>
                                    <span className="menu-arrow">→</span>
                                </Link>

                                <Link
                                    href="/account/bookings"
                                    className="account-menu-item"
                                >
                                    <div className="menu-icon bookings-icon">✓</div>
                                    <div className="menu-content">
                                        <strong>My Bookings</strong>
                                        <span>View your service bookings</span>
                                    </div>
                                    <span className="menu-arrow">→</span>
                                </Link>

                                <Link
                                    href="/account/provider-bookings"
                                    className="account-menu-item"
                                >
                                    <div className="menu-icon provider-bookings-icon">
                                        ★
                                    </div>
                                    <div className="menu-content">
                                        <strong>Booking Requests</strong>
                                        <span>
                                            Review customer booking requests
                                        </span>
                                    </div>
                                    <span className="menu-arrow">→</span>
                                </Link>

                                <Link
                                    href="/account/profile"
                                    className="account-menu-item"
                                >
                                    <div className="menu-icon profile-icon">◉</div>
                                    <div className="menu-content">
                                        <strong>Profile</strong>
                                        <span>Update your personal information</span>
                                    </div>
                                    <span className="menu-arrow">→</span>
                                </Link>

                                <Link
                                    href="/account/provider-account"
                                    className="account-menu-item"
                                >
                                    <div className="menu-icon provider-icon">★</div>
                                    <div className="menu-content">
                                        <strong>Provider Profile</strong>
                                        <span>Update your provider information</span>
                                    </div>
                                    <span className="menu-arrow">→</span>
                                </Link>

                                <Link
                                    href="/agent/register"
                                    className="account-menu-item"
                                >
                                    <div className="menu-icon agent-icon">🚚</div>
                                    <div className="menu-content">
                                        <strong>Delivery Agent Registration</strong>
                                        <span>
                                            Register to deliver customer orders
                                        </span>
                                    </div>
                                    <span className="menu-arrow">→</span>
                                </Link>

                                <Link
                                    href="/account/settings"
                                    className="account-menu-item"
                                >
                                    <div className="menu-icon settings-icon">⚙</div>
                                    <div className="menu-content">
                                        <strong>Settings</strong>
                                        <span>Manage your account preferences</span>
                                    </div>
                                    <span className="menu-arrow">→</span>
                                </Link>
                            </div>
                        </section>

                        {/* PROVIDER PROMOTION */}

                        <section className="provider-promotion">
                            <div className="provider-promotion-content">
                                <div className="provider-small-icon">★</div>
                                <div>
                                    <span className="provider-label">
                                        SERVICE PROVIDER
                                    </span>
                                    <h2>Turn your skills into a business</h2>
                                    <p>
                                        Offer your services to customers and
                                        grow your business on our platform.
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/account/become-provider"
                                className="become-provider-button"
                            >
                                Become a Provider <span>→</span>
                            </Link>
                        </section>

                        {/* DELIVERY AGENT PROMOTION */}

                        <section className="agent-promotion">
                            <div className="agent-promotion-content">
                                <div className="agent-promotion-icon">🛍️</div>
                                <div>
                                    <span className="agent-label">
                                        BECOME A SELLER
                                    </span>
                                    <h2>Grow your business with us</h2>
                                    <p>
                                        Start selling your products on our marketplace,
                                        reach more customers, and grow your business.
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/agent/register"
                                className="become-agent-button"
                            >
                                Start Selling <span>→</span>
                            </Link>
                        </section>


                        {/* SIGN OUT */}

                        <section className="account-card sign-out-card">
                            <div>
                                <h2>Sign out</h2>
                                <p>Sign out of your account on this device.</p>
                            </div>

                            <button
                                className="sign-out-button"
                                onClick={async () => {
                                    await signOut();
                                }}
                            >
                                Sign Out
                            </button>
                        </section>
                    </div>

                    {/* SIDEBAR */}

                    <aside className="account-sidebar">
                        <div className="quick-card">
                            <h2>Quick Actions</h2>

                            <Link href="/orders" className="quick-action">
                                <span>View Orders</span><span>→</span>
                            </Link>

                            <Link
                                href="/account/bookings"
                                className="quick-action"
                            >
                                <span>My Bookings</span><span>→</span>
                            </Link>

                            <Link
                                href="/account/provider-bookings"
                                className="quick-action provider-action"
                            >
                                <span>Booking Requests</span><span>→</span>
                            </Link>

                            <Link href="/" className="quick-action">
                                <span>Continue Shopping</span><span>→</span>
                            </Link>

                            <Link
                                href="/account/become-provider"
                                className="quick-action provider-action"
                            >
                                <span>Become a Provider</span><span>→</span>
                            </Link>

                            <Link
                                href="/agent/register"
                                className="quick-action agent-action"
                            >
                                <span>Become a Seller</span>
                                <span>→</span>
                            </Link>

                            {user?.role === "AGENT" && (
                                <Link href="/agent" className="quick-action">
                                    <span>Seller Login</span><span>→</span>
                                </Link>
                            )}
                        </div>

                        <div className="help-card">
                            <div className="help-icon">?</div>
                            <h3>Need help?</h3>
                            <p>
                                If you have questions about your account
                                or orders, we're here to help.
                            </p>
                            <button type="button">Contact Support</button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}