import { getSession } from "@/lib/session";
import { NextRequest } from "next/server";
import { unAuthorizedResponse } from "../../products/route";
import { ordersDb } from "@/app/database/data";
import { Agent } from "@/app/bussinessLogic/agent";
import { getOrderById } from "@/app/bussinessLogic/order";

export async function PUT(request:NextRequest) {
    const session=await getSession()
    const userId=session?.user.id
    if(!userId){
        return unAuthorizedResponse;
    }

    const body=await request.json()
    const orderId=body.orderId;
    const status:string=body.status;

    const stat=status.toUpperCase()

    const list=["DELIVERED","PENDING"]
    if(!(stat=="DELIVERED")){
        return new Response(JSON.stringify({error:"invalid status"}),{status:400})
    }
    //console.log("received orderId: ",orderId," status: ",status)
    const agent=new Agent(userId,{})
    const agentId=await agent.getAgentId()
    try{
         const updated=await ordersDb.deliverOrder(orderId,agentId)
        if(updated)return new Response(JSON.stringify({message:"delivered"}))
    }catch{}
   
   
}

export async function GET(request:NextRequest) {
    const session=await getSession()
        const userId=session?.user.id
        if(!userId){
            return unAuthorizedResponse;
        }

    const {searchParams}=request.nextUrl;
    const includeDelivered=searchParams.get("includeDelivered")=="true"?true:false
    const oderId=searchParams.get("orderId")
    if(oderId){
         return new Response(JSON.stringify({data:await getOrderById(Number(oderId))}))
    }
    

    const agent=new Agent(userId,{})
    //await agent.getDeliveredOrders()
    const data=await agent.getOrders({includeDelivered})
    if(data)return new Response(JSON.stringify({data}))
    return new Response(JSON.stringify({error:"failed"}))
}