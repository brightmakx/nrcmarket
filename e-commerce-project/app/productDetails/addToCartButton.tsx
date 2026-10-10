"use client";

import { useCart } from "../context/cartContext";
import toast from "react-hot-toast";

export function AddToCatBtn({data}:{data:{id:number;name:string;image:string;quantity:number;price:number}}){
   const { addToCart } = useCart();

   return(
    <button
        disabled={data.quantity <= 0}
        className="details-add-cart"
        onClick={()=>{
            addToCart(data)
            toast.success(`${data.name} added to cart`, {
                            duration: 5000
                        });
        }}
            >
             🛒 Add to Cart
    </button>
   )
}