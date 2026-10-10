import Container from "./categoryContainer/container";
import "./styles.css";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {

    const h = await headers();

    const result = await fetch(
        "http://localhost:3000/api/categories",
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
        return (
            <div className="category-home">
                <p>Failed to load categories.</p>
            </div>
        );
    }

    const res = await result.json();
    const categories = res.data || [];

    return (
        <div className="category-home">

            <p className="first"></p>

            <div className="categoriesHome">

                <h1 id="head">
                    OUR COLLECTION
                </h1>

                {categories.map((category: {
                    id: number;
                    name: string;
                }) => (
                    <Container
                        key={category.id}
                        title={category.name}
                        id={String(category.id)}
                    />
                ))}

            </div>

        </div>
    );
}