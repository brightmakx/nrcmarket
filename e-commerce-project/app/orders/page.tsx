
import "../components/styles/orders.css";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import OrderItem from "../components/orderItem";

type Product = {
    id: number;
    name: string;
    imageUrl: string;
    rating: number | string;
    categoryId: number;
    price: number | string;
    quantity: number;
    description: string | null;
};

type OrderedProduct = {
    id: number;
    quantity: number;
    orderId: number;
    productId: number;
    orderTimePrice: number | string;
    product: Product;
};

type Seller = {
    id: string;
    name: string;
};

type Order = {
    id: number;
    quantity: number;
    userId: string;
    status: string;
    createdAt: Date | string;
    cost: number | string;
    sellerId: string | null;
    seller: Seller | null;
    orderedProducts: OrderedProduct[];
};

type ParentOrder = {
    id: number;
    quantity: number;
    userId: string;
    cost: number | string;
    createdAt: Date | string;
    orders: Order[];
};


export default async function OrdersPage() {

    const h = await headers();

    const res = await fetch("http://localhost:3000/api/orders", {
        headers: {
            cookie: h.get("cookie") ?? "",
        },
        cache: "no-store",
    });

    if (res.status === 401) {
        redirect("/login");
    }

    if (!res.ok) {
        return (
            <div className="orders-page">

                <div className="orders-error">

                    <h2>
                        Unable to load orders
                    </h2>

                    <p>
                        Something went wrong while loading your
                        order history.
                    </p>

                </div>

            </div>
        );
    }

    const data = await res.json();

    const history: ParentOrder[] =
        data.history ?? [];


    return (

        <div className="orders-page">

            <div className="orders-header">

                <h2>
                    Order History
                </h2>

                <p>
                    View your previous orders and their details.
                </p>

            </div>


            {history.length === 0 ? (

                <div className="empty-orders">

                    <h3>
                        No orders yet
                    </h3>

                    <p>
                        Your orders will appear here once
                        you make a purchase.
                    </p>

                </div>

            ) : (

                <div className="orders-list">

                    {history.map((order) => (

                        <OrderItem
                            key={order.id}
                            order={order}
                        />

                    ))}

                </div>

            )}

        </div>
    );
}

