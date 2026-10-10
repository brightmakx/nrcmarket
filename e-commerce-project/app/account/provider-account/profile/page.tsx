
"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import "./provider.css";

type Provider = {
    name: string;
    location: string;
    phone: string;
    title: string;
    availability: string;
};

export default function EditProviderPage() {
    const [form, setForm] = useState<Provider>({
        name: "",
        location: "",
        phone: "",
        title: "",
        availability: "",
    });

    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function fetchProvider() {
            try {
                const response = await fetch("/api/providers");

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Failed to load provider information"
                    );
                }

                const provider = data.data;

                setForm({
                    name: provider.name || "",
                    location: provider.location || "",
                    phone: provider.phone || "",
                    title: provider.title || "",
                    availability: provider.availability || "",
                });
            } catch (error: any) {
                setError(
                    error.message ||
                    "Failed to load provider information"
                );
            } finally {
                setLoading(false);
            }
        }

        fetchProvider();
    }, []);

    function handleChange(
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));

        setError("");

        setFieldErrors(prev => ({
            ...prev,
            [name]: "",
        }));
    }

    function handleImages(e: ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);

        if (files.length === 0) return;

        const validFiles = files.filter(file =>
            [
                "image/jpeg",
                "image/png",
                "image/webp",
            ].includes(file.type)
        );

        if (validFiles.length !== files.length) {
            setError(
                "Only JPG, PNG and WEBP images are allowed."
            );
            return;
        }

        setImages(validFiles);

        const previews = validFiles.map(file =>
            URL.createObjectURL(file)
        );

        setImagePreviews(previews);

        setError("");
    }

    function removeImage(index: number) {
        URL.revokeObjectURL(imagePreviews[index]);

        setImages(prev =>
            prev.filter((_, i) => i !== index)
        );

        setImagePreviews(prev =>
            prev.filter((_, i) => i !== index)
        );
    }

    async function handleSubmit(
        e: FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setSaving(true);
        setError("");
        setFieldErrors({});
        setSuccess(false);

        try {
            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("location", form.location);
            formData.append("phone", form.phone);
            formData.append("title", form.title);
            formData.append(
                "availability",
                form.availability
            );

            images.forEach(image => {
                formData.append("images", image);
            });

            const response = await fetch("/api/providers", {
                method: "PUT",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setFieldErrors(data.errors);
                }

                setError(
                    data.error ||
                    "Failed to update provider information"
                );

                return;
            }

            setSuccess(true);

            // Remove temporary preview URLs
            imagePreviews.forEach(url =>
                URL.revokeObjectURL(url)
            );

            setImages([]);
            setImagePreviews([]);
        } catch (error) {
            console.error(
                "Provider update error:",
                error
            );

            setError(
                "Something went wrong. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="provider-page">
                <div className="provider-container">
                    <div className="provider-loading">
                        Loading provider information...
                    </div>
                </div>
            </main>
        );
    }

    /*
     * SUCCESS SCREEN
     */
    if (success) {
        return (
            <main className="provider-page">
                <div className="provider-container">
                    <div className="provider-success-page">

                        <div className="provider-success-icon">
                            ✓
                        </div>

                        <h1>
                            Provider Profile Updated
                        </h1>

                        <p className="provider-success-message">
                            Your provider information has been
                            successfully updated.
                        </p>

                        <div className="provider-success-details">

                            <div className="success-detail">
                                <span className="success-check">
                                    ✓
                                </span>

                                <div>
                                    <strong>
                                        Provider details
                                    </strong>

                                    <p>
                                        Your personal and contact
                                        information was updated.
                                    </p>
                                </div>
                            </div>

                            <div className="success-detail">
                                <span className="success-check">
                                    ✓
                                </span>

                                <div>
                                    <strong>
                                        Service information
                                    </strong>

                                    <p>
                                        Your service title and
                                        availability were updated.
                                    </p>
                                </div>
                            </div>

                            {images.length === 0 && (
                                <div className="success-detail">
                                    <span className="success-check">
                                        ✓
                                    </span>

                                    <div>
                                        <strong>
                                            Profile saved
                                        </strong>

                                        <p>
                                            Your provider profile
                                            is ready for customers.
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className="provider-success-actions">

                            <Link
                                href="/account"
                                className="provider-success-secondary"
                            >
                                Back to Account
                            </Link>

                            <Link
                                href="/account/provider-account"
                                className="provider-success-primary"
                            >
                                View Provider Profile
                            </Link>

                        </div>

                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="provider-page">

            <div className="provider-container">

                <div className="provider-header">

                    <div>

                        <Link
                            href="/account/provider-account"
                            className="provider-back"
                        >
                            ← Back to Account
                        </Link>

                        <h1>
                            Edit Provider Profile
                        </h1>

                        <p>
                            Update your service provider
                            information and availability.
                        </p>

                    </div>

                </div>

                <div className="provider-layout">

                    <section className="provider-card">

                        <form onSubmit={handleSubmit}>

                            {error && (
                                <div className="provider-error">

                                    <span>⚠</span>

                                    <div>
                                        {error}
                                    </div>

                                </div>
                            )}

                            <div className="provider-section">

                                <div className="provider-section-title">

                                    <h2>
                                        Basic Information
                                    </h2>

                                    <p>
                                        Keep your provider
                                        information accurate.
                                    </p>

                                </div>

                                <div className="provider-grid">

                                    <div className="provider-field">

                                        <label htmlFor="name">
                                            Full Name
                                        </label>

                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Your full name"
                                            required
                                        />

                                        {fieldErrors.name && (
                                            <span className="field-error">
                                                {fieldErrors.name}
                                            </span>
                                        )}

                                    </div>

                                    <div className="provider-field">

                                        <label htmlFor="phone">
                                            Phone Number
                                        </label>

                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="e.g. 0991234567"
                                            required
                                        />

                                        {fieldErrors.phone && (
                                            <span className="field-error">
                                                {fieldErrors.phone}
                                            </span>
                                        )}

                                    </div>

                                    <div className="provider-field">

                                        <label htmlFor="location">
                                            Location
                                        </label>

                                        <input
                                            id="location"
                                            name="location"
                                            type="text"
                                            value={form.location}
                                            onChange={handleChange}
                                            placeholder="e.g. Lilongwe"
                                            required
                                        />

                                        {fieldErrors.location && (
                                            <span className="field-error">
                                                {fieldErrors.location}
                                            </span>
                                        )}

                                    </div>

                                    <div className="provider-field">

                                        <label htmlFor="availability">
                                            Availability
                                        </label>

                                        <select
                                            id="availability"
                                            name="availability"
                                            value={form.availability}
                                            onChange={handleChange}
                                            required
                                        >

                                            <option value="">
                                                Select availability
                                            </option>

                                            <option value="available">
                                                Available
                                            </option>

                                            <option value="busy">
                                                Busy
                                            </option>

                                            <option value="unavailable">
                                                Unavailable
                                            </option>

                                        </select>

                                        {fieldErrors.availability && (
                                            <span className="field-error">
                                                {fieldErrors.availability}
                                            </span>
                                        )}

                                    </div>

                                </div>

                            </div>

                            <div className="provider-divider" />

                            <div className="provider-section">

                                <div className="provider-section-title">

                                    <h2>
                                        Service
                                    </h2>

                                    <p>
                                        Tell customers what service
                                        you provide.
                                    </p>

                                </div>

                                <div className="provider-field">

                                    <label htmlFor="title">
                                        Service Title
                                    </label>

                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Professional Web Developer"
                                        maxLength={60}
                                        required
                                    />

                                    <div className="title-counter">
                                        {form.title.length}/60
                                    </div>

                                    {fieldErrors.title && (
                                        <span className="field-error">
                                            {fieldErrors.title}
                                        </span>
                                    )}

                                </div>

                            </div>

                            <div className="provider-divider" />

                            <div className="provider-section">

                                <div className="provider-section-title">

                                    <h2>
                                        Service Images
                                    </h2>

                                    <p>
                                        Upload images that show
                                        your work or service.
                                    </p>

                                </div>

                                <label
                                    htmlFor="provider-images"
                                    className="image-upload-box"
                                >

                                    <div className="upload-icon">
                                        +
                                    </div>

                                    <strong>
                                        Choose Images
                                    </strong>

                                    <span>
                                        JPG, PNG or WEBP
                                    </span>

                                </label>

                                <input
                                    id="provider-images"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    onChange={handleImages}
                                    className="hidden-image-input"
                                />

                                {imagePreviews.length > 0 && (
                                    <div className="image-preview-grid">

                                        {imagePreviews.map(
                                            (preview, index) => (
                                                <div
                                                    className="image-preview"
                                                    key={preview}
                                                >

                                                    <img
                                                        src={preview}
                                                        alt={`Service image ${index + 1}`}
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeImage(index)
                                                        }
                                                    >
                                                        ×
                                                    </button>

                                                </div>
                                            )
                                        )}

                                    </div>
                                )}

                            </div>

                            <div className="provider-footer">

                                <Link
                                    href="/account"
                                    className="provider-cancel"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    className="provider-save"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>

                        </form>

                    </section>

                    <aside className="provider-sidebar">

                        <div className="provider-info-card">

                            <div className="provider-info-icon">
                                ✓
                            </div>

                            <h2>
                                Your Provider Profile
                            </h2>

                            <p>
                                Keep your provider details
                                accurate so customers know
                                who they are dealing with.
                            </p>

                            <div className="provider-info-item">

                                <span>
                                    Name
                                </span>

                                <strong>
                                    {form.name ||
                                        "Not provided"}
                                </strong>

                            </div>

                            <div className="provider-info-item">

                                <span>
                                    Location
                                </span>

                                <strong>
                                    {form.location ||
                                        "Not provided"}
                                </strong>

                            </div>

                            <div className="provider-info-item">

                                <span>
                                    Availability
                                </span>

                                <strong>
                                    {form.availability ||
                                        "Not provided"}
                                </strong>

                            </div>

                        </div>

                        <div className="provider-tip-card">

                            <div className="provider-tip-icon">
                                💡
                            </div>

                            <h3>
                                Tip
                            </h3>

                            <p>
                                Use a clear service title
                                and good-quality images
                                to make your provider profile
                                easier to understand.
                            </p>

                        </div>

                    </aside>

                </div>

            </div>

        </main>
    );
}

