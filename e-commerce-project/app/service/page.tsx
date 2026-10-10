import "../components/styles/services-page.css";
import { MobileMenu } from "../components/ServiceMenu";
import ServicesSearch from "../components/ServiceSearch";
import { headers } from "next/headers";

export default async function Page() {
    const h = await headers();
    const limit = 10;

    const res = await fetch(
        `http://localhost:3000/api/services?page=1&limit=${limit}`,
        {
            headers: {
                "Content-Type": "application/json",
                cookie: h.get("cookie") ?? ""
            },
            cache: "no-store"
        }
    );

    const result = res.ok ? await res.json() : { data: [] };

    const categories = ["elect", "fashion", "web dev", "welding"];

    return (
        <div className="services">
            <MobileMenu categories={categories} />

            <ServicesSearch
                initialData={result.data ?? []}
                limit={limit}
            />
        </div>
    );
}