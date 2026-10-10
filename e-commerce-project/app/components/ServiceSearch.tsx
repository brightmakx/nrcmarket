"use client";

import { useState } from "react";
import ServicesGrid from "./ServiceGrid";

type Props = {
    initialData: any[];
    limit: number;
};

export default function ServicesSearch({ initialData, limit }: Props) {
    const [search, setSearch] = useState("");
    const [services, setServices] = useState(initialData);
    const [gridKey, setGridKey] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const params = new URLSearchParams({
                page: "1",
                limit: String(limit)
            });

            if (search.trim()) {
                params.set("search", search.trim());
            }

            const res = await fetch(`/api/services?${params}`, {
                cache: "no-store"
            });

            if (!res.ok) {
                throw new Error("Failed to search services");
            }

            const result = await res.json();

            setServices(result.data ?? []);
            setGridKey(key => key + 1);
        } catch {
            setError("Could not search services. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="services-content">
            <form className="service-search" onSubmit={handleSearch}>
                <input
                    type="search"
                    placeholder="Search services..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    aria-label="Search services"
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            {error && <p className="service-search-error">{error}</p>}

            {!loading && services.length === 0 && (
                <p className="service-search-empty">
                    No services found. Try a different search.
                </p>
            )}

            <ServicesGrid
                key={gridKey}
                initialData={services}
                limit={limit}
            />
        </div>
    );
}