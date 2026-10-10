
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import "./edit-service.css";

type ServiceMedia = {
    id: number;
    name: string;
    createdAt?: string;
};

type Service = {
    id: number;
    name: string;
    description: string;
    conditions: string[];
    fee: number | null;
    images: ServiceMedia[];
    videos: ServiceMedia[];
};

export default function EditServiceForm({
    serviceId,
}: {
    serviceId: string;
}) {
    const router = useRouter();
    const [deletingMedia, setDeletingMedia] =
    useState<number | null>(null);

    const [service, setService] =
        useState<Service | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] =
        useState("");
    const [conditions, setConditions] =
        useState("");
    const [fee, setFee] = useState("");

    const [loading, setLoading] =
        useState(true);
    const [saving, setSaving] =
        useState(false);
    const [error, setError] =
        useState("");
    const [newImage, setNewImage] =
    useState<File | null>(null);

const [newVideo, setNewVideo] =
    useState<File | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Load service
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        async function loadService() {
            try {
                const response = await fetch(
                    `/api/providers/service?id=${serviceId}`
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                            "Failed to load service"
                    );
                }

                const currentService: Service =
                    data.data;

                setService(currentService);

                setName(
                    currentService.name || ""
                );

                setDescription(
                    currentService.description || ""
                );

                setConditions(
                    Array.isArray(
                        currentService.conditions
                    )
                        ? currentService.conditions.join(
                              "\n"
                          )
                        : ""
                );

                setFee(
                    currentService.fee !== null &&
                    currentService.fee !== undefined
                        ? String(
                              currentService.fee
                          )
                        : ""
                );
            } catch (error) {
                console.error(
                    "Load service error:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load service"
                );
            } finally {
                setLoading(false);
            }
        }

        loadService();
    }, [serviceId]);

    async function handleDeleteMedia(
    type: "image" | "video",
    id: number
) {
    const confirmed = window.confirm(
        `Are you sure you want to delete this ${type}?`
    );

    if (!confirmed) {
        return;
    }

    try {
        setDeletingMedia(id);
        setError("");

        const response = await fetch(
            `/api/services?type=${type}&id=${id}`,
            {
                method: "DELETE",
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error ||
                    `Failed to delete ${type}`
            );
        }

        // Remove the deleted item from the page
        setService((current) => {
            if (!current) {
                return current;
            }

            return {
                ...current,

                images:
                    type === "image"
                        ? current.images.filter(
                              (image) =>
                                  image.id !== id
                          )
                        : current.images,

                videos:
                    type === "video"
                        ? current.videos.filter(
                              (video) =>
                                  video.id !== id
                          )
                        : current.videos,
            };
        });

    } catch (error) {
        console.error(
            "Delete media error:",
            error
        );

        setError(
            error instanceof Error
                ? error.message
                : `Failed to delete ${type}`
        );

    } finally {
        setDeletingMedia(null);
    }
}

    /*
    |--------------------------------------------------------------------------
    | Save service
    |--------------------------------------------------------------------------
    */

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            /*
            |--------------------------------------------------------------------------
            | Conditions
            |--------------------------------------------------------------------------
            */

            const conditionList =
                conditions
                    .split("\n")
                    .map((condition) =>
                        condition.trim()
                    )
                    .filter(Boolean);

            /*
            |--------------------------------------------------------------------------
            | FormData
            |--------------------------------------------------------------------------
            */

            const formData = new FormData();

            /*
            |--------------------------------------------------------------------------
            | Service ID
            |--------------------------------------------------------------------------
            */

            formData.append(
                "serviceId",
                serviceId
            );
            if (newImage) {
    formData.append("image", newImage);
}

if (newVideo) {
    formData.append("video", newVideo);
}

            /*
            |--------------------------------------------------------------------------
            | Service fields
            |--------------------------------------------------------------------------
            */

            formData.append(
                "name",
                name
            );

            formData.append(
                "description",
                description
            );

            /*
            |--------------------------------------------------------------------------
            | Fee
            |--------------------------------------------------------------------------
            */

            if (fee.trim()) {
                formData.append(
                    "fee",
                    fee
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Conditions
            |
            | Each condition gets its own
            | "conditions" field.
            |--------------------------------------------------------------------------
            */

            for (const condition of conditionList) {
                formData.append(
                    "conditions",
                    condition
                );
            }

            /*
            |--------------------------------------------------------------------------
            | PUT request
            |--------------------------------------------------------------------------
            */

            const response = await fetch(
                "/api/services",
                {
                    method: "PUT",
                    body: formData,
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                        "Failed to update service"
                );
            }

            alert(
                "Service updated successfully."
            );

            router.push(
                "/account/provider-account"
            );

            router.refresh();

        } catch (error) {
            console.error(
                "Update service error:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update service"
            );
        } finally {
            setSaving(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <main className="edit-service-page">

                <div className="edit-service-container">

                    <h1>
                        Edit Service
                    </h1>

                    <p>
                        Loading service...
                    </p>

                </div>

            </main>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error && !service) {
        return (
            <main className="edit-service-page">

                <div className="edit-service-container">

                    <h1>
                        Edit Service
                    </h1>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            router.back()
                        }
                    >
                        Go Back
                    </button>

                </div>

            </main>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Form
    |--------------------------------------------------------------------------
    */

    return (
        <main className="edit-service-page">

            <div className="edit-service-container">

                <div className="edit-service-header">

                    <button
                        type="button"
                        onClick={() =>
                            router.back()
                        }
                        className="back-button"
                    >
                        ← Back
                    </button>

                    <h1>
                        Edit Service
                    </h1>

                    <p>
                        Update the information
                        about the service you
                        offer.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="edit-service-form"
                >

                    {/* SERVICE NAME */}

                    <div className="form-group">

                        <label htmlFor="name">
                            Service Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            placeholder="e.g. Plumbing Services"
                            required
                        />

                    </div>

                    {/* DESCRIPTION */}

                    <div className="form-group">

                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            placeholder="Describe your service..."
                            rows={6}
                            required
                        />

                    </div>

                    {/* CONDITIONS */}

                    <div className="form-group">

                        <label htmlFor="conditions">
                            Service Conditions
                        </label>

                        <textarea
                            id="conditions"
                            value={conditions}
                            onChange={(e) =>
                                setConditions(
                                    e.target.value
                                )
                            }
                            placeholder={
                                "Enter one condition per line"
                            }
                            rows={6}
                        />

                        <small>
                            Enter each condition
                            on a separate line.
                        </small>

                    </div>

                    {/* FEE */}

                    <div className="form-group">

                        <label htmlFor="fee">
                            Service Fee
                        </label>

                        <input
                            id="fee"
                            type="number"
                            min="0"
                            step="0.01"
                            value={fee}
                            onChange={(e) =>
                                setFee(
                                    e.target.value
                                )
                            }
                            placeholder="Enter service fee"
                        />

                    </div>
                    {/* SERVICE IMAGES */}

<div className="form-group">

    <label>
        Service Images
    </label>

    <div className="service-media-grid">

        {service?.images &&
        service.images.length > 0 ? (

            service.images.map((image) => (

                <div
                    key={image.id}
                    className="service-media-item"
                >

                    <img
                        src={`/images/${image.name}`}
                        alt="Service image"
                    />

                    <button
                        type="button"
                        onClick={() =>
                            handleDeleteMedia(
                                "image",
                                image.id
                            )
                        }
                        disabled={
                            deletingMedia ===
                            image.id
                        }
                        className="delete-media-button"
                    >
                        {deletingMedia ===
                        image.id
                            ? "Deleting..."
                            : "Delete Image"}
                    </button>

                </div>

            ))

        ) : (

            <p>
                No service images.
            </p>

        )}

    </div>

</div>
<div className="form-group">

    <label htmlFor="new-image">
        Add Service Image
    </label>

    <input
        id="new-image"
        type="file"
        accept="image/*"
        onChange={(e) => {
            setNewImage(
                e.target.files?.[0] || null
            );
        }}
    />

    {newImage && (
        <small>
            Selected: {newImage.name}
        </small>
    )}

</div>

{/* SERVICE VIDEOS */}

<div className="form-group">

    <label>
        Service Videos
    </label>

    <div className="service-media-grid">

        {service?.videos &&
        service.videos.length > 0 ? (

            service.videos.map((video) => (

                <div
                    key={video.id}
                    className="service-media-item"
                >

                    <video
                        src={`/images/${video.name}`}
                        controls
                    />

                    <button
                        type="button"
                        onClick={() =>
                            handleDeleteMedia(
                                "video",
                                video.id
                            )
                        }
                        disabled={
                            deletingMedia ===
                            video.id
                        }
                        className="delete-media-button"
                    >
                        {deletingMedia ===
                        video.id
                            ? "Deleting..."
                            : "Delete Video"}
                    </button>

                </div>

            ))

        ) : (

            <p>
                No service videos.
            </p>

        )}

    </div>

</div>
<div className="form-group">

    <label htmlFor="new-video">
        Add Service Video
    </label>

    <input
        id="new-video"
        type="file"
        accept="video/*"
        onChange={(e) => {
            setNewVideo(
                e.target.files?.[0] || null
            );
        }}
    />

    {newVideo && (
        <small>
            Selected: {newVideo.name}
        </small>
    )}

</div>

                    {/* ERROR */}

                    {error && (
                        <div className="edit-service-error">
                            {error}
                        </div>
                    )}

                    {/* ACTIONS */}

                    <div className="edit-service-actions">

                        <button
                            type="button"
                            onClick={() =>
                                router.back()
                            }
                            className="cancel-button"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-service-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </main>
    );
}

