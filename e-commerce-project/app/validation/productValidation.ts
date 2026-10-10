import {z} from "zod"
import { productEntityType } from "../types/productTypes"
import { formatValidationErrors } from "./general"
import { CustomError } from "../errors/customErrors"

export const productEntitySchema=z.object({
    name:z.string().min(2,"name should have atleast 2 characters").max(20).nonoptional("inlude name"),
    imageUrl:z.string().includes(".").nonoptional("include image"),
    rating:z.coerce.number().min(0,"rating cant be less than 1").optional(),
    category:z.string("categpry must be a string").nonoptional("add category name"),
    quantity:z.coerce.number().min(1,"quantity cant be less than 1").nonoptional("quantity is needed"),
    price:z.coerce.number().min(1,"price cant be less than 1").nonoptional("price is needed"),
    description:z.string().min(10,"decription should have atleast 10 characters").max(50).optional(),
    categoryId:z.coerce.number()
})

export function validateProductEntity(product:productEntityType){
    const result=productEntitySchema.safeParse(product)
    if(!result.success){
        const erros=formatValidationErrors(result.error.flatten().fieldErrors)
    }
    return result.data;
}

export function validProduct(product:any,imageUrl:string){
    //fill the remaining gaps
    product=JSON.parse(product);
    product.rating=0;
    product.imageUrl=imageUrl;

    //parse it in schema
    try{
        const data=validateProductEntity(product)
        return data;
    }catch(e){
        throw e;
    }
}
export function validProducts(products:FormDataEntryValue[],files:FormDataEntryValue[]){
    let productsEntries:any[]=[]
    let filesEntries:any=[]
    let validated:any=[]
    //add the data into real arrays
    for(const p of products){
        productsEntries.push(p);
    }
    for(const f of files){
        filesEntries.push(f);
    }
    //validate them one by one
    for(let i=0;i<productsEntries.length;i++){
        try{
             const data=validProduct(productsEntries[i],filesEntries[i].name)
             validated.push(data)
        }catch(e){
            throw new CustomError(`validation failed on ${productsEntries[i].name}`);
        }
       
    }
    //console.log(`validated: ${JSON.stringify(validated)}`)
    return validated;

}