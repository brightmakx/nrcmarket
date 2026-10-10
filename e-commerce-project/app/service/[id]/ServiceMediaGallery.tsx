"use client";

import { useState } from "react";

export default function ServiceMediaGallery({
    images = [],
    videos = [],
}: {
    images?: string[];
    videos?: string[];
}) {
    const [selectedImage, setSelectedImage] =
        useState<string | null>(
            images.length > 0
                ? images[0]
                : null
        );

    function mediaUrl(name: string) {
        if (
            name.startsWith("http://") ||
            name.startsWith("https://") ||
            name.startsWith("/")
        ) {
            return name;
        }

        return `/images/${name}`;
    }

    return (
        <div className="service-media-gallery">

            {/* =================================================
               IMAGE GALLERY
            ================================================= */}

            {images.length > 0 ? (

                <div className="service-image-gallery">

                    {/* MAIN IMAGE */}

                    <div className="service-featured-image">

                        {selectedImage && (
                            <img
                                src={mediaUrl(
                                    selectedImage
                                )}
                                alt="Service image"
                            />
                        )}

                    </div>


                    {/* IMAGE THUMBNAILS */}

                    {images.length > 1 && (

                        <div className="service-image-thumbnails">

                            {images.map(
                                (image, index) => (

                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        className={
                                            selectedImage ===
                                            image
                                                ? "service-thumbnail active"
                                                : "service-thumbnail"
                                        }
                                        onClick={() =>
                                            setSelectedImage(
                                                image
                                            )
                                        }
                                    >

                                        <img
                                            src={mediaUrl(
                                                image
                                            )}
                                            alt={`Service image ${
                                                index + 1
                                            }`}
                                        />

                                    </button>

                                )
                            )}

                        </div>

                    )}

                </div>

            ) : (

                /* =================================================
                   NO IMAGES
                ================================================= */

                <div className="service-no-image">

                    <span>
                        🖼️
                    </span>

                    <p>
                        No service images available
                    </p>

                </div>

            )}


            {/* =================================================
               VIDEOS
            ================================================= */}

            {videos.length > 0 && (

                <div className="service-videos-section">

                    <div className="service-media-heading">

                        <h3>
                            Service Videos
                        </h3>

                        <span>
                            {videos.length}{" "}
                            {videos.length === 1
                                ? "video"
                                : "videos"}
                        </span>

                    </div>


                    <div className="service-video-grid">

                        {videos.map(
                            (video, index) => (

                                <div
                                    key={`${video}-${index}`}
                                    className="service-video-card"
                                >

                                    <video
                                        controls
                                        preload="metadata"
                                        src={mediaUrl(
                                            video
                                        )}
                                    />

                                </div>

                            )
                        )}

                    </div>

                </div>

            )}

        </div>
    );
}