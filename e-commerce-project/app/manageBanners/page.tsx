"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

import "./styles/bannerManager.css";


type Banner = {
    id: string;
    imageUrl: string;
    createdAt: string;
};


export default function ManageBanners() {

    const [banners, setBanners] =
        useState<Banner[]>([]);

    const [image, setImage] =
        useState<File | null>(null);

    const [loading, setLoading] =
        useState(false);


    // --------------------------------
    // LOAD BANNERS
    // --------------------------------

    async function loadBanners() {

        try {

            const response =
                await fetch("/api/banners");

            const data =
                await response.json();


            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to load banners"
                );
            }


            setBanners(data);

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to load banners"
            );
        }
    }


    useEffect(() => {

        loadBanners();

    }, []);


    // --------------------------------
    // UPLOAD
    // --------------------------------

    async function handleUpload(
        event: React.FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();


        if (!image) {

            toast.error(
                "Please select a banner image"
            );

            return;
        }


        setLoading(true);


        try {

            const formData =
                new FormData();

            formData.append(
                "image",
                image
            );


            const response =
                await fetch(
                    "/api/banners",
                    {
                        method: "POST",
                        body: formData,
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Upload failed"
                );
            }


            toast.success(
                "Banner uploaded successfully"
            );


            // Clear selected image
            setImage(null);


            const input =
                document.getElementById(
                    "banner-image"
                ) as HTMLInputElement;


            if (input) {
                input.value = "";
            }


            // Reload banners
            loadBanners();

        } catch (error) {

            console.error(error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to upload banner"
            );

        } finally {

            setLoading(false);
        }
    }


    // --------------------------------
    // DELETE
    // --------------------------------

    async function deleteBanner(
        id: string
    ) {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this banner?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const response =
                await fetch(
                    "/api/banners",
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            id,
                        }),
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Delete failed"
                );
            }


            toast.success(
                "Banner deleted"
            );


            setBanners(
                previous =>
                    previous.filter(
                        banner =>
                            banner.id !== id
                    )
            );


        } catch (error) {

            console.error(error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to delete banner"
            );
        }
    }


    return (

        <div className="banner-manager">

            <h1>Manage Banners</h1>


            {/* UPLOAD FORM */}

            <form
                className="banner-upload-form"
                onSubmit={handleUpload}
            >

                <label htmlFor="banner-image">
                    Select Banner Image
                </label>


                <input
                    id="banner-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
                    onChange={(event) => {

                        const file =
                            event.target.files?.[0];

                        setImage(
                            file || null
                        );

                    }}
                />


                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Uploading..."
                        : "Upload Banner"
                    }

                </button>

            </form>


            {/* BANNERS */}

            <h2>
                Current Banners
            </h2>


            {banners.length === 0 ? (

                <p>
                    No banners uploaded yet.
                </p>

            ) : (

                <div className="banner-list">

                    {banners.map(
                        (banner) => (

                            <div
                                className="banner-item"
                                key={banner.id}
                            >

                                <Image
                                    src={
                                        banner.imageUrl
                                    }
                                    alt="Website banner"
                                    width={800}
                                    height={220}
                                />


                                <button
                                    className="delete-banner"
                                    onClick={() =>
                                        deleteBanner(
                                            banner.id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}