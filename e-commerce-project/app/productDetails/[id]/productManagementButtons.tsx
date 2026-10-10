"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProductManagementButtons({
    productId,
    productName,
    onOffer,
}: {
    productId: number;
    productName: string;
    onOffer: boolean | null | undefined;
}) {
    const [deleting, setDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [offerStatus, setOfferStatus] = useState(
        onOffer ?? false
    );

    const [togglingOffer, setTogglingOffer] =
        useState(false);

    function handleInitiateDelete(
        event: React.MouseEvent
    ) {
        event.preventDefault();
        event.stopPropagation();
        setShowConfirm(true);
    }

    function handleCancelDelete(
        event: React.MouseEvent
    ) {
        event.preventDefault();
        event.stopPropagation();
        setShowConfirm(false);
    }

    async function handleToggleOffer(
        event: React.MouseEvent
    ) {
        event.preventDefault();
        event.stopPropagation();

        const newStatus = !offerStatus;

        try {
            setTogglingOffer(true);

            const response = await fetch(
                `/api/products?id=${productId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        onOffer: newStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    "Failed to update offer status"
                );
            }

            setOfferStatus(newStatus);

            toast.success(
                newStatus
                    ? "Product added to offers"
                    : "Product removed from offers"
            );

        } catch (error) {
            console.error(
                "UPDATE OFFER STATUS ERROR:",
                error
            );

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update offer status"
            );

        } finally {
            setTogglingOffer(false);
        }
    }

    async function handleConfirmDelete(
        event: React.MouseEvent
    ) {
        event.preventDefault();
        event.stopPropagation();

        try {
            setDeleting(true);

            console.log(
                "SENDING DELETE REQUEST:",
                productId
            );

            const response = await fetch(
                `/api/products?id=${productId}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Failed to delete product"
                );
            }

            toast.success(
                "Product deleted successfully"
            );

            window.location.href = "/";

        } catch (error) {
            console.error(
                "DELETE PRODUCT ERROR:",
                error
            );

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to delete product"
            );

            setDeleting(false);
            setShowConfirm(false);
        }
    }

    return (
        <div
            className="product-management"
            onClick={(e) =>
                e.stopPropagation()
            }
        >

            <div className="management-title">
                <span>
                    Product Management
                </span>
            </div>

            {/* OFFER TOGGLE */}

            <div className="offer-management">

                <div className="offer-info">
                    <span className="offer-label">
                        Offer Status
                    </span>

                    <span
                        className={
                            offerStatus
                                ? "offer-status active"
                                : "offer-status"
                        }
                    >
                        {offerStatus
                            ? "On Offer"
                            : "Not On Offer"}
                    </span>
                </div>

                <button
                    type="button"
                    className={
                        offerStatus
                            ? "offer-toggle active"
                            : "offer-toggle"
                    }
                    onClick={handleToggleOffer}
                    disabled={togglingOffer}
                    aria-label={
                        offerStatus
                            ? "Remove product from offers"
                            : "Add product to offers"
                    }
                >
                    <span className="offer-toggle-circle">
                    </span>
                </button>

            </div>

            <div className="management-buttons">

                <Link
                    href={`/editProduct/${productId}`}
                    className="edit-product-button"
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                >
                    ✏️ Edit Product
                </Link>

                <button
                    type="button"
                    className="delete-product-button"
                    onClick={
                        handleInitiateDelete
                    }
                    disabled={deleting}
                >
                    {deleting
                        ? "Deleting..."
                        : "🗑️ Delete Product"}
                </button>

            </div>

            {/* Inline Confirmation Prompt */}

            {showConfirm && (
                <div
                    className="confirm-delete-box"
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                    style={{
                        marginTop: "10px",
                        padding: "10px",
                        border:
                            "1px solid #ff4d4f",
                        borderRadius: "6px",
                        backgroundColor:
                            "#fff2f0",
                        display: "flex",
                        flexDirection:
                            "column",
                        gap: "8px",
                    }}
                >

                    <p
                        style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "#cf1322",
                        }}
                    >
                        Delete{" "}
                        <strong>
                            "{productName}"
                        </strong>
                        ?
                    </p>

                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                        }}
                    >

                        <button
                            type="button"
                            onClick={
                                handleConfirmDelete
                            }
                            disabled={deleting}
                            style={{
                                backgroundColor:
                                    "#ff4d4f",
                                color: "#fff",
                                border: "none",
                                padding:
                                    "4px 12px",
                                borderRadius:
                                    "4px",
                                cursor: "pointer",
                            }}
                        >
                            {deleting
                                ? "Deleting..."
                                : "Yes, Delete"}
                        </button>

                        <button
                            type="button"
                            onClick={
                                handleCancelDelete
                            }
                            disabled={deleting}
                            style={{
                                backgroundColor:
                                    "#ccc",
                                color: "#333",
                                border: "none",
                                padding:
                                    "4px 12px",
                                borderRadius:
                                    "4px",
                                cursor: "pointer",
                            }}
                        >
                            Cancel
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}