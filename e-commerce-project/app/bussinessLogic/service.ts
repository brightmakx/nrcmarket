import { prisma } from "@/lib/prisma";
import { imagesDb,videosDb,servicesDb, serviceProvidersDb } from "../database/data";
import { validateServiceImage } from "../validation/imageValidation";
import { validateService, validateServiceCondition } from "../validation/serviceValidation";
import { serviceResponseObject } from "../types/serviceTypes";

export class userServive{
    name:string;
    description:string
    userId:string;
    price:number
    constructor(name:string,description:string,userId:string,price:number){
        this.name=name;
        this.description=description;
        this.userId=userId;
        this.price=price
    }
    async saveService() {
    const data = await prisma.service.create({
        data: {
            name: this.name,
            description: this.description,
            providerId: this.userId,
            fee: this.price
        }
    });

    // Find the user and existing service provider
    const user = await prisma.user.findUnique({
        where: {
            id: this.userId
        },
        include: {
            serviceProvider: true
        }
    });

    if (!user) {
        throw new serviceProviderError("User not found");
    }

    // If the user is not yet a service provider,
    // create the service provider
    if (!user.serviceProvider) {
        await serviceProvidersDb.createServiceProvider({
            name: user.name,
            rating: 0,
            location: user.location || "",
            phone: user.phone || "",
            email: user.email,
            serviceId: data.id,
            userId: this.userId
        });
    }

    // If the service provider already exists,
    // connect the new service to it
    else {
        await prisma.serviceProvider.update({
            where: {
                id: user.serviceProvider.id
            },
            data: {
                serviceId: data.id
            }
        });
    }

    return data;
}

}



type serviceResponse={
    name?:string,
    id?:number,
    image?:{
        name?:string,
        id?:number,
        serviceId?:number
    },
    video?:{
        name?:string,
        id?:number,
        serviceId?:number
    },
    description?:string
}

class serviceProviderError extends Error{
    constructor(message:string){
        super(message)
    }
}

/*starting the revised service system methods*/

function toServiceResponseObject(data:any):serviceResponseObject{
    let n:serviceResponseObject={name:"",description:"",providersId:"",id:1};
    n.id=data.id
    n.description=data.description,
    n.name=data.name,
    n.conditions=data.conditions
    n.providersId=data.providerId||""
    n.providerImage=data.provider?.image||undefined
    n.serviceVideos=data.videos?.map((v:any)=>v.name)||[]
    n.serviceImages=data.images?.map((i:any)=>i.name)||[]
    n.provider=data.provider?.serviceProvider
    n.fee=data.fee
    return n;
}

export async function getAllServices(sortBy?:string,orderBy?:string):Promise<serviceResponseObject[]>{
    const data=await servicesDb.getServices(sortBy,orderBy)
    let result:serviceResponseObject[]=[]
    data.map((d)=>{
        result.push(toServiceResponseObject(d))
    })
    return result;
}

export async function getService(id:number):Promise<serviceResponseObject>{
    const data=await servicesDb.getService(id)
    const result=toServiceResponseObject(data)
    return result
}

async function saveService({name,description,userId,price}:{name:string,description:string,userId:string,price:number}):Promise<serviceResponseObject>{
    const service=new userServive(name,description,userId,price)
    const data=await service.saveService()
    const result=toServiceResponseObject(data)
    return result;
}


export async function findAllServices(
    sortBy?: string,
    orderBy?: string,
    limit?: number,
    page?: number,
    search?: string
) {
    const data = await servicesDb.getServices(
        sortBy, orderBy, limit, page, search
    );

    return data.map(s => toServiceResponseObject(s));
}

export async function findServiceById(id:number) {
    try{
        const result=await servicesDb.getService(id)
        let data:serviceResponseObject=toServiceResponseObject(result);
        return {data}
    }catch(e){
        return {error:e}
    }
}

export async function addService(name:string,description:string,userId:string,price:number) {
    try{
        const result=validateService({name,description,price})
        if(!result.success){
            return {
                errors:result
            }
        }
        const data=await saveService({name:name,description:description,userId,price})
        return {data};
    }catch(e){
          if(e instanceof serviceProviderError){
            return {error:e.message}
        }
        return {error:"failed to save the service"}
    }
}

export async function addServiceImage({name,serviceId}:{name:string,serviceId:number}) {
    try{
        const result=validateServiceImage({name,serviceId})
        if(result.errors){
            let errors=[]
            result.errors.name&&errors.push(result.errors.name[0])
            result.errors.serviceId&&errors.push(result.errors.serviceId[0])
            return {
                validationErrors:errors
            }
        }
        const data=await imagesDb.createImage(result.data.name,result.data.serviceId)
        return {data}
    }catch(e:any){
        return {error:"failed to save the image"}
    }
    
}

export async function addServiceVideo(serviceId:number,name:string){
     try{
        const result=validateServiceImage({name,serviceId})
        if(result.errors){
            let errors=[]
            result.errors.name&&errors.push(result.errors.name[0])
            result.errors.serviceId&&errors.push(result.errors.serviceId[0])
            return {
                validationErrors:errors
            }
        }
        const data=await videosDb.createVideo(result.data.name,result.data.serviceId)
        return {data}
    }catch(e:any){
        return {error:"faile to save the image"}
    }
}

export async function  addServiceConditions({serviceId,conditions}:{serviceId:number,conditions:string[]}) {
     try{
        const data=await servicesDb.addServiceConditions({serviceId,conditions})
        //console.log(JSON.stringify(data))
        return {data}
    }catch(e:any){
        return {error:"faile to save the conditions"}
    }
}