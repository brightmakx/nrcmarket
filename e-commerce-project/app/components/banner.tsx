"use client";

import "./styles/banner.css";
import Link from "next/link";
import { useEffect, useState } from "react";


type Banner = {
    id: string;
    imageUrl: string;
};


export default function Banner() {

    const [banners, setBanners] =
        useState<Banner[]>([]);

    const [currentBanner, setCurrentBanner] =
        useState(0);


    // --------------------------------
    // GET BANNERS
    // --------------------------------

    useEffect(() => {

        async function loadBanners() {

            try {

                const response =
                    await fetch("/api/banners");

                const data =
                    await response.json();


                if (response.ok) {
                    setBanners(data);
                }

            } catch (error) {

                console.error(
                    "Failed to load banners:",
                    error
                );
            }
        }


        loadBanners();

    }, []);


    // --------------------------------
    // CHANGE BANNER EVERY 5 SECONDS
    // --------------------------------

    useEffect(() => {

        if (banners.length <= 1) {
            return;
        }


        const interval =
            setInterval(() => {

                setCurrentBanner(
                    previous =>
                        (previous + 1) %
                        banners.length
                );

            }, 5000);


        return () =>
            clearInterval(interval);

    }, [banners]);


    return (

        <div
            className="banner"
            style={{

                backgroundImage:

                    banners.length > 0

                        ? `
                            linear-gradient(
                                to left,
                                rgba(0,0,0,0) 33%,
                                rgba(80,88,83,0.8) 100%
                            ),
                            url("${banners[currentBanner].imageUrl}")
                        `

                        : `
                            linear-gradient(
                                to left,
                                rgba(0,0,0,0) 33%,
                                rgba(80,88,83,0.8) 100%
                            ),
                            url("/images/banner.webp")
                        `,
            }}
        >

            <div className="banner-text">

                <h1>
                    NRC-MARKET:
                </h1>

                <h1>
                    Your Most Trusted Shopping Site
                </h1>


                <button>

                    <Link href="/all">
                        SHOP NOW
                    </Link>

                </button>

            </div>

        </div>
    );
}