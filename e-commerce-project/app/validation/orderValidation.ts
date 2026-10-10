import {number, string, z} from "zod"
import { orderEntityType } from "../types/orderTypes"
import { error } from "console";
import { cartItem } from "../types/cartTypes";

const cartItemSchema=z.object({
    id:z.number().nonnegative(),
    name:z.string().min(1,"failed to accept product name"),
    price:z.number().nonnegative(),
    quantity:z.number().nonnegative(),
    image:z.string()
})

export function validateCart(data:cartItem[]){
    data.map((item)=>{
        const result=cartItemSchema.safeParse(item)
        if(!result.success){
            throw new Error(`invalid cart product ${JSON.stringify(item)}`)
        }
    }
)
return data;
}
const orderEntitySchema=z.object({
    status:z.string().refine((st)=>["pending",'delivered',"canceled"].includes(st.toLowerCase())),
    quantity:z.number().min(1,"quantity can not be greater than 1"),
    totalPrice:z.number().min(0,"price can not be negative"),
    userId:z.string().min(1),
    products:z.any()
})

export function validateOrder(order:any){
    const result=orderEntitySchema.safeParse(order)
    if(!result.success){
        return {error:result.error.message}
    }
    return result.data;
}