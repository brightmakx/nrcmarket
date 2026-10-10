import {it,expect} from "vitest"
import { orderEntityType } from "../types/orderTypes"
import { validateOrder } from "./orderValidation"

const orderItems=[{name:'phone',rating:3,imageUrl:"phone.png",categoryId:1,quantity:3,price:2,id:1}]
const data:orderEntityType={
    userId:"djdjsjdbdbd b",
    quantity:2,
    totalPrice:50,
    status:"pending",
    products:orderItems
}
 it("shoul verify order",()=>{
    expect(validateOrder(data)).toHaveProperty("status")
 })