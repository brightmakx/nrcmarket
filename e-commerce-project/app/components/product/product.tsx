
"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useCart } from "../../context/cartContext";
import { useState } from "react";
import Link from "next/link";

import "../styles/product1.css";

export default function Product({
    description,
    name,
    image,
    price,
    rate,
    id
}: {
    name: string;
    image: string;
    price: number;
    rate: number;
    id: number;
    description: string;
}) {
    const { addToCart } = useCart();

    price = Number(price);

    let data = {
        id: id,
        name: name,
        image: image,
        price: price,
        quantity: 1
    };

    const [quantity, setQuantity] = useState(data.quantity);

    function rating(x: number) {
        return "★".repeat(Math.floor(x)) + "☆".repeat(5 - Math.floor(x));

    }

    return (
        <div className="product">
             <div className="product-image">
                <Link href={`/productDetails/${id}`}> <Image src={image} alt={name} className="image" width={500} height={500}/> </Link>
             </div>
             <div className="product-details">
                <p className="product-name">{name}</p>

                <p className="rating">{rating(rate)}</p>

                <p className="price">${price.toFixed(2)}</p>

                {/* option to choose quantity */}
                <select
                    value={quantity}
                    onChange={(e) => {
                        setQuantity(Number(e.target.value));
                        //console.log(e.target.value);

                        data.quantity = Number(e.target.value);
                    }}
                >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </select>

                <button
                    className="add-to-cart"
                    onClick={() => {
                        toast.success(`${name} added to cart`, {
                            duration: 5000
                        });

                        addToCart({
                            ...data,
                            quantity: quantity
                        });
                    }}
                >
                    Add to Cart
                </button>

            </div>
        </div>
    );
}
  
