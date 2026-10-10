"use client";

import { useState } from "react";
import Link from "next/link";

type DeliveryActionProps = {
orderId: string;
status: "PENDING" | "DELIVERED";
customerName: string;
 
};

export default function DeliveryAction({
orderId,
status,
customerName,
 
}: DeliveryActionProps) {
const [showConfirmation, setShowConfirmation] =
useState(false);

    // Optionally, you can refresh the page or update the state to reflect the new status
             
const [isProcessing, setIsProcessing] =
    useState(false);

const [delivered, setDelivered] =
    useState(status === "DELIVERED");
    const [failed,setFailed]=useState(false)

  async function handleDeliveryAction(orderId: string, action: "DELIVERED" | "PENDING") {
        try {
            const response = await fetch("/api/agents/orders", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderId, status: action }),
            });

            if (!response.ok) {
                setFailed(true)
            }

         window.location.reload();
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    }
if (delivered) {
    return (
        <>
            <div className="delivery-action-card">

                <span className="action-eyebrow">
                    DELIVERY ACTION
                </span>

                <h2>
                    Delivery completed
                </h2>

                <p>
                    This order has already been delivered
                    successfully.
                </p>

                <div className="completed-delivery">

                    <div className="completed-icon">
                        ✓
                    </div>

                    <div>
                        <strong>
                            Delivered
                        </strong>

                        <span>
                            Order #{orderId}
                        </span>
                    </div>

                </div>

            </div>

            <div className="delivery-success">

                <div className="success-icon">
                    ✓
                </div>

                <div>
                    <strong>
                        Delivery completed successfully
                    </strong>

                    <p>
                        #{orderId} has been delivered to{" "}
                        {customerName}.
                    </p>
                </div>

                <Link
                    href="/agent/history"
                    className="success-history-link"
                >
                    View History →
                </Link>

            </div>
        </>
    );
}

return (
    <>
        <div className="delivery-action-card">

            <span className="action-eyebrow">
                DELIVERY ACTION
            </span>

            <h2>
                Complete this delivery
            </h2>

            <p>
                Once you have handed the order to the
                customer, confirm the delivery below.
            </p>

            <button
                className="mark-delivered-button"
                onClick={() =>
                    setShowConfirmation(true)
                }
                disabled={isProcessing}
            >
                <span>✓</span>

                Mark as Delivered
            </button>

        </div>

        {showConfirmation && (
            <div className="delivery-confirm-overlay">

                <div className="delivery-confirm-modal">

                    <div className="confirm-delivery-icon">
                        ✓
                    </div>

                    <h2>
                        Confirm delivery
                    </h2>

                    <p>
                        Are you sure you have successfully
                        delivered order{" "}
                        <strong>
                            #{orderId}
                        </strong>{" "}
                        to{" "}
                        <strong>
                            {customerName}
                        </strong>
                        ?
                    </p>

                    <div className="confirmation-warning">

                        <span>
                            !
                        </span>

                        <p>
                            Only confirm the delivery after
                            the customer has received the
                            order.
                        </p>

                    </div>

                    <div className="confirmation-actions">

                        <button
                            className="keep-order-button"
                            onClick={() =>
                                setShowConfirmation(false)
                            }
                            disabled={isProcessing}
                        >
                            Go Back
                        </button>

                        <button
                            className="confirm-delivery-button"
                            onClick={handleDeliveryAction.bind(
                                null,
                                orderId,
                                "DELIVERED"
                            )}
                            disabled={isProcessing}
                        >
                            {isProcessing
                                ? "Processing..."
                                : "Confirm Delivery"}
                        </button>

                    </div>

                </div>

            </div>
        )}
    </>
);
  

}
