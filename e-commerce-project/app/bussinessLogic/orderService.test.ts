import {expect, it} from "vitest"
import { orderEntityType } from "../types/orderTypes"
import { makeOrder } from "./order"

 const data:orderEntityType={userId:"",quantity:2,totalPrice:40,status:"pending",products:[{name:"router"}]}

 it("shoul save valid order",async ()=>{
    const order=await makeOrder(data);
    expect(order.error).toBeDefined()
 })