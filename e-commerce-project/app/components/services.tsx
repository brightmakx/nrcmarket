import { headers } from "next/headers";
import ServicesCarousel from "./ServicesCarousel";
import "./styles/servicesHome.css";

export default async function Services() {

    const h = await headers();

    const res = await fetch("http://localhost:3000/api/services?page=1&limit=4", {
        headers: {
            cookie: h.get("cookie") ?? "",
        },
        cache: "no-store",
    });

    if (!res.ok) {
        return null;
    }

    const result = await res.json();
    const services = result.data || [];

    if (!services.length) {
        return null;
    }

    return (
        <section className="home-services">

            <div className="home-services-header">
                <h3>Featured Services</h3>
            </div>

            <ServicesCarousel services={services} />

        </section>
    );
}