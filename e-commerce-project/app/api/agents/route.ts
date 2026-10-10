import { Agent } from "@/app/bussinessLogic/agent";
import { getSession } from "@/lib/session";
import { NextRequest } from "next/server";
import { unAuthorizedResponse } from "../products/route";
import { isValidAgent } from "@/app/validation/agentValidation";
import { CustomError } from "@/app/errors/customErrors";

export async function GET(request:NextRequest) {
    const session=await getSession()
    const userId=session?.user.id
    if(!userId){
        return unAuthorizedResponse;
    }

    const {searchParams}=request.nextUrl;

    const includeHistory=searchParams.get("includeHistory")=="true"?true:false

    const agent=new Agent(userId,{})

    const error=isValidAgent({"email":"email","phone":"9909",location:"bhsgsfbsgg"})

    let data;
    
    if(includeHistory){
        data=await agent.getAgentHistory()
    }else{
        data=await agent.getAgent()
    }
    //console.log("fount agent",JSON.stringify(data))
    if(data)return new Response(JSON.stringify({data:data}),{status:200})

    return new Response(JSON.stringify({error:"faild to get agent"}),{status:400})
}

export async function POST(request:NextRequest) {
    const session=await getSession()
    const userId=session?.user.id
    if(!userId){
        return unAuthorizedResponse;
    }
    const body=await request.json()

    console.log("received body: ",JSON.stringify(body))
    //validate first
    const result=isValidAgent(
        {"email":session?.user.email||body.email,
            "phone":session?.user.phone||body.phone,
            "location":session?.user.location||body.location,
            "name":session?.user.name||body.name})
    if(!result.success){
        return new Response(JSON.stringify({errors:result.errors}),{status:400})
    }

    const agent=new Agent(userId,body)

    try{
         const saved=await agent.saveAgent()
    //console.log("saved agent: ",JSON.stringify(saved))
        if(saved)return new Response(JSON.stringify({data:saved}),{status:200})
    }
    catch(error){
        if(error instanceof  CustomError){
            return new Response(JSON.stringify({error:error.message}),{status:400})
        }
    }

    return new Response(JSON.stringify({error:"faild to save agent"}),{status:400})
}
