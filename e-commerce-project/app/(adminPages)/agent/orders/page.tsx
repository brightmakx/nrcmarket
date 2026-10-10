"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import "../../../components/styles/agent-orders.css";

type OrderStatus = "PENDING" | "DELIVERED";

type Order = {
id: string;
customer: string;
phone: string;
location: string;
items: number;
total: number;
status: OrderStatus;
createdAt?: string;
updatedAt?:string
 
};

export function todayOders( orders:any[]) {
    //console.log("checking today orders from orders: ",orders)
    const today = new Date();
    const todayOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
            orderDate.getDate() === today.getDate() &&
            orderDate.getMonth() === today.getMonth() &&
            orderDate.getFullYear() === today.getFullYear()
        );
    });
    //console.log("today orders: ",todayOrders)
    return todayOrders;
}



export default function AgentOrdersPage() {
    const [search, setSearch] = useState("");
    const [searching, setSearching] = useState(false);
    const [status, setStatus] = useState<"ALL" | OrderStatus>("ALL");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [today_orders, setTodayOrders] = useState<Order[]>([]);
    const [completedTodayOrders, setCompletedTodayOrders] = useState<Order[]>([]);
    

    function completedToday(orders:Order[]):Order[]{
        //console.log("delivered orders: ",orders.filter((o)=>o.status==="DELIVERED"))
        const today = new Date();
        const completedOrders = orders.filter((order) => {
        const deliveredDate = new Date(order.updatedAt||"");
        return (
                order.status === "DELIVERED" &&
                deliveredDate.getDate() === today.getDate() &&
                deliveredDate.getMonth() === today.getMonth() &&
                deliveredDate.getFullYear() === today.getFullYear()
            );
    });
    return completedOrders;
}
    useEffect(() => {
            async function fetchOrders() {
                const response = await fetch("/api/agents/orders?includeDelivered=true");
                if (!response.ok) {
                    console.error("Failed to fetch orders");
                    return;
                }
                const data = await response.json();
                setOrders(data.data);
                setLoaded(true);
                setTodayOrders(todayOders(data.data));
                setCompletedTodayOrders(completedToday(data.data));

            }

            fetchOrders();
    }, []);

const filteredOrders = useMemo(() => {
    const searchValue = search.toLowerCase().trim();
    const noDeliveredOrders = orders.filter(order => order.status !== "DELIVERED");
    return noDeliveredOrders.filter((order) => {
        const matchesSearch =
            order.customer.toLowerCase().includes(searchValue) ||
            order.phone.toLowerCase().includes(searchValue) ||
            order.location.toLowerCase().includes(searchValue);

        const matchesStatus =
            status === "ALL" || order.status === status;

        return matchesSearch && matchesStatus;
    });
}, [search, status,orders]);

function formatCurrency(amount: number) {
    return `MK ${amount.toLocaleString()}`;
}

if(!loaded){
    return <div>Loading...</div>
}

return (
    <main className="agent-orders-page">
        <div className="agent-orders-container">

            {/* HEADER */}
            <header className="agent-orders-header">
                <div>
                    <span className="agent-orders-eyebrow">
                        DELIVERY AGENT
                    </span>

                    <h1>My Orders</h1>

                    <p>
                        Orders assigned to you for delivery.
                    </p>
                </div>

                <Link
                    href="/agent"
                    className="back-dashboard-button"
                >
                    ← Dashboard
                </Link>
            </header>

            {/* SUMMARY */}
            <section className="orders-summary">

                <div className="orders-summary-card">
                    <div className="summary-icon">
                        ◷
                    </div>

                    <div>
                        <span>Pending Orders</span>
                        <strong>
                            {orders.filter(
                                order => order.status === "PENDING"
                            ).length}
                        </strong>
                    </div>
                </div>

                <div className="orders-summary-card">
                    <div className="summary-icon">
                        ✓
                    </div>

                    <div>
                        <span>Today's Orders</span>
                        
                        <strong>{
                        today_orders.length
                        }</strong>
                    </div>
                </div>

                <div className="orders-summary-card">
                    <div className="summary-icon">
                        ▣
                    </div>

                    <div>
                        <span>Completed Today</span>
                        <strong>{completedTodayOrders.length}</strong>
                    </div>
                </div>

            </section>

            {/* ORDERS CARD */}
            <section className="agent-orders-card">

                {/* TOOLBAR */}
                <div className="agent-orders-toolbar">

                    <div>
                        <h2>Assigned Orders</h2>

                        <p>
                            Select an order to view its delivery
                            details.
                        </p>
                    </div>

                    <div className="orders-toolbar-controls">

                        <div className="orders-search">
                            <span>⌕</span>

                            <input
                                type="text"
                                placeholder="Search order, customer..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </div>

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value as
                                        | "ALL"
                                        | OrderStatus
                                )
                            }
                        >
                            <option value="ALL">
                                All Orders
                            </option>

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="DELIVERED">
                                Delivered
                            </option>
                        </select>

                    </div>
                </div>

                {/* ORDER LIST */}
                <div className="agent-order-list">

                    {filteredOrders.map((order) => (
                        <div
                            className="agent-order-row"
                            key={order.id}
                        >

                            <div className="agent-order-number">
                                <div className="agent-order-icon">
                                    #
                                </div>

                                <div>
                                    <strong>
                                        {order.id}
                                    </strong>

                                    <span>
                                        Assigned{" "}
                                    </span>
                                </div>
                            </div>

                            <div className="agent-customer">
                                <span>Customer</span>

                                <strong>
                                    {order.customer}
                                </strong>

                                <small>
                                    {order.phone}
                                </small>
                            </div>

                            <div className="agent-location">
                                <span>Delivery Location</span>

                                <strong>
                                    {order.location}
                                </strong>
                            </div>

                            <div className="agent-order-total">
                                <span>
                                    {order.items}{" "}
                                    {order.items === 1
                                        ? "item"
                                        : "items"}
                                </span>

                                <strong>
                                    {formatCurrency(order.total)}
                                </strong>
                            </div>

                            <div className="agent-order-status">
                                <span
                                    className={`agent-status-badge agent-status-${order.status.toLowerCase()}`}
                                >
                                    {order.status === "PENDING"
                                        ? "Pending"
                                        : "Delivered"}
                                </span>
                            </div>

                            <div className="agent-order-action">
                                <Link
                                    href={`/agent/orders/${order.id}`}
                                    className="open-order-button"
                                >
                                    View Order
                                    <span>→</span>
                                </Link>
                            </div>

                        </div>
                    ))}

                </div>

                {/* EMPTY STATE */}
                {filteredOrders.length === 0 && (
                    <div className="agent-orders-empty">

                        <div className="empty-icon">
                            ⌕
                        </div>

                        <h3>No orders found</h3>

                        <p>
                            There are no orders matching your
                            search or filter.
                        </p>

                        {(search || status !== "ALL") && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setStatus("ALL");
                                }}
                            >
                                Clear Filters
                            </button>
                        )}

                    </div>
                )}

            </section>

            {/* INFORMATION */}
            <div className="agent-orders-note">

                <div className="note-icon">
                    ✓
                </div>

                <div>
                    <strong>
                        Delivery process
                    </strong>

                    <p>
                        Open an order to view the customer's
                        delivery information. Once the order has
                        been delivered, you can confirm the
                        delivery from the order details page.
                    </p>
                </div>

            </div>

        </div>
    </main>
);
 

}
