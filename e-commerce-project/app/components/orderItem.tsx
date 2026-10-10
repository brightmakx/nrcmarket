
import Image from "next/image";
import "./styles/orders.css";

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


export default function OrderItem({
    order
}: {
    order: ParentOrder
}) {

    return (

        <div className="order-card">

            {/* ================================
                PARENT ORDER HEADER
            ================================= */}

            <div className="order-top">

                <div>

                    <span className="order-label">
                        Order
                    </span>

                    <h3>
                        #{order.id}
                    </h3>

                </div>

            </div>


            {/* ================================
                ORDER INFORMATION
            ================================= */}

            <div className="order-info">

                <div className="order-info-item">

                    <span>
                        Date
                    </span>

                    <strong>
                        {new Date(
                            order.createdAt
                        ).toLocaleDateString()}
                    </strong>

                </div>


                <div className="order-info-item">

                    <span>
                        Items
                    </span>

                    <strong>
                        {order.quantity}
                    </strong>

                </div>


                <div className="order-info-item">

                    <span>
                        Total
                    </span>

                    <strong>
                        MK {Number(
                            order.cost
                        ).toLocaleString()}
                    </strong>

                </div>

            </div>


            {/* ================================
                SELLER ORDERS
            ================================= */}

            <div className="seller-orders">

                {order.orders.map(
                    (sellerOrder) => {

                        const sellerName =
                            sellerOrder.seller?.name ||
                            "Market";


                        return (

                            <div
                                className="seller-order"
                                key={sellerOrder.id}
                            >

                                {/* ================================
                                    SELLER HEADER
                                ================================= */}

                                <div className="seller-order-top">

                                    <div>

                                        <span className="seller-label">
                                            Owner
                                        </span>

                                        <h4>
                                            {sellerName}
                                        </h4>

                                    </div>


                                    <span
                                        className={`order-status ${sellerOrder.status.toLowerCase()}`}
                                    >
                                        {sellerOrder.status}
                                    </span>

                                </div>


                                {/* ================================
                                    SELLER ORDER INFORMATION
                                ================================= */}

                                <div className="seller-order-info">

                                    <div className="order-info-item">

                                        <span>
                                            Items
                                        </span>

                                        <strong>
                                            {sellerOrder.quantity}
                                        </strong>

                                    </div>


                                    <div className="order-info-item">

                                        <span>
                                            Total
                                        </span>

                                        <strong>
                                            MK {Number(
                                                sellerOrder.cost
                                            ).toLocaleString()}
                                        </strong>

                                    </div>

                                </div>


                                {/* ================================
                                    PRODUCTS
                                ================================= */}

                                <div className="ordered-products">

                                    <h4>
                                        Products
                                    </h4>


                                    {sellerOrder.orderedProducts.map(
                                        (orderedProduct) => {

                                            const product =
                                                orderedProduct.product;


                                            /*
                                             * Use orderTimePrice here instead
                                             * of product.price.
                                             *
                                             * product.price could have changed
                                             * since the order was placed.
                                             */

                                            const itemTotal =
                                                Number(
                                                    orderedProduct.orderTimePrice
                                                ) *
                                                orderedProduct.quantity;


                                            return (

                                                <div
                                                    className="ordered-product"
                                                    key={orderedProduct.id}
                                                >

                                                    {/* PRODUCT IMAGE */}

                                                    <div className="ordered-product-image">

                                                        <Image
                                                            src={`/images/${product.imageUrl}`}
                                                            alt={product.name}
                                                            width={100}
                                                            height={100}
                                                        />

                                                    </div>


                                                    {/* PRODUCT INFORMATION */}

                                                    <div className="ordered-product-details">

                                                        <h5>
                                                            {product.name}
                                                        </h5>


                                                        <p className="ordered-product-price">

                                                            MK{" "}
                                                            {Number(
                                                                orderedProduct.orderTimePrice
                                                            ).toLocaleString()}

                                                        </p>


                                                        <span>
                                                            Quantity:{" "}
                                                            {orderedProduct.quantity}
                                                        </span>

                                                    </div>


                                                    {/* PRODUCT TOTAL */}

                                                    <div className="ordered-product-total">

                                                        <span>
                                                            Total
                                                        </span>

                                                        <strong>
                                                            MK{" "}
                                                            {itemTotal.toLocaleString()}
                                                        </strong>

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            </div>

                        );

                    }
                )}

            </div>

        </div>
    );
}

