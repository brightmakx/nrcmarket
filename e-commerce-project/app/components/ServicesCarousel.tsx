"use client";

import { useEffect, useState } from "react";
import Service from "./service";
import Link from "next/link";

type ServiceObject = {
    id: number;
    name: string;
    description: string;
    providersId: string;
    providerImage?: string;
    fee?: string;
    conditions?: string[];
    serviceVideos?: string[];
    serviceImages?: string[];
    provider?: {
        name?: string;
        rating?: number | string;
        image?: string;
    };
};

export default function ServicesCarousel({
    services,
}: {
    services: ServiceObject[];
}) {

    const [current, setCurrent] = useState(0);

    useEffect(() => {

        if (services.length <= 1) {
            return;
        }

        const interval = setInterval(() => {

            setCurrent((previous) =>
                (previous + 1) % services.length
            );

        }, 5000);

        return () => clearInterval(interval);

    }, [services.length]);


    return (
        <div className="services-carousel">

            <div
                className="services-track"
                style={{
                    transform: `translateX(-${current * 100}%)`,
                }}
            >

                {services.map((service) => (

                    <div
                        className="service-slide"
                        key={service.id}
                    >

                        <Service
                            key={service.id}
                            id={service.id}
                            name={service.name}
                            serviceImage={service.serviceImages?service.serviceImages[0]:undefined}
                            image={`/images/${service.providerImage}`||"/images/service_fallback.png"}
                            providerName={
                                service.provider?.name
                            }
                            providerRating={
                                service.provider?.rating
                            }
                        />

                    </div>

                ))}

            </div>


            {services.length > 1 && (

                <div className="service-dots">

                    {services.map((service, index) => (

                        <button
                            key={service.id}
                            className={
                                index === current
                                    ? "service-dot active"
                                    : "service-dot"
                            }
                            onClick={() => setCurrent(index)}
                            aria-label={`Show service ${index + 1}`}
                        />

                    ))}

                </div>

            )}


            <div className="more-services">

                <Link href="/service">
                    More Services →
                </Link>

            </div>

        </div>
    );
}