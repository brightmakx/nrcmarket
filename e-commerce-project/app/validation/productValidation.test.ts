import { expect, it } from "vitest";
import { validateProductEntity } from "./productValidation";
import { productEntityType } from "../types/productTypes";

const data:productEntityType={
    name:"phone",
    imageUrl:"phone.png",
    rating:3,
    quantity:4,
    price:3,
    category:"electronics"
}
it("validation should pass with this data",()=>{
    expect (validateProductEntity(data)).toEqual(data)
})