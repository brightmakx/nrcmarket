"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "../../components/styles/agent.css";

type PendingOrder = {
id: string;
customer: string;
location: string;
items: number;
total: number;
time: string;
};

const pendingOrders: PendingOrder[] = [
{
id: "ORD-1024",
customer: "Manda Bright",
location: "Blantyre",
items: 3,
total: 210000,
time: "10 minutes ago",
},
{
id: "ORD-1027",
customer: "Peter Phiri",
location: "Lilongwe",
items: 1,
total: 85000,
time: "35 minutes ago",
},
{
id: "ORD-1029",
customer: "Grace Banda",
location: "Zomba",
items: 2,
total: 85000,
time: "1 hour ago",
},
{
id: "ORD-1031",
customer: "David Chirwa",
location: "Mzuzu",
items: 1,
total: 150000,
time: "2 hours ago",
},
];




export default function AgentDashboard() {
    const [agent, setAgent]=useState<any>({})
    const [orders,setOrders]=useState<any[]>([])

    useEffect(()=>{
        async function fetchAgent() {
            const res=await fetch("/api/agents")
            if(res.ok){
                const data=await res.json()
                setAgent(data.data)
            }
        }

        async function fetchOrders() {
            const res=await fetch("/api/agents/orders?includeDelivered=true")
            if(res.ok){
                const data=await res.json()
                setOrders(data.data)
            }
            await fetchAgent()
        }
        fetchOrders()
    },[])
    //console.log("pending orders: ",orders)

    function formatCurrency(amount: number) {
        return `MK ${amount.toLocaleString()}`;
    }

    function isToday(dateString: string) {
        const today = new Date();
        const date = new Date(dateString);
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }

    function getTodaysOrders(orders: any[]) {
        return orders.filter((order) => isToday(order.createdAt));
    }

    function recentOrders(numberOfOrders: number) {
        return orders.slice(0, numberOfOrders);
    }

return (
    <main className="agent-page">
        <div className="agent-container">

            {/* HEADER */}
            <header className="agent-header">
                <div>
                    <span className="agent-eyebrow">
                        DELIVERY AGENT
                    </span>

                    <h1>Good morning, {agent.name} 👋</h1>

                    <p>
                        Here is an overview of your delivery orders.
                    </p>
                </div>

                <div className="agent-profile">
                    <div className="agent-avatar">
                        {agent?.name?.split(" ")
                                        .map((name: any) => name[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                    </div>

                    <div>
                        <strong>{agent?.name}</strong>
                        <span>Delivery Agent</span>
                    </div>
                </div>
            </header>

            {/* STATISTICS */}
            <section className="agent-statistics">

                <div className="agent-stat-card">
                    <div className="agent-stat-icon pending-icon">
                        ◷
                    </div>

                    <div>
                        <span>Pending Orders</span>
                        <strong>{orders.filter((o)=>{return o.status=="PENDING"}).length}</strong>
                    </div>
                </div>

                <div className="agent-stat-card">
                    <div className="agent-stat-icon delivered-icon">
                        ✓
                    </div>

                    <div>
                        <span>Delivered</span>
                        <strong>{orders.filter((o)=>{return o.status=="DELIVERED"}).length}</strong>
                    </div>
                </div>

                <div className="agent-stat-card">
                    <div className="agent-stat-icon today-icon">
                        ▣
                    </div>

                    <div>
                        <span>Today's Deliveries</span>
                        <strong>{getTodaysOrders(orders).length}</strong>
                    </div>
                </div>

                <div className="agent-stat-card">
                    <div className="agent-stat-icon history-icon">
                        ↗
                    </div>

                    <div>
                        <span>Total Deliveries</span>
                        <strong>{orders.filter((o) => o.status === "PENDING").length}</strong>
                    </div>
                </div>

            </section>

            {/* MAIN CONTENT */}
            <section className="agent-main-grid">

                {/* PENDING ORDERS */}
                <div className="pending-orders-card">

                    <div className="card-header">
                        <div>
                            <span className="card-eyebrow">
                                DELIVERY QUEUE
                            </span>

                            <h2>Pending Orders</h2>

                            <p>
                                Orders currently assigned to you.
                            </p>
                        </div>

                        <Link
                            href="/agent/orders"
                            className="view-all-link"
                        >
                            View all →
                        </Link>
                    </div>

                    <div className="pending-orders-list">

                        {orders?.filter((order) => order.status === "PENDING").map((order) => (
                            <div
                                className="pending-order"
                                key={order.id}
                            >
                                <div className="order-main">

                                    <div className="order-icon">
                                        #
                                    </div>

                                    <div className="order-info">
                                        <strong>
                                            {order.id}
                                        </strong>

                                        <span>
                                            {order.customer}
                                        </span>

                                        <small>
                                            {order.location}
                                        </small>
                                    </div>

                                </div>

                                <div className="order-middle">
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

                                <div className="order-right">

                                    <small>
                                        {order.time}
                                    </small>

                                    <Link
                                        href={`/agent/orders/${order.id}`}
                                        className="order-view-button"
                                    >
                                        View Order
                                    </Link>

                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                {/* RIGHT SIDE */}
                <aside className="agent-side-column">

                    {/* HISTORY */}
                    <div className="agent-side-card">

                        <div className="side-card-header">
                            <div className="side-icon">
                                ↗
                            </div>

                            <div>
                                <h3>Delivery History</h3>

                                <p>
                                    View your completed deliveries.
                                </p>
                            </div>
                        </div>

                        <div className="history-summary">
                            <strong>{orders.filter((o) => o.status === "DELIVERED").length}</strong>

                            <span>
                                deliveries completed
                            </span>
                        </div>

                        <Link
                            href="/agent/history"
                            className="history-link"
                        >
                            View Delivery History
                            <span>→</span>
                        </Link>

                    </div>

                    {/* QUICK INFO */}
                    <div className="agent-side-card quick-info-card">

                        <div className="side-card-header">
                            <div className="side-icon">
                                ✓
                            </div>

                            <div>
                                <h3>Agent Status</h3>

                                <p>
                                    Your current delivery status.
                                </p>
                            </div>
                        </div>

                        <div className="agent-status">
                            <span className="status-dot"></span>

                            <div>
                                <strong>Available</strong>

                                <span>
                                    Ready for deliveries
                                </span>
                            </div>
                        </div>

                    </div>

                </aside>

            </section>

            {/* RECENT ACTIVITY */}
            <section className="recent-activity-card">

                <div className="card-header">
                    <div>
                        <span className="card-eyebrow">
                            ACTIVITY
                        </span>

                        <h2>Recent Deliveries</h2>

                        <p>
                            Your most recently completed orders.
                        </p>
                    </div>

                    <Link
                        href="/agent/history"
                        className="view-all-link"
                    >
                        View history →
                    </Link>
                </div>

                <div className="recent-deliveries">
                    {orders.filter((o) => o.status === "DELIVERED").slice(0, 3).map((order) => (
                        <RecentDelivery
                            key={order.id}
                            order={order}
                        />
                    ))}
                </div>

            </section>

        </div>
    </main>
);


}


function RecentDelivery({ order }: { order: PendingOrder }) {
    function formatCurrency(amount: number) {
        return `MK ${amount.toLocaleString()}`;
    }

    return (
        <div className="recent-delivery">
            <div className="recent-icon">
                ✓
            </div>

            <div className="recent-info">
                <strong>
                    {order.id}
                </strong>

                <span>
                    {order.customer} • {order.location}
                </span>
            </div>

            <div className="recent-date">
                <span>Delivered</span>
                <small>
                    {order.time}
                </small>
            </div>
        </div>
    );
}