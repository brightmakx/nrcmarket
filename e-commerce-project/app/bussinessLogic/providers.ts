import { serviceProviderEntityType } from "../types/serviceProviderEntityType";
import { usersDb } from "../database/data";
import { serviceProvidersDb } from "../database/data";
import { prisma } from "@/lib/prisma";


type providerRequest={name:string,location:string,phone:string,title?:string,images?:string[],availability?:string}

export class serviceProvider{
     userId:string
     data:providerRequest
     images?:string[]
     constructor(userID:string,data:providerRequest){
        //console.log(data)
        this.userId=userID
        this.data=data
        this.images=data.images
     }
     async getProvider(){
        const user=await usersDb.getUser(this.userId)
        return user?.serviceProvider
     }
    async isProvider(){
        const data=await usersDb.getUser(this.userId)
        return !!data?.serviceProvider
     }

    async addProvider(){
        const isProvider=await this.isProvider()
        if(!isProvider){
            const user= await usersDb.getUser(this.userId)
            if(user){
                const provider=await serviceProvidersDb.createServiceProvider(
                    {
                    name:this.data.name,
                    rating:0,
                    location:this.data.location||"",
                    userId:this.userId,
                    email:user.email,
                    phone:this.data.phone||user.phone||"",
                    title:this.data.title||"",
                    availability:this.data.availability||""
                    
                    }
                )
                this.images&&await serviceProvidersDb.addProviderImages(this.images,provider.id)
                return provider;
            }

        }
        //console.log("already a provider")
        return null

    }

    async updateProvider(){
        const isProvider=await this.isProvider()
        if(isProvider){
            const updated=await serviceProvidersDb.updateServiceProvider(this.userId,this.data)
            return updated;
        }
    }

    async addProviderImages(images:string[]){
        const isProvider=await this.isProvider()

        if(isProvider){
            const provider=await this.getProvider()
            const updated=await serviceProvidersDb.addProviderImages(images,provider?.id||0)
        }
    }
}


export async function getServiceProvider(userId: string) {
    const provider = await prisma.serviceProvider.findUnique({
        where: {
            userId,
        },
        include: {
            images: true,
        },
    });

    if (!provider) {
        return null;
    }

    return provider;
}
