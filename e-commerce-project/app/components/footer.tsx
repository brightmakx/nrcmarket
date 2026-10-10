import Link from "next/link";
import "./styles/footer.css";

export default function Footer() {
    return (
        <footer className="site-footer">

            <div className="footer-container">

                <div className="footer-brand">
                    <Link href="/" className="footer-logo">
                        market
                    </Link>

                    <p>
                        Everything you need, all in one marketplace.
                        Shop products, discover services, and connect
                        with local providers.
                    </p>
                </div>

                <div className="footer-column">
                    <h4>Products</h4>

                    <Link href="/all">All Products</Link>
                    <Link href="/all">Categories</Link>
                    <Link href="/all?sort=new">New Products</Link>
                </div>

                <div className="footer-column">
                    <h4>Services</h4>

                    <Link href="/service">All Services</Link>
                    <Link href="/service?category=web%20dev">
                        Web Development
                    </Link>
                    <Link href="/service?category=elect">
                        Electrical
                    </Link>
                    <Link href="/service?category=welding">
                        Welding
                    </Link>
                    <Link href="/account/become-provider">
                        Become a Provider
                    </Link>
                </div>

                <div className="footer-column">
                    <h4>Account</h4>

                    <Link href="/account">My Account</Link>
                    <Link href="/orders">My Orders</Link>
                    <Link href="/cart">Cart</Link>
                </div>

                <div className="footer-column">
                    <h4>Help</h4>

                    <Link href="/help">Help Center</Link>
                    <Link href="/help">Contact Us</Link>
                </div>

            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-container">

                    <p>
                        © 2026 Market. All rights reserved.
                    </p>

                    <div className="footer-bottom-links">
                        <Link href="/privacy">Privacy</Link>
                        <Link href="/terms">Terms</Link>
                    </div>

                </div>
            </div>

        </footer>
    );
}