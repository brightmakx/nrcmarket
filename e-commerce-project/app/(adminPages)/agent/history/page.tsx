
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import "../../../components/styles/agent-history.css";

type Delivery = {
    id: string;
    customer: string;
    phone: string;
    location: string;
    items: number;
    total: number;
    deliveredAt: string;
    deliveredTime: string;
};

const Mhistory: Delivery[] = [
    {
        id: "ORD-1018",
        customer: "James Phiri",
        phone: "+265 888 123 456",
        location: "Lilongwe, Malawi",
        items: 2,
        total: 145000,
        deliveredAt: "September 4, 2026",
        deliveredTime: "3:45 PM",
    },
    {
        id: "ORD-1015",
        customer: "Mary Banda",
        phone: "+265 999 456 789",
        location: "Blantyre, Malawi",
        items: 1,
        total: 85000,
        deliveredAt: "September 4, 2026",
        deliveredTime: "11:20 AM",
    },
    {
        id: "ORD-1012",
        customer: "Peter Chirwa",
        phone: "+265 991 555 222",
        location: "Zomba, Malawi",
        items: 3,
        total: 230000,
        deliveredAt: "September 3, 2026",
        deliveredTime: "4:10 PM",
    },
    {
        id: "ORD-1009",
        customer: "Grace Mbewe",
        phone: "+265 888 777 111",
        location: "Mzuzu, Malawi",
        items: 2,
        total: 175000,
        deliveredAt: "September 2, 2026",
        deliveredTime: "2:30 PM",
    },
    {
        id: "ORD-1004",
        customer: "John Mwale",
        phone: "+265 999 222 333",
        location: "Lilongwe, Malawi",
        items: 4,
        total: 310000,
        deliveredAt: "September 1, 2026",
        deliveredTime: "10:15 AM",
    },
];

export default function AgentHistoryPage() {
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const [history,setHistory]=useState<Delivery[]>([])
    const [loading,setLoading]=useState(false)

    useEffect(()=>{
        async function fetchAgentHistory() {
            setLoading(true)
            const res=await fetch("/api/agents?includeHistory=true")
            if(res.ok){
                const data=await res.json()
                setHistory(data.data)
                setLoading(false)
            }
        }
        fetchAgentHistory()
    },[])



    const filteredDeliveries = useMemo(() => {
        return history.filter((delivery) => {
            const searchValue = search.toLowerCase();

            const matchesSearch =
                delivery.id.toLowerCase().includes(searchValue) ||
                delivery.customer.toLowerCase().includes(searchValue) ||
                delivery.phone.toLowerCase().includes(searchValue) ||
                delivery.location.toLowerCase().includes(searchValue);

            let matchesDate = true;

            if (dateFilter === "today") {
                matchesDate = delivery.deliveredAt === "September 5, 2026";
            }

            if (dateFilter === "week") {
                matchesDate = [
                    "September 1, 2026",
                    "September 2, 2026",
                    "September 3, 2026",
                    "September 4, 2026",
                    "September 5, 2026",
                ].includes(delivery.deliveredAt);
            }

            return matchesSearch && matchesDate;
        });
    }, [search, dateFilter]);

    const totalValue = history.reduce(
        (sum, delivery) => sum + delivery.total,
        0
    );

    const todayDeliveries = history.filter(
        (delivery) => delivery.deliveredAt === "September 5, 2026"
    ).length;

    if(loading){
        return <div>loading</div>
    }
    return (
        <main className="agent-history-page">
            <div className="agent-history-container">

                {/* Header */}
                <header className="agent-history-header">
                    <Link
                        href="/agent"
                        className="agent-history-back"
                    >
                        ← Back to Dashboard
                    </Link>

                    <h1>Delivery History</h1>

                    <p>
                        View the orders you have successfully delivered.
                    </p>
                </header>

                {/* Statistics */}
                <section className="history-stats">

                    <div className="history-stat-card">
                        <div className="history-stat-icon">
                            ✓
                        </div>

                        <div>
                            <span>Total Deliveries</span>
                            <strong>{history.length}</strong>
                        </div>
                    </div>

                    <div className="history-stat-card">
                        <div className="history-stat-icon">
                            📦
                        </div>

                        <div>
                            <span>Today's Deliveries</span>
                            <strong>{todayDeliveries}</strong>
                        </div>
                    </div>

                    <div className="history-stat-card">
                        <div className="history-stat-icon">
                            📅
                        </div>

                        <div>
                            <span>This Week</span>
                            <strong>{history.length}</strong>
                        </div>
                    </div>

                    <div className="history-stat-card">
                        <div className="history-stat-icon">
                            MK
                        </div>

                        <div>
                            <span>Delivery Value</span>
                            <strong>
                                MK {totalValue.toLocaleString()}
                            </strong>
                        </div>
                    </div>

                </section>

                {/* Filters */}
                <section className="history-filters">

                    <div className="history-search">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search order, customer, phone or location..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    <select
                        value={dateFilter}
                        onChange={(event) =>
                            setDateFilter(event.target.value)
                        }
                    >
                        <option value="all">
                            All Deliveries
                        </option>

                        <option value="today">
                            Today
                        </option>

                        <option value="week">
                            This Week
                        </option>
                    </select>

                </section>

                {/* History */}
                <section className="history-section">

                    <div className="history-section-header">
                        <h2>Completed Deliveries</h2>

                        <p>
                            {filteredDeliveries.length}{" "}
                            {filteredDeliveries.length === 1
                                ? "delivery"
                                : "deliveries"}{" "}
                            found
                        </p>
                    </div>

                    {filteredDeliveries.length === 0 ? (
                        <div className="history-empty">

                            <div className="history-empty-icon">
                                ✓
                            </div>

                            <h3>No deliveries found</h3>

                            <p>
                                Try changing your search or date filter.
                            </p>

                        </div>
                    ) : (
                        <div className="history-list">

                            {filteredDeliveries.map((delivery) => (
                                <article
                                    className="history-card"
                                    key={delivery.id}
                                >

                                    {/* Left */}
                                    <div className="history-card-main">

                                        <div className="history-order-icon">
                                            ✓
                                        </div>

                                        <div className="history-order-info">

                                            <div className="history-order-top">

                                                <h3>
                                                    {delivery.id}
                                                </h3>

                                                <span className="history-completed">
                                                    Delivered
                                                </span>

                                            </div>

                                            <p className="history-customer">
                                                {delivery.customer}
                                            </p>

                                            <div className="history-details">

                                                <span>
                                                    ☎ {delivery.phone}
                                                </span>

                                                <span>
                                                    📍 {delivery.location}
                                                </span>

                                                <span>
                                                    📦 {delivery.items}{" "}
                                                    {delivery.items === 1
                                                        ? "item"
                                                        : "items"}
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                    {/* Right */}
                                    <div className="history-card-right">

                                        <div className="history-date">

                                            <span>
                                                Delivered
                                            </span>

                                            <strong>
                                                {delivery.deliveredAt}
                                            </strong>

                                            <small>
                                                {delivery.deliveredTime}
                                            </small>

                                        </div>

                                        <div className="history-total">

                                            <span>
                                                Total
                                            </span>

                                            <strong>
                                                MK{" "}
                                                {delivery.total.toLocaleString()}
                                            </strong>

                                        </div>

                                        <Link
                                            href={`/agent/orders/${delivery.id}`}
                                            className="history-view-button"
                                        >
                                            View Order
                                        </Link>

                                    </div>

                                </article>
                            ))}

                        </div>
                    )}

                </section>

                {/* Information */}
                <section className="history-info">

                    <div className="history-info-icon">
                        ✓
                    </div>

                    <div>
                        <h3>Delivery records</h3>

                        <p>
                            This page shows orders that you have successfully
                            delivered. Once the backend is connected, these
                            records will be loaded automatically from your
                            delivery history.
                        </p>
                    </div>

                </section>

            </div>
        </main>
    );
}

