import Product from "@/app/components/product/product";
import "./styles.css";
import "../../components/styles/products.css";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Container({
    title,
    id,
}: {
    title: string;
    id: string;
}) {
    const h = await headers();

    const result = await fetch(
        `http://localhost:3000/api/categories?id=${id}&includeProducts=true`,
        {
            headers: {
                "Content-Type": "application/json",
                cookie: h.get("cookie") ?? "",
            },
            cache: "no-store",
        }
    );

    if (result.status === 401) {
        redirect("/login");
    }

    if (!result.ok) {
        return null;
    }

    const res = await result.json();
    const products = res.data?.products || [];

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="category-container">
            <h1>{title}</h1>

            <div className="products">
                {products.map((product: any) => (
                    <Product
                        key={product.id}
                        name={product.name}
                        image={`/images/${product.imageUrl}`}
                        price={product.price}
                        rate={product.rating}
                        id={product.id}
                        description={product.description || ""}
                    />
                ))}
            </div>
        </div>
    );
}