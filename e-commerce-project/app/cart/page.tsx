"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import "../components/styles/cart1.css"
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '../context/cartContext'
import { userEntityType } from '../types/userTypes'
import toast from 'react-hot-toast'

type cartObject={
  id:number;
  name:string;
  price:number;
  quantity:number;
  image:string
}

function Cart() {
  

  const {cart,emptyCart}:{cart:[],emptyCart:()=>void}=useCart();
    async function postData() {
      if(!cart||cart.length<1){

      }
      const res=await fetch("/api/orders",{
        method:"POST",
        body:JSON.stringify(cart),
        headers:{
          "Content-Type": "application/json",
        }
      });
      return res.json()
    }
  return (
    <div className='cart'>
      <h3>your Cart</h3>
      <div className='cart-container'>

        <CartItems/>
        <CartButton/>
        <CartSummary cart={cart} send={postData} deleteCart={emptyCart}/>
        
      </div>
    </div>
  )
}
function CartItems(){
    const {cart,removeFromCart}:{cart: any[], removeFromCart: (productId: number) => void}=useCart();
  // selected items in state
    const [collection, setCollection]=useState(cart);
  //const items=[1,2,3,4,5]

  //remove item from cart
  function removeItemFromCart(itemId:any){
    removeFromCart(itemId);
  }
  return(
    <div className='cart-items'>
      {
      cart.map((item)=><CartItem itemId={item.id} name={item.name} key={item.id+item.name} image={item.image} price={item.price} quantity={item.quantity} onRemove={removeItemFromCart}/>)
      }
    </div>
  )
}

function CartSummary({cart,send,deleteCart}:{cart:[],send:any,deleteCart:()=>void}){
  let total=0;
  let totalItems=0;
  cart.map((x:cartObject)=>{
    total+=Number((x.quantity*x.price))
  })
  cart.map((x:cartObject)=>{
    totalItems+=Number(x.quantity);
  })

  return(
    <div className='cart-summary'>
        <h3>Cart Summary</h3>
        <p>Total Items: {totalItems}</p>
        <p>tax:0</p>
        <p>Total Price: ${total.toFixed(2)}</p>
        <CartCheckoutButton send={send} cart={cart} deleteCart={deleteCart}/>
        <Link href='/all'>
        <button className='mobile-only'>keep shopping</button>
        </Link>
      </div>
  )
}

function CartItem({itemId, name, price, quantity, image, onRemove}:{itemId: number, name: string, price: number, quantity: number, image: string, onRemove: (itemId: number) => void}){
  return (
    <div className='cart-item'>
      <div className='cart-item-image-container'>
      <Image src={image} alt={name} className='cart-item-image' width={500} height={500}/>
      </div>
      <div className='cart-item-details'>
        <h3>{name}</h3>
        <p>quantity: {quantity}</p>
        <p>price: ${price.toFixed(2)}</p>
      </div>
      <div className="adjust-quantity">
        <div className='quantity'>
          <button className="decrement">-</button>
          <span>{quantity}</span>
          <button className="increment">+</button>
        </div>
        <Removebutton onRemove={onRemove} itemId={itemId}/>
      </div>
      <div className='cart-item-total'>
        <p>Total: ${(price*quantity).toFixed(2)}</p>
      </div>
    </div>
  )
}

//all about remove button
function Removebutton({ onRemove, itemId }: { onRemove: (itemId: number) => void; itemId: number }){
  return(
    <div className='Removebutton'>
      <button onClick={() => onRemove(itemId)}>remove</button>
    </div>
  )
}
function CartButton(){
  return(
    <div className='Cartbutton'>
      <Link href='/all'>
      <button>keep shopping</button>
      </Link>
    </div>
  )
}
function CartCheckoutButton({
  send,
  cart,
  deleteCart
}: {
  send: any;
  cart: any[];
  deleteCart:()=>void
}) {
  return (
    <div
      className={`CartCheckoutButton ${cart.length === 0 ? "disabled" : ""}`}
      onClick={async () => {
        if (cart.length === 0) {
          toast.error("Your cart is empty");
          return;
        }

        //console.log("pressed");

        const res = await send();

        const error = res.error;
        const m = res.message;

        if (error) {
          toast.error(error);
        } else {
          toast.success(m);
          deleteCart()
        }
      }}
    >
      <button disabled={cart.length === 0}>
        {cart.length === 0 ? "cart is empty" : "purchase"}
      </button>
    </div>
  );
}
  
export default Cart;