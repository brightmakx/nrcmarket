"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./provider-profile.css";
import { useRouter } from "next/navigation";

type ImageType = {
    name: string;
};

type Service = {
    serviceImage: string | null;
    name: string;
    description: string;
    conditions: string[];
    id: number;
    images?: ImageType[];
    providerId?: string | null;
};

type Provider = {
    name: string;
    location: string;
    phone: string;
    availability: string;
};

export default function ProviderProfilePage() {

    const [provider, setProvider] = useState<Provider | null>(null);

    const [services, setServices] = useState<Service[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [selectedImages, setSelectedImages] = useState<
        Record<number, number>
    >({});

    const [deletingService, setDeletingService] =
        useState<number | null>(null);

    const router = useRouter();


    // =====================================================
    // FETCH PROVIDER
    // =====================================================

    useEffect(() => {

        async function fetchProvider() {

            try {

                const response = await fetch(
                    "/api/providers"
                );

                const data = await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "Failed to load provider profile"
                    );

                }

                setProvider(data.data);

            } catch (error: any) {

                console.error(
                    "Provider fetch error:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load provider profile"
                );

            }

        }

        fetchProvider();

    }, []);


    // =====================================================
    // FETCH PROVIDER SERVICES
    // =====================================================

    useEffect(() => {

        async function fetchServices() {

            try {

                const response = await fetch(
                    "/api/providers/service"
                );

                const data = await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "Failed to load services"
                    );

                }

                const serviceData =
                    Array.isArray(data.data)
                        ? data.data
                        : [];

                setServices(serviceData);

            } catch (error: any) {

                console.error(
                    "Services fetch error:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load services"
                );

            } finally {

                setLoading(false);

            }

        }

        fetchServices();

    }, []);


    // =====================================================
    // IMAGE URL
    // =====================================================

    function getImageUrl(
        image: string
    ) {

        if (
            image.startsWith("http://") ||
            image.startsWith("https://") ||
            image.startsWith("/")
        ) {

            return image;

        }

        return `/images/${image}`;

    }


    // =====================================================
    // DELETE SERVICE
    // =====================================================

    async function handleDeleteService(
        serviceId: number,
        serviceName: string
    ) {

        const confirmed = window.confirm(
            `Are you sure you want to delete "${serviceName}"?\n\nThis action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }


        try {

            setDeletingService(serviceId);


            const response = await fetch(
                `/api/providers/service?id=${serviceId}`,
                {
                    method: "DELETE",
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Failed to delete service"
                );

            }


            setServices((current) =>
                current.filter(
                    (service) =>
                        service.id !== serviceId
                )
            );


        } catch (error) {

            console.error(
                "Delete service error:",
                error
            );

            alert(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while deleting the service."
            );

        } finally {

            setDeletingService(null);

        }

    }


    // =====================================================
    // AVAILABILITY
    // =====================================================

    function getAvailabilityClass() {

        switch (
            provider?.availability?.toLowerCase()
        ) {

            case "available":
                return "availability-available";

            case "busy":
                return "availability-busy";

            case "unavailable":
                return "availability-unavailable";

            default:
                return "availability-default";

        }

    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <main className="provider-profile-page">

                <div className="provider-profile-container">

                    <div className="provider-profile-loading">

                        <div className="profile-loading-spinner" />

                        <p>
                            Loading provider profile...
                        </p>

                    </div>

                </div>

            </main>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <main className="provider-profile-page">

                <div className="provider-profile-container">

                    <div className="provider-profile-error">

                        <div className="profile-error-icon">
                            !
                        </div>

                        <h1>
                            Unable to load provider profile
                        </h1>

                        <p>
                            {error}
                        </p>

                        <Link
                            href="/account"
                            className="profile-error-button"
                        >
                            Back to Account
                        </Link>

                    </div>

                </div>

            </main>

        );

    }


    // =====================================================
    // PROVIDER NOT FOUND
    // =====================================================

    if (!provider) {

        return (

            <main className="provider-profile-page">

                <div className="provider-profile-container">

                    <div className="provider-profile-error">

                        <div className="profile-error-icon">
                            !
                        </div>

                        <h1>
                            Provider profile not found
                        </h1>

                        <p>
                            We could not find your provider
                            information.
                        </p>

                        <Link
                            href="/account"
                            className="profile-error-button"
                        >
                            Back to Account
                        </Link>

                    </div>

                </div>

            </main>

        );

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <main className="provider-profile-page">

            <div className="provider-profile-container">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="provider-profile-header">

                    <div>

                        <Link
                            href="/account"
                            className="provider-profile-back"
                        >
                            ← Back to Account
                        </Link>

                        <p className="provider-profile-label">
                            SERVICE PROVIDER
                        </p>

                        <h1>
                            Provider Profile
                        </h1>

                        <p className="provider-profile-subtitle">
                            View your provider information
                            and the services you offer.
                        </p>

                    </div>


                    <Link
                        href="/account/provider-account/profile"
                        className="provider-edit-button"
                    >
                        ✎ Edit Profile
                    </Link>

                </div>


                {/* =========================
                    PROVIDER INFORMATION
                ========================= */}

                <section className="provider-information-card">

                    <div className="provider-information-header">

                        <div>

                            <span className="provider-service-label">
                                PROVIDER
                            </span>

                            <h2>
                                {provider.name}
                            </h2>

                        </div>


                        <span
                            className={`provider-availability ${getAvailabilityClass()}`}
                        >

                            <span className="availability-dot" />

                            {provider.availability}

                        </span>

                    </div>


                    <div className="provider-info-grid">

                        <div className="profile-info-box">

                            <div className="profile-info-icon">
                                👤
                            </div>

                            <div>

                                <span>
                                    Provider
                                </span>

                                <strong>
                                    {provider.name}
                                </strong>

                            </div>

                        </div>


                        <div className="profile-info-box">

                            <div className="profile-info-icon">
                                📍
                            </div>

                            <div>

                                <span>
                                    Location
                                </span>

                                <strong>
                                    {provider.location}
                                </strong>

                            </div>

                        </div>


                        <div className="profile-info-box">

                            <div className="profile-info-icon">
                                ☎
                            </div>

                            <div>

                                <span>
                                    Phone
                                </span>

                                <strong>
                                    {provider.phone}
                                </strong>

                            </div>

                        </div>


                        <div className="profile-info-box">

                            <div className="profile-info-icon">
                                ✓
                            </div>

                            <div>

                                <span>
                                    Status
                                </span>

                                <strong>
                                    {provider.availability}
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =========================
                    SERVICES
                ========================= */}

                <section className="provider-services-section">

                    <div className="services-section-header">

                        <div>

                            <span className="provider-service-label">
                                SERVICES
                            </span>

                            <h2>
                                Your Services
                            </h2>

                            <p>
                                Services currently offered
                                through your provider profile.
                            </p>

                        </div>


                        <Link
                            href="/service/add-service"
                            className="add-service-button"
                            
                        >
                            + Add Service
                        </Link>

                    </div>


                    {services.length === 0 ? (

                        <div className="no-services">

                            <div className="no-services-icon">
                                +
                            </div>

                            <h3>
                                No services yet
                            </h3>

                            <p>
                                You have not added any
                                services to your provider
                                profile.
                            </p>

                            <Link
                                href="/account/provider-account/add-service"
                                className="profile-error-button"
                            >
                                Add Your First Service
                            </Link>

                        </div>

                    ) : (

                        <div className="provider-services-list">

                            {services.map(
                                (service) => {

                                    const images =
                                        Array.isArray(
                                            service.images
                                        )
                                            ? service.images
                                            : [];


                                    const selectedIndex =
                                        selectedImages[
                                            service.id
                                        ] ?? 0;


                                    const selectedImage =
                                        images[
                                            selectedIndex
                                        ]?.name ||
                                        service.serviceImage;


                                    return (

                                        <article
                                            className="provider-service-card"
                                            key={service.id}
                                        >


                                            {/* =========================
                                                SERVICE GALLERY
                                            ========================= */}

                                            <div className="service-gallery">

                                                <div className="service-main-image">

                                                    {selectedImage ? (

                                                        <img
                                                            src={getImageUrl(
                                                                selectedImage
                                                            )}
                                                            alt={
                                                                service.name
                                                            }
                                                        />

                                                    ) : (

                                                        <div className="service-no-image">

                                                            <div className="service-no-image-icon">
                                                                ◇
                                                            </div>

                                                            <span>
                                                                No service image
                                                            </span>

                                                        </div>

                                                    )}

                                                </div>


                                                {images.length > 0 && (

                                                    <div className="service-thumbnails">

                                                        {images.map(
                                                            (
                                                                image,
                                                                index
                                                            ) => (

                                                                <button
                                                                    key={`${service.id}-${image.name}-${index}`}
                                                                    type="button"
                                                                    className={`service-thumbnail ${
                                                                        selectedIndex === index
                                                                            ? "service-thumbnail-active"
                                                                            : ""
                                                                    }`}
                                                                    onClick={() =>
                                                                        setSelectedImages(
                                                                            (
                                                                                current
                                                                            ) => ({
                                                                                ...current,
                                                                                [service.id]:
                                                                                    index,
                                                                            })
                                                                        )
                                                                    }
                                                                >

                                                                    <img
                                                                        src={getImageUrl(
                                                                            image.name
                                                                        )}
                                                                        alt={`${service.name} image ${
                                                                            index + 1
                                                                        }`}
                                                                    />

                                                                </button>

                                                            )
                                                        )}

                                                    </div>

                                                )}

                                            </div>


                                            {/* =========================
                                                SERVICE CONTENT
                                            ========================= */}

                                            <div className="provider-service-card-content">


                                                <div className="service-card-heading">

                                                    <div>

                                                        <span className="provider-service-label">
                                                            SERVICE
                                                        </span>

                                                        <h2>
                                                            {service.name}
                                                        </h2>

                                                    </div>


                                                    {/* =========================
                                                        SERVICE ACTIONS
                                                    ========================= */}

                                                    <div className="service-heading-actions">

                                                        <Link
                                                            href={`/account/provider-account/edit-service/${service.id}`}
                                                            className="service-edit-button"
                                                        >
                                                            ✎ Edit Service
                                                        </Link>


                                                        <button
                                                            type="button"
                                                            className="service-delete-button"
                                                            onClick={() =>
                                                                handleDeleteService(
                                                                    service.id,
                                                                    service.name
                                                                )
                                                            }
                                                            disabled={
                                                                deletingService ===
                                                                service.id
                                                            }
                                                        >

                                                            {deletingService ===
                                                            service.id
                                                                ? "Deleting..."
                                                                : "🗑 Delete Service"}

                                                        </button>

                                                    </div>

                                                </div>


                                                {/* DESCRIPTION */}

                                                <div className="service-description">

                                                    <h3>
                                                        Description
                                                    </h3>

                                                    <p>
                                                        {service.description ||
                                                            "No description provided."}
                                                    </p>

                                                </div>


                                                {/* CONDITIONS */}

                                                {service.conditions?.length >
                                                    0 && (

                                                    <div className="service-conditions">

                                                        <h3>
                                                            Conditions
                                                        </h3>

                                                        <ul>

                                                            {service.conditions.map(
                                                                (
                                                                    condition,
                                                                    index
                                                                ) => (

                                                                    <li
                                                                        key={`${service.id}-condition-${index}`}
                                                                    >
                                                                        {condition}
                                                                    </li>

                                                                )
                                                            )}

                                                        </ul>

                                                    </div>

                                                )}

                                            </div>

                                        </article>

                                    );

                                }
                            )}

                        </div>

                    )}

                </section>


                {/* =========================
                    SIDEBAR INFORMATION
                ========================= */}

                <aside className="provider-profile-sidebar">

                    <div className="provider-status-card">

                        <div className="status-card-icon">
                            ✓
                        </div>

                        <span className="status-card-label">
                            PROVIDER STATUS
                        </span>

                        <h3>
                            {provider.availability}
                        </h3>

                        <p>
                            Your current availability
                            is visible on your provider
                            profile.
                        </p>

                    </div>


                    <div className="provider-contact-card">

                        <h3>
                            Contact Information
                        </h3>

                        <div className="contact-item">

                            <span>
                                Phone
                            </span>

                            <strong>
                                {provider.phone}
                            </strong>

                        </div>


                        <div className="contact-item">

                            <span>
                                Location
                            </span>

                            <strong>
                                {provider.location}
                            </strong>

                        </div>

                    </div>


                    <div className="provider-profile-tip">

                        <div className="profile-tip-icon">
                            💡
                        </div>

                        <div>

                            <h3>
                                Keep your profile fresh
                            </h3>

                            <p>
                                Keep your service title,
                                availability and images
                                up to date so customers
                                always have accurate
                                information.
                            </p>

                        </div>

                    </div>

                </aside>


            </div>

        </main>

    );
}