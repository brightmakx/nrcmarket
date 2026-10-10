export default async function Page({params}:{params:Promise<{id:string}>}){
    const id=await params;
    const product=await fetch("/api/products")
     return(
        <div className="product-details-page">
        </div>
     )
}