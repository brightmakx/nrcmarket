
"use client";

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import "../../components/styles/profile.css";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function ProfilePage() {

    const [user, setUser] = useState<any>(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
    });

    const [image, setImage] =
        useState<File | null>(null);

    const [imagePreview, setImagePreview] =
        useState<string>("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [success, setSuccess] =
        useState("");

    const [error, setError] =
        useState("");


    /*
     * Fetch user information
     */
    useEffect(() => {

        async function fetchUser() {

            try {

                setLoading(true);
                setError("");

                console.log(
                    "[PROFILE] Fetching user..."
                );

                const res = await fetch(
                    "/api/users?includeOrders=true"
                );

                console.log(
                    "[PROFILE] User response:",
                    res.status
                );

                const data = await res.json();

                if (!res.ok) {

                    throw new Error(
                        data.error ||
                        "Failed to fetch user"
                    );
                }

                console.log(
                    "[PROFILE] User loaded successfully"
                );

                setUser(data.data);

                setForm({
                    name:
                        data.data.name || "",

                    email:
                        data.data.email || "",

                    phone:
                        data.data.phone || "",

                    location:
                        data.data.location || "",
                });

            } catch (error) {

                console.error(
                    "[PROFILE] Failed to fetch user:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch user"
                );

            } finally {

                setLoading(false);
            }
        }

        fetchUser();

    }, []);


    /*
     * Clean image preview when component
     * is removed.
     */
    useEffect(() => {

        return () => {

            if (imagePreview) {

                URL.revokeObjectURL(
                    imagePreview
                );
            }
        };

    }, [imagePreview]);


    /*
     * Handle text inputs
     */
    const handleChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {

        const {
            name,
            value,
        } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setSuccess("");
        setError("");
    };


    /*
     * Handle profile image
     */
    const handleImageChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {

        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }


        /*
         * =========================
         * IMAGE SIZE
         * =========================
         */

        if (file.size > MAX_IMAGE_SIZE) {

            setImage(null);

            setError(
                "Image must not be larger than 5 MB."
            );

            e.target.value = "";

            return;
        }


        /*
         * =========================
         * IMAGE TYPE
         * =========================
         */

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            setImage(null);

            setError(
                "Only JPG, PNG and WEBP images are allowed."
            );

            e.target.value = "";

            return;
        }


        /*
         * =========================
         * PREVIOUS PREVIEW
         * =========================
         */

        if (imagePreview) {

            URL.revokeObjectURL(
                imagePreview
            );
        }


        /*
         * =========================
         * NEW IMAGE
         * =========================
         */

        const preview =
            URL.createObjectURL(file);

        setImage(file);

        setImagePreview(preview);

        setSuccess("");
        setError("");
    };


    /*
     * Remove selected image
     */
    const removeImage = () => {

        if (imagePreview) {

            URL.revokeObjectURL(
                imagePreview
            );
        }

        setImage(null);
        setImagePreview("");

        setSuccess("");
        setError("");
    };


    /*
     * Submit profile changes
     */
    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        console.log(
            "[PROFILE] Starting profile update..."
        );

        setSaving(true);
        setSuccess("");
        setError("");


        try {

            /*
             * =========================
             * VALIDATE IMAGE AGAIN
             * =========================
             */

            if (
                image &&
                image.size > MAX_IMAGE_SIZE
            ) {

                throw new Error(
                    "Image must not be larger than 5 MB."
                );
            }


            /*
             * =========================
             * FORM DATA
             * =========================
             */

            const formData =
                new FormData();

            formData.append(
                "name",
                form.name
            );

            formData.append(
                "phone",
                form.phone
            );

            formData.append(
                "location",
                form.location
            );


            /*
             * Only send image when
             * the user selected one.
             */
            if (image) {

                formData.append(
                    "image",
                    image
                );
            }


            /*
             * =========================
             * LOG FORM DATA
             * =========================
             */

            console.log(
                "[PROFILE] FormData:"
            );

            for (
                const [key, value]
                of formData.entries()
            ) {

                if (value instanceof File) {

                    console.log(
                        key,
                        {
                            name: value.name,
                            size: value.size,
                            type: value.type,
                        }
                    );

                } else {

                    console.log(
                        key,
                        value
                    );
                }
            }


            /*
             * =========================
             * REQUEST
             * =========================
             */

            console.log(
                "[PROFILE] Sending PUT request..."
            );

            const res = await fetch(
                "/api/users",
                {
                    method: "PUT",
                    body: formData,
                }
            );


            /*
             * =========================
             * RESPONSE
             * =========================
             */

            console.log(
                "[PROFILE] Response status:",
                res.status
            );


            let data: any = null;

            try {

                data = await res.json();

            } catch {

                console.warn(
                    "[PROFILE] Response was not JSON"
                );
            }


            console.log(
                "[PROFILE] Response data:",
                data
            );


            /*
             * =========================
             * ERROR RESPONSE
             * =========================
             */

            if (!res.ok) {

                const apiError =
                    data?.error ||
                    data?.message ||
                    "Failed to update profile";

                throw new Error(
                    apiError
                );
            }


            /*
             * =========================
             * SUCCESS
             * =========================
             */

            console.log(
                "[PROFILE] Profile updated successfully"
            );

            setSuccess(
                data?.message ||
                "Profile updated successfully."
            );

            /*
             * Remove selected file from
             * local state after successful
             * upload.
             */
            setImage(null);

            /*
             * Keep the preview visible.
             * The next page refresh will load
             * the image from the database.
             */

        } catch (error) {

            console.error(
                "[PROFILE] Profile update failed:",
                error
            );


            /*
             * Fetch itself failed.
             */
            if (
                error instanceof TypeError &&
                error.message ===
                    "Failed to fetch"
            ) {

                setError(
                    "Unable to connect to the server. Please check your connection and try again."
                );

            } else {

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to update profile"
                );
            }

        } finally {

            console.log(
                "[PROFILE] Update request finished"
            );

            setSaving(false);
        }
    };


    /*
     * Loading state
     */
    if (loading) {

        return (
            <main className="profile-page">

                <div className="profile-container">

                    <div className="profile-loading">

                        Loading profile...

                    </div>

                </div>

            </main>
        );
    }


    return (

        <main className="profile-page">

            <div className="profile-container">


                {/* =========================
                    HEADER
                ========================== */}

                <div className="profile-page-header">

                    <div>

                        <Link
                            href="/account"
                            className="profile-back-link"
                        >
                            ← Back to Account
                        </Link>

                        <h1>
                            Edit Profile
                        </h1>

                        <p>
                            Update your personal
                            information and profile
                            image.
                        </p>

                    </div>

                </div>


                {/* =========================
                    GLOBAL ERROR
                ========================== */}

                {error && (

                    <div className="profile-error">

                        {error}

                    </div>

                )}


                <div className="profile-layout">


                    {/* =========================
                        PROFILE FORM
                    ========================== */}

                    <section className="profile-form-card">

                        <form
                            onSubmit={handleSubmit}
                        >


                            {/* PROFILE IMAGE */}

                            <div className="profile-image-section">

                                <div className="profile-image-wrapper">

                                    {imagePreview ||
                                    user?.image ? (

                                        <Image
                                            src={
                                                imagePreview ||
                                                `/images/${user?.image}`
                                            }
                                            alt="Profile"
                                            className="profile-image"
                                            width={100}
                                            height={100}
                                        />

                                    ) : (

                                        <div className="profile-image-placeholder">

                                            {form.name
                                                .split(" ")
                                                .filter(Boolean)
                                                .map(
                                                    (name) =>
                                                        name[0]
                                                )
                                                .join("")
                                                .slice(
                                                    0,
                                                    2
                                                )
                                                .toUpperCase()}

                                        </div>

                                    )}

                                </div>


                                <div className="image-controls">

                                    <h2>
                                        Profile Image
                                    </h2>

                                    <p>
                                        Choose a clear
                                        image for your
                                        profile.
                                    </p>


                                    <div className="image-buttons">

                                        <label
                                            htmlFor="profile-image"
                                            className="choose-image-button"
                                        >
                                            Change Image
                                        </label>

                                        <input
                                            id="profile-image"
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={
                                                handleImageChange
                                            }
                                            className="hidden-image-input"
                                        />


                                        {image && (

                                            <button
                                                type="button"
                                                className="remove-profile-image"
                                                onClick={
                                                    removeImage
                                                }
                                            >
                                                Remove
                                            </button>

                                        )}

                                    </div>


                                    <span className="image-hint">

                                        JPG, PNG or WEBP
                                        · Maximum 5 MB

                                    </span>

                                </div>

                            </div>


                            {/* DIVIDER */}

                            <div className="profile-divider" />


                            {/* =========================
                                PERSONAL INFORMATION
                            ========================== */}

                            <div className="profile-section">

                                <div className="profile-section-heading">

                                    <h2>
                                        Personal Information
                                    </h2>

                                    <p>
                                        Update your basic
                                        account information.
                                    </p>

                                </div>


                                <div className="profile-form-grid">


                                    {/* NAME */}

                                    <div className="profile-form-group">

                                        <label htmlFor="name">
                                            Full Name
                                        </label>

                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={
                                                form.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter your full name"
                                            required
                                        />

                                    </div>


                                    {/* EMAIL */}

                                    <div className="profile-form-group">

                                        <label htmlFor="email">
                                            Email Address
                                        </label>

                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={
                                                form.email
                                            }
                                            readOnly
                                        />

                                    </div>


                                    {/* PHONE */}

                                    <div className="profile-form-group">

                                        <label htmlFor="phone">
                                            Phone Number
                                        </label>

                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={
                                                form.phone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter your phone number"
                                            required
                                        />

                                    </div>


                                    {/* LOCATION */}

                                    <div className="profile-form-group">

                                        <label htmlFor="location">
                                            Location
                                        </label>

                                        <input
                                            id="location"
                                            name="location"
                                            type="text"
                                            value={
                                                form.location
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. Blantyre, Malawi"
                                            required
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* =========================
                                FORM FOOTER
                            ========================== */}

                            <div className="profile-form-footer">

                                <div>

                                    {success && (

                                        <span className="profile-success">

                                            ✓ {success}

                                        </span>

                                    )}

                                </div>


                                <div className="profile-actions">

                                    <Link
                                        href="/account"
                                        className="cancel-profile-button"
                                    >
                                        Cancel
                                    </Link>


                                    <button
                                        type="submit"
                                        className="save-profile-button"
                                        disabled={saving}
                                    >

                                        {saving
                                            ? "Saving..."
                                            : "Save Changes"}

                                    </button>

                                </div>

                            </div>

                        </form>

                    </section>


                    {/* =========================
                        SIDEBAR
                    ========================== */}

                    <aside className="profile-sidebar">


                        <div className="profile-info-card">

                            <h2>
                                Profile
                            </h2>

                            <p>
                                Keep your information
                                up to date so customers
                                and other users can
                                identify you correctly.
                            </p>


                            <div className="profile-info-item">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {form.email}
                                </strong>

                            </div>


                            <div className="profile-info-item">

                                <span>
                                    Phone
                                </span>

                                <strong>
                                    {form.phone ||
                                        "Not provided"}
                                </strong>

                            </div>


                            <div className="profile-info-item">

                                <span>
                                    Location
                                </span>

                                <strong>
                                    {form.location ||
                                        "Not provided"}
                                </strong>

                            </div>

                        </div>


                        <div className="profile-help-card">

                            <div className="profile-help-icon">
                                ?
                            </div>

                            <h3>
                                Need Help?
                            </h3>

                            <p>
                                Make sure your
                                information is
                                accurate before
                                saving your changes.
                            </p>

                        </div>

                    </aside>

                </div>

            </div>

        </main>
    );
}

