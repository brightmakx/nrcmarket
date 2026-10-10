import {z} from "zod"
import { formatValidationErrors } from "./general"

const providerSchema=z.object({
    name:z.string().min(2,"name can not have less than 2 characters"),
    location:z.string().min(2,"location can not have less than 2 characters"),
    phone: z.string().regex(/^(09|08)\d{8}$/, "Phone number must start with 08 or 09 and contain 10 digits"),
    availability:z.string().min(2).optional()
})

export function isValidProvider(data:any){
    const result=providerSchema.safeParse(data)
    if(!result.success){
        const fieldErrors=result.error.flatten().fieldErrors
        const errors=formatValidationErrors(fieldErrors)
        return {
            success:false,
            errors
        }
    }
    return{
        success:true,
        data:result.data
    }
}