"use client";

import { useState } from "react";
import { AddToCatBtn } from "./addToCartButton";

type ProductQuantityProps = {
product: {
id: number;
name: string;
price: number;
image: string;
stock: number;
};
};

export default function ProductQuantity({ product }: ProductQuantityProps) {
const [quantity, setQuantity] = useState(1);


return (
    <>
        <div className="quantity-section">
            <label htmlFor="quantity-option">Quantity</label>

            <select
                id="quantity-option"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
            >
                {Array.from(
                    { length: Math.min(product.stock, 5) },
                    (_, i) => i + 1
                ).map((number) => (
                    <option key={number} value={number}>
                        {number}
                    </option>
                ))}
            </select>
        </div>

        <div className="details-buttons">
            <AddToCatBtn
                data={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity,
                    image: product.image,
                }}
            />
        </div>
    </>
);


}
