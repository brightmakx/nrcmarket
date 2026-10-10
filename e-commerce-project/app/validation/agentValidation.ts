import { success, z} from "zod"
import { formatValidationErrors } from "./general"
const agentSchema=z.object({
    name:z.string().min(2,"name cant be less tha two characters"),
    email:z.email("enter a valid email"),
    phone:z.string().startsWith("0","phone must start with 0").min(10,"phone cant be less than 10 digits"),
    location:z.string().min(2,"location cant have less than two characters")
}).strict()


export function isValidAgent(data:any){
    const result=agentSchema.safeParse(data)

    if(!result.success){
        const fieldErrors=result.error.flatten().fieldErrors
        const res=formatValidationErrors(fieldErrors)
        //console.log(res)
        return{
            success:false as const,
            errors:res.errors
        }
    }else{
        return {
            success:true as const,
            data:result.data
        };
        }
    
}

