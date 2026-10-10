import {z} from "zod"

export const imageEntitySchema=z.object({
    name:z.string().min(2,"name should be atleast 2 characters"),
    serviceId:z.number(),
})

export function validateServiceImage({name,serviceId}:{name:string,serviceId:number}){
    const result=imageEntitySchema.safeParse({name,serviceId})
    if(!result.success){
        const errors=result.error.flatten().fieldErrors;
        return {errors}
    }
    return {data:result.data}
}