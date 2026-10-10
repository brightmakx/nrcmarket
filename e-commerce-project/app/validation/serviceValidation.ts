import {success, z} from "zod"
import { formatValidationErrors } from "./general"

export const serviceEntitySchema=z.object({
    name:z.string().min(2,"name should be atleast 2 characters").max(30),
    description:z.string().min(2,"description must be atleast "),
    price:z.coerce.number().min(1000,"minimum price is MK1000")
})

export const serviceConditionSchema=z.object({
    serviceId:z.number(),
    conditions:z.array(z.string())
})

type serviceCondition=z.infer<typeof serviceConditionSchema>

type service=z.infer<typeof serviceEntitySchema>

export function validateService(data:service){
    const result=serviceEntitySchema.safeParse(data)
    if(!result.success){
        const errors=formatValidationErrors(result.error.flatten().fieldErrors);
        return errors
    }
    return {
        success:true,
        data:result.data}
}

export function validateServiceCondition(data:serviceCondition){
     const result=serviceConditionSchema.safeParse(data)
    if(!result.success){
        const errors=result.error.flatten().fieldErrors;
        return {errors}
    }
    return {data:result.data}
}
