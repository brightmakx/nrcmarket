import { NextRequest } from "next/server";
import { ordersDb, productsDb } from "@/app/database/data";
import { orderEntityType } from "@/app/types/orderTypes";
import { makeOrder } from "@/app/bussinessLogic/order";
import { getSession } from "@/lib/session";
import { unAuthorizedResponse } from "../products/route";

export async function POST(request:NextRequest) {
    const session=await getSession()
    if(!session?.user.id){
        return unAuthorizedResponse;
    }
    const data=await request.json() as any[]
    if(!(data.length>0)){
        return new Response(JSON.stringify({error:"empty order"}),{status:400})
    }
    //calculate totals from cart
    let totalPrice=0
    let totalQuantity=0
    for(const p of data){
        const comfirmProduct=await productsDb.getProduct(p.id)
        if(!comfirmProduct){
            return Response.json({
                error:`${p.name} not found`
            }, {
                status:404
            })
        }
        totalPrice+=Number(Number(comfirmProduct.price)*p.quantity)
        totalQuantity+=Number(p.quantity)
    }

    //creating the order entity
    const order:orderEntityType={userId:session.user.id,totalPrice:totalPrice,quantity:totalQuantity,status:"pending",products:data}

    //placing an order
    const result=await makeOrder(order)
    const message=result.message?.concat(",  you products can still b e ordered again until you pay")
    const error=result.error
    if(message)return Response.json({
        message,data:result.result
        },
        {
            status:201
        }
    )
    return Response.json({
        error
     },
     {
        status:400
     }
    )   
}

export async function GET(request:NextRequest) {
    const limit=request.headers.get("limit")
    const session=await getSession()
    if(!session?.user.id){
        return unAuthorizedResponse;
    }
    const history=await ordersDb.getOrdersByUserId(session.user.id,"createdAt")
    //console.log(`history data: ${JSON.stringify(history)}`)
    return Response.json({
        history
            },
        {
            status:200
        }
    )
}