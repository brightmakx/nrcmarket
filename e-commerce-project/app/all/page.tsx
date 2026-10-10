
import Product from "../components/product/product";
import "./all.css";
import { headers } from "next/headers";
import Link from "next/link";

type ProductType = {
    id: number;
    name: string;
    imageUrl: string;
    rating: number;
    price: number;
    quantity: number;
    category?: string;
    description?: string;
};

type CategoryType = {
    id: number;
    name: string;
};

type SearchParams = {
    page?: string;
    category?: string;
    search?: string;
    sort?: string;
};

export default async function AllProducts({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;

    const page = Number(params.page) || 1;
    const category = params.category || "";
    const search = params.search || "";
    const sort = params.sort || "latest";

    const h = await headers();

    const productParams = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(category && { category }),
        ...(search && { search }),
        ...(sort && { sort }),
    });


    const productsResult = await fetch(
        `http://localhost:3000/api/products?${productParams.toString()}`,
        {
            headers: { cookie: h.get("cookie") ?? "" },
            cache: "no-store",
        }
    );

    if (productsResult.status === 401) {
        return (
            <div className="all-products-page">
                <div className="all-error">
                    <h2>Login required</h2>
                    <p>Please log in to view products.</p>
                    <Link href="/login">Login</Link>
                </div>
            </div>
        );
    }

    if (!productsResult.ok) {
        return (
            <div className="all-products-page">
                <div className="all-error">
                    <h2>Something went wrong</h2>
                    <p>Failed to load products.</p>
                </div>
            </div>
        );
    }

    const productsResponse = await productsResult.json();

    const products: ProductType[] = productsResponse.data || [];

    const pagination = productsResponse.pagination || {
        page,
        limit: 10,
        total: products.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: page > 1,
    };
 
    const categoriesResult = await fetch(
        "http://localhost:3000/api/categories",
        {
            headers: { cookie: h.get("cookie") ?? "" },
            cache: "no-store",
        }
    );

    let categories: CategoryType[] = [];

    if (categoriesResult.ok) {
        const categoriesResponse = await categoriesResult.json();
        categories = categoriesResponse.data || [];
    }


    function buildUrl(values: {
        page?: number;
        category?: string;
        search?: string;
        sort?: string;
    }) {
        const query = new URLSearchParams();

        const newPage = values.page ?? page;
        const newCategory = values.category ?? category;
        const newSearch = values.search ?? search;
        const newSort = values.sort ?? sort;

        if (newPage > 1) query.set("page", String(newPage));
        if (newCategory) query.set("category", newCategory);
        if (newSearch) query.set("search", newSearch);
        if (newSort && newSort !== "latest") query.set("sort", newSort);

        const queryString = query.toString();

        return queryString ? `/all?${queryString}` : "/all";
    }

    return (
        <main className="all-products-page">

            <div className="all-products-header">
                <div>
                    <span className="all-products-label">MARKETPLACE</span>
                    <h1>All Products</h1>
                    <p>Browse products available on Market.</p>
                </div>

                <span className="product-count">
                    {pagination.total} products
                </span>
            </div>

            <form className="product-search" action="/all" method="GET">
                {category && (
                    <input type="hidden" name="category" value={category} />
                )}

                {sort && sort !== "latest" && (
                    <input type="hidden" name="sort" value={sort} />
                )}

                <input
                    type="text"
                    name="search"
                    defaultValue={search}
                    placeholder="Search products..."
                />

                <button type="submit">Search</button>
            </form>

            <div className="product-controls">
                <div className="category-filter">
                    <Link
                        href={buildUrl({ category: "", page: 1 })}
                        className={!category ? "category-filter-active" : ""}
                    >
                        All
                    </Link>

                    {categories.map((item) => (
                        <Link
                            key={item.id}
                            href={buildUrl({ category: item.name, page: 1 })}
                            className={
                                category === item.name
                                    ? "category-filter-active"
                                    : ""
                            }
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <form action="/all" method="GET" className="sort-form">
                    {category && (
                        <input type="hidden" name="category" value={category} />
                    )}

                    {search && (
                        <input type="hidden" name="search" value={search} />
                    )}

                    <label htmlFor="sort">Sort:</label>

                    <select id="sort" name="sort" defaultValue={sort}>
                        <option value="latest">Latest</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="rating">Rating</option>
                    </select>

                    <button type="submit">Apply</button>
                </form>
            </div>

            {products.length > 0 ? (
                <div className="all-products-grid">
                    {products.map((product) => (
                        <Product
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            image={`/images/${product.imageUrl}`}
                            price={product.price}
                            rate={product.rating}
                            description={product.description || ""}
                        />
                    ))}
                </div>
            ) : (
                <div className="no-products">
                    <h2>No products found</h2>
                    <p>Try changing your search or category.</p>
                    <Link href="/all">View all products</Link>
                </div>
            )}

            {pagination.totalPages > 1 && (
                <nav className="pagination">

                    {pagination.hasPreviousPage ? (
                        <Link href={buildUrl({ page: page - 1 })}>
                            ← Previous
                        </Link>
                    ) : (
                        <span className="pagination-disabled">
                            ← Previous
                        </span>
                    )}
 
                    <div className="pagination-pages">
                        {Array.from(
                            { length: pagination.totalPages },
                            (_, index) => index + 1
                        ).map((pageNumber) => (
                            <Link
                                key={pageNumber}
                                href={buildUrl({ page: pageNumber })}
                                className={
                                    pageNumber === page
                                        ? "pagination-active"
                                        : ""
                                }
                            >
                                {pageNumber}
                            </Link>
                        ))}
                    </div>
 

                    {pagination.hasNextPage ? (
                        <Link href={buildUrl({ page: page + 1 })}>
                            Next →
                        </Link>
                    ) : (
                        <span className="pagination-disabled">
                            Next →
                        </span>
                    )}
                </nav>
            )}
        </main>
    );
}

