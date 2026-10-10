import { getSession } from "@/lib/session";
import { NextRequest } from "next/server";
import { unAuthorizedResponse } from "../products/route";
import { serviceProvider } from "@/app/bussinessLogic/providers";
import { saveImage } from "@/app/bussinessLogic/files";
import { isValidProvider } from "@/app/validation/providerValidation";
import { prisma } from "@/lib/prisma";
import { getServiceProvider } from "@/app/bussinessLogic/providers";

export async function POST(req:NextRequest) {
    const session=await getSession()
    if(!session?.user?.id){
        return unAuthorizedResponse;
    }
    const userId=session.user.id
    const formData=await req.formData()

    const name:any=formData.get("name") as string
    const location:any=formData.get("location") as string
    const phone:any=formData.get("phone") as string
    const images=formData.getAll("images") as File[]
    const availability=formData.get("availability") as string

    //a list of images names before saving them

    const valid=isValidProvider({name,location,phone,availability})

    if(!valid.success){
        return new Response(JSON.stringify(valid),{status:400})
    }

    let imageNames=[]

    for(const i of images){
        const date=new Date()
        const imageName=crypto.randomUUID()+date.toISOString()+i.name
        imageNames.push(imageName)
    }

    //save the provier details
    const data=imageNames.length>0? {name,location,phone,availability,images:imageNames}:{name,location,phone,availability}
    const provider=new serviceProvider(userId,data)

    const isProvider=await provider.isProvider()
    if(!isProvider){
        const saved=await provider.addProvider()
        if(saved){
            if(imageNames.length>0){
                let index=0
                for(const i of images){
                    const name=imageNames.at(index)
                    name&&await saveImage(i,name)
                }
            }
            return new Response(JSON.stringify({data:saved}))
        }
        
        return new Response(JSON.stringify({error:"failed to register"}),{status:400})
    }
    return new Response(JSON.stringify({error:"you are already a provider"}),{status:400})
    
}

export async function PUT(req:NextRequest){
    const session=await getSession()
    if(!session?.user.id){
        return unAuthorizedResponse;
    }
    const userId=session.user.id
    const formData=await req.formData()

    const name:any=formData.get("name")
    const location:any=formData.get("location")
    const phone:any=formData.get("phone") as string
    const images=formData.getAll("images") as File[]
    const title=formData.get("title") as string
    const availability=formData.get("availability") as string

    //save the provier details
    const providerRequest={name,location,phone,title,availability}

    //validate the data
    const valid=isValidProvider(providerRequest)
     if(!valid.success){
        return new Response(JSON.stringify(valid),{status:400})
    }
    const provider=new serviceProvider(userId,providerRequest)

    const isProvider=await provider.isProvider()
    if(isProvider){
        
        const updated=await provider.updateProvider()
        const imageNames:string[]=[]
        if (updated){
            for(const c of images){
                const date=new Date()
                const imageName=crypto.randomUUID()+date.toISOString()+c.name
                const saved=await saveImage(c,imageName)
                if(saved)imageNames.push(imageName)
                }
            await provider.addProviderImages(imageNames)
         }
        if(updated){
            return new Response(JSON.stringify({data:updated}))
        }
        return new Response(JSON.stringify({error:"failed to update"}),{status:400})
    }
    return new Response(JSON.stringify({error:"you are not a provider"}),{status:400})
}


export async function GET(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session?.user?.id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Unauthorized",
                }),
                {
                    status: 401,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const data = await getServiceProvider(session.user.id);

        if (!data) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Service provider profile not found",
                }),
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                data,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error("GET service provider error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to retrieve service provider",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}