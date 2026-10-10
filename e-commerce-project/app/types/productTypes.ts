 
import {z} from "zod"
export type productEntityType={
    name:string,
    imageUrl:string,
    rating:number,
    category:string,
    quantity:number,
    price:number
}

export type orderItemType={
    orderId:number,
    productId:number,
    quantity:number,
    orderTimePrice:number
}
 