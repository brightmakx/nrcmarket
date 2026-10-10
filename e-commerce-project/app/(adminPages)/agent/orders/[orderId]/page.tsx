 import Link from "next/link";
import DeliveryAction from "./DeliveryAction";
import "../../../../components/styles/agent-order-details.css";
import { headers } from "next/headers";

type OrderItem = {
name: string;
quantity: number;
price: number;
};

type Order = {
id: string;
customer: {
name: string;
phone: string;
email: string;
location: string;
};
items: OrderItem[];
total: number;
status: "PENDING" | "DELIVERED";
assignedAt: string;
notes: string;
};

const mockOrder: Order = {
id: "ORD-1024",

  
customer: {
    name: "Manda Bright",
    phone: "+265 991 234 567",
    email: "manda@example.com",
    location: "Blantyre, Malawi",
},

items: [
    {
        name: "4G Router",
        quantity: 1,
        price: 120000,
    },
    {
        name: "Power Bank",
        quantity: 2,
        price: 45000,
    },
],

total: 210000,

status: "PENDING",

assignedAt: "Today, 8:30 AM",

notes: "Please call the customer when you are close to the delivery location.",
  

};

function formatCurrency(amount: number) {
return `MK ${amount.toLocaleString()}`;
}

export default async function AgentOrderDetailsPage({
params,
}: {
params: Promise<{ orderId: string }>;
}) {
    const { orderId } = await params;

    const h=await headers()
    const res=await fetch(`http://localhost:3000/api/agents/orders?orderId=${orderId}`,{
        cache:"no-store",
        headers:{
             cookie: h.get("cookie") ?? "",
        }
    })
    const data=await res.json()
    const Order=data.data

    async function handleDeliveryAction(orderId: string, action: "DELIVERED" | "PENDING") {
        try {
            const response = await fetch("/api/agents/orders", {
                method: "UPDATE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderId, status: action }),
            });

            if (!response.ok) {
                throw new Error("Failed to update order status");
            }

            // Optionally, you can refresh the page or update the state to reflect the new status
            window.location.reload();
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    }
/*
 * Later this is where we will fetch the real order.
 *
 * Example:
 *
 * const response = await fetch(
 *     `${process.env.API_URL}/agent/orders/${orderId}`,
 *     {
 *         cache: "no-store",
 *     }
 * );
 *
 * const order = await response.json();
 */

 

return (
    <main className="agent-order-details-page">
        <div className="agent-order-details-container">

            {/* HEADER */}
            <header className="order-details-header">

                <Link
                    href="/agent/orders"
                    className="back-orders-link"
                >
                    ← Back to My Orders
                </Link>

                <div className="order-title-row">

                    <div>
                        <span className="order-details-eyebrow">
                            DELIVERY ORDER
                        </span>

                        <h1>#{Order.id}</h1>
                    </div>

                    <span
                        className={`details-status details-status-${Order.status.toLowerCase()}`}
                    >
                        {Order.status === "PENDING"
                            ? "Pending Delivery"
                            : "Delivered"}
                    </span>

                </div>

                <p>
                    Review the order information before completing
                    the delivery.
                </p>

            </header>

            {/* CONTENT */}
            <div className="order-details-grid">

                {/* LEFT */}
                <div className="order-details-main">

                    {/* CUSTOMER */}
                    <section className="details-card">

                        <div className="details-card-header">

                            <div className="details-card-icon">
                                ◉
                            </div>

                            <div>
                                <h2>
                                    Customer Information
                                </h2>

                                <p>
                                    Information about the customer
                                    receiving this order.
                                </p>
                            </div>

                        </div>

                        <div className="customer-information">

                            <div className="customer-field">
                                <span>Name</span>

                                <strong>
                                    {Order.customer.name}
                                </strong>
                            </div>

                            <div className="customer-field">
                                <span>Phone</span>

                                <strong>
                                    {Order.customer.phone}
                                </strong>
                            </div>

                            <div className="customer-field">
                                <span>Email</span>

                                <strong>
                                    {Order.customer.email}
                                </strong>
                            </div>

                        </div>

                    </section>

                    {/* LOCATION */}
                    <section className="details-card">

                        <div className="details-card-header">

                            <div className="details-card-icon">
                                ◎
                            </div>

                            <div>
                                <h2>
                                    Delivery Location
                                </h2>

                                <p>
                                    Where this order needs to be
                                    delivered.
                                </p>
                            </div>

                        </div>

                        <div className="location-box">

                            <div className="location-icon">
                                ◎
                            </div>

                            <div>
                                <span>
                                    Customer Address
                                </span>

                                <strong>
                                    {Order.customer.location}
                                </strong>
                            </div>

                        </div>

                    </section>

                    {/* ORDER ITEMS */}
                    <section className="details-card">

                        <div className="details-card-header">

                            <div className="details-card-icon">
                                #
                            </div>

                            <div>
                                <h2>
                                    Order Items
                                </h2>

                                <p>
                                    Products included in this
                                    delivery.
                                </p>
                            </div>

                        </div>

                        <div className="order-items">

                            {Order.items.map((item:any, index:any) => (
                                <div
                                    className="order-item"
                                    key={index}
                                >

                                    <div className="item-number">
                                        {index + 1}
                                    </div>

                                    <div className="item-details">

                                        <strong>
                                            {item.name}
                                        </strong>

                                        <span>
                                            Quantity:{" "}
                                            {item.quantity}
                                        </span>

                                    </div>

                                    <div className="item-price">

                                        <strong>
                                            {formatCurrency(
                                                item.price *
                                                    item.quantity
                                            )}
                                        </strong>

                                    </div>

                                </div>
                            ))}

                        </div>

                        <div className="order-total">

                            <span>
                                Order Total
                            </span>

                            <strong>
                                {formatCurrency(Order.total)}
                            </strong>

                        </div>

                    </section>

                    {/* NOTES */}
                    {Order.notes && (
                        <section className="details-card">

                            <div className="details-card-header">

                                <div className="details-card-icon">
                                    !
                                </div>

                                <div>
                                    <h2>
                                        Delivery Notes
                                    </h2>

                                    <p>
                                        Important information for
                                        this delivery.
                                    </p>
                                </div>

                            </div>

                            <div className="delivery-notes">
                                {Order.notes}
                            </div>

                        </section>
                    )}

                </div>

                {/* RIGHT */}
                <aside className="order-details-sidebar">

                    <DeliveryAction
                        orderId={Order.id}
                        status={Order.status}
                        customerName={Order.customer.name}
                    />

                    {/* ORDER INFORMATION */}
                    <div className="order-meta-card">

                        <h3>
                            Order Information
                        </h3>

                        <div className="order-meta-list">

                            <div>
                                <span>
                                    Order ID
                                </span>

                                <strong>
                                    #{Order.id}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Assigned
                                </span>

                                <strong>
                                    {Order.assignedAt}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Items
                                </span>

                                <strong>
                                    {Order.items.reduce(
                                        (total:any, item:any) =>
                                            total +
                                            item.quantity,
                                        0
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Total
                                </span>

                                <strong>
                                    {formatCurrency(
                                        Order.total
                                    )}
                                </strong>
                            </div>

                        </div>

                    </div>

                    {/* HELP */}
                    <div className="delivery-help-card">

                        <div className="help-icon">
                            ?
                        </div>

                        <div>
                            <strong>
                                Need help?
                            </strong>

                            <p>
                                Contact support if there is
                                a problem with this delivery.
                            </p>
                        </div>

                    </div>

                </aside>

            </div>

        </div>
    </main>
);
  

}
