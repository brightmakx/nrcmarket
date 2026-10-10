"use client"

import { createContext, useContext, useEffect, useState } from "react";

 
const CartContext = createContext();

export function CartProvider({ children }) {

    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem("nrc-marketplace-cart");

        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("nrc-marketplace-cart", JSON.stringify(cart));
    }, [cart]);

    function addToCart(product) {

        setCart((prevCart) => {

            const existingProduct = prevCart.find(
                (p) => p.id === product.id
            );

            if (existingProduct) {
                return prevCart.map((p) =>
                    p.id === product.id
                        ? {
                            ...p,
                            quantity: p.quantity + product.quantity
                        }
                        : p
                );
            }

            return [...prevCart, product];
        });
    }

    function removeFromCart(productId) {
        setCart((prevCart) =>
            prevCart.filter((item) => item.id !== productId)
        );
    }

    function emptyCart(){
        setCart([])
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                emptyCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// a function for using the context
export const useCart = () => useContext(CartContext);