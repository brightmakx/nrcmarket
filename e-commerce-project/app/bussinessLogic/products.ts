import { productsDb } from "../database/data";
import { productEntityType } from "../types/productTypes";
import { validProducts } from "../validation/productValidation";



export async function saveProducts(data:any,ownerId:string){
    try{
        return await productsDb.createProducts(data,ownerId);
    }catch(e){
        return null;
    }
}
import { unstable_cache } from "next/cache";

export async function getProducts(
    limit?: number,
    order?: string,
    page?: number,
    search?: string,
    category?: string,
    onOffer?: boolean
) {
    return unstable_cache(
        () => search?.trim()
            ? productsDb.searchProducts(search, limit, page, category, onOffer)
            : productsDb.getProducts(order, limit, page, category, onOffer),
        ["products", String(limit), String(order), String(page), search ?? "", category ?? "", String(onOffer)],
        { revalidate: 60 }
    )();
}
export async function decrementProductQuantity(id:string,value:string) {
    return await productsDb.decrementProductQuantity(2,1)
}