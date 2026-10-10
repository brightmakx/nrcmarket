import { headers } from "next/headers";
import Product from "../product/category"
import "../styles/categories.css"
import "../styles/category.css"
export default async function Categories() {

    const h=await headers()
    const res=await fetch("http://localhost:3000/api/categories",{
         headers: {
        cookie: h.get("cookie") ?? "",
    },
    });
    const data=await res.json();

    return (
        <div>
            <h4 className="color-red-600">Featured Categories</h4>
            <div className="categories">
                 {data?.data?.map((x:any)=>{
                    return <Product key={x.name} name={x.name} image={`../images/${x.imageUrl}`}/>
                 })}  
            </div>
        </div>
    )
}