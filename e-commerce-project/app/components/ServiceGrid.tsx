"use client";

import { useEffect, useRef, useState } from "react";
import Service from "@/app/components/service";

type ServicesGridProps = {
    initialData: any[];
    limit: number;
};

export default function ServicesGrid({
    initialData,
    limit
}: ServicesGridProps) {
    const [services, setServices] = useState(initialData);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(
        initialData.length === limit
    );

    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!hasMore || loading) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            {
                rootMargin: "300px"
            }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [page, hasMore, loading]);

    async function loadMore() {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const nextPage = page + 1;

            const res = await fetch(
                `/api/services?page=${nextPage}&limit=${limit}`
            );

            if (!res.ok) {
                throw new Error("Failed to load services");
            }

            const result = await res.json();
            const newServices = result.data ?? [];

            setServices(previous => [
                ...previous,
                ...newServices
            ]);

            setPage(nextPage);

            if (newServices.length < limit) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load more services:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="servicesGrid">
                {services.map((service: any) => (
                    <Service
                        key={service.id}
                        id={service.id}
                        name={service.name}
                        serviceImage={
                            service.serviceImages
                                ? service.serviceImages[0]
                                : undefined
                        }
                        image={
                            service.providerImage
                                ? `/images/${service.providerImage}`
                                : "/images/service_fallback.png"
                        }
                        providerName={
                            service.provider?.name
                        }
                        providerRating={
                            service.provider?.rating
                        }
                    />
                ))}
            </div>

            {hasMore && (
                <div
                    ref={loaderRef}
                    style={{
                        width: "100%",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {loading && "Loading..."}
                </div>
            )}
        </>
    );
}