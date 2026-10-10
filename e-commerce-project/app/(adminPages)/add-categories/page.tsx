"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import "./add-category.css";

export default function AddCategoryPage() {

    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const [errors, setErrors] =
        useState<Record<string, string>>({});

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        e: FormEvent<HTMLFormElement>
    ) {

        e.preventDefault();

        setErrors({});
        setMessage("");
        setLoading(true);

        try {

            const formData = new FormData();

            formData.append("name", name);
            formData.append("description", description);

            if (image) {
                formData.append("image", image);
            }

            const res = await fetch(
                "/api/categories",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const result = await res.json();

            if (!res.ok) {

                if (result.errors) {
                    setErrors(result.errors);
                }

                setMessage(
                    result.message ||
                    "Failed to create category."
                );

                return;
            }

            router.push("/");

        } catch {

            setMessage(
                "Something went wrong. Please try again."
            );

        } finally {

            setLoading(false);
        }
    }

    return (
        <main className="add-category-page">

            <div className="add-category-container">

                <div className="add-category-header">
                    <h1>Add Category</h1>

                    <p>
                        Create a new product category.
                    </p>
                </div>

                <form
                    className="add-category-form"
                    onSubmit={handleSubmit}
                >

                    <div className="category-form-group">

                        <label htmlFor="name">
                            Category name
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="e.g. Electronics"
                        />

                        {errors.name && (
                            <span className="category-field-error">
                                {errors.name}
                            </span>
                        )}

                    </div>

                    <div className="category-form-group">

                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Describe this category..."
                            rows={5}
                        />

                        {errors.description && (
                            <span className="category-field-error">
                                {errors.description}
                            </span>
                        )}

                    </div>

                    <div className="category-form-group">

                        <label htmlFor="image">
                            Category image
                        </label>

                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setImage(
                                    e.target.files?.[0] || null
                                )
                            }
                        />

                        {errors.image && (
                            <span className="category-field-error">
                                {errors.image}
                            </span>
                        )}

                        {image && (
                            <p className="selected-image">
                                Selected: {image.name}
                            </p>
                        )}

                    </div>

                    {message && (
                        <div className="category-form-message">
                            {message}
                        </div>
                    )}

                    <div className="add-category-actions">

                        <button
                            type="button"
                            className="category-cancel-btn"
                            onClick={() =>
                                router.back()
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="category-submit-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Create Category"}
                        </button>

                    </div>

                </form>

            </div>

        </main>
    );
}