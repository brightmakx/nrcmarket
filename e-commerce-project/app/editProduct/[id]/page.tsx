
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/app/components/styles/createProduct1.css";
import toast from "react-hot-toast";

import { authenticate } from "@/lib/actions/sever-actions";
import { loginRedirect } from "@/lib/actions/redirects";


type Product = {
    id?: number;
    name: string;
    quantity: string;
    price: string;
    category: string;
    description: string;
    imageUrl?: string;
};


export default function EditProductPage() {

    const params = useParams();
    const router = useRouter();

    const id = params.id as string;


    const [product, setProduct] = useState<Product>({
        name: "",
        quantity: "",
        price: "",
        category: "",
        description: "",
        imageUrl: "",
    });


    const [file, setFile] = useState<File | null>(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);


    /* =====================================================
       AUTHENTICATION
    ===================================================== */

    useEffect(() => {

        async function auth() {

            const user = await authenticate();

            if (!user) {
                loginRedirect();
            }

        }

        auth();

    }, []);


    /* =====================================================
       GET PRODUCT
    ===================================================== */

    useEffect(() => {

        async function getProduct() {

            try {

                const response = await fetch(
                    `/api/products?id=${id}`,
                    {
                        cache: "no-store",
                    }
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch product"
                    );

                }


                const data = await response.json();

                const p = data.data;


                if (!p) {

                    throw new Error(
                        "Product not found"
                    );

                }


                setProduct({

                    id: p.id,

                    name: p.name ?? "",

                    quantity:
                        p.quantity?.toString() ?? "",

                    price:
                        p.price?.toString() ?? "",

                    category:
                        p.category?.name ?? "",

                    description:
                        p.description ?? "",

                    imageUrl:
                        p.imageUrl ?? "",

                });

            } catch (error) {

                console.error(error);

                toast.error(
                    "Unable to load product"
                );

            } finally {

                setLoading(false);

            }

        }


        if (id) {
            getProduct();
        }

    }, [id]);


    /* =====================================================
       INPUT CHANGE
    ===================================================== */

    function handleProductChange(
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {

        const {
            name,
            value,
        } = event.currentTarget;


        setProduct((previous) => ({

            ...previous,

            [name]: value,

        }));

    }


    /* =====================================================
       IMAGE
    ===================================================== */

    function addFile(
        event: React.ChangeEvent<HTMLInputElement>
    ) {

        const selectedFile =
            event.target.files?.[0];


        if (!selectedFile) {
            return;
        }


        setFile(selectedFile);

    }


    /* =====================================================
       SAVE PRODUCT
    ===================================================== */

    async function updateProduct() {

        if (!product.name.trim()) {

            toast.error(
                "Product name is required"
            );

            return;

        }


        if (!product.quantity) {

            toast.error(
                "Product quantity is required"
            );

            return;

        }


        if (!product.price) {

            toast.error(
                "Product price is required"
            );

            return;

        }


        if (!product.category.trim()) {

            toast.error(
                "Product category is required"
            );

            return;

        }


        try {

            setSaving(true);


            const formData = new FormData();


            formData.append(
                "name",
                product.name
            );


            formData.append(
                "quantity",
                product.quantity
            );


            formData.append(
                "price",
                product.price
            );


            formData.append(
                "category",
                product.category
            );


            formData.append(
                "description",
                product.description
            );


            /*
             * Only send an image if the user
             * selected a new one.
             */

            if (file) {

                formData.append(
                    "image",
                    file
                );

            }


            const response = await fetch(
                `/api/products?id=${id}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Failed to update product"
                );

            }


            toast.success(
                "Product updated successfully"
            );


            /*
             * Go back to product details
             */

            router.push(
                `/productDetails/${id}`
            );


            router.refresh();

        } catch (error) {

            console.error(
                "UPDATE PRODUCT ERROR:",
                error
            );


            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update product"
            );

        } finally {

            setSaving(false);

        }

    }


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="main">

                <h1>
                    Loading product...
                </h1>

            </div>

        );

    }


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <div className="main">

            <h1>
                Edit Product
            </h1>


            <div className="details">


                {/* NAME */}

                <p>

                    <label htmlFor="name">
                        Name
                    </label>

                    <br />

                    <input
                        id="name"
                        type="text"
                        placeholder="Product name"
                        name="name"
                        value={product.name}
                        onChange={
                            handleProductChange
                        }
                    />

                </p>


                {/* QUANTITY */}

                <p>

                    <label htmlFor="quantity">
                        Stock
                    </label>

                    <br />

                    <input
                        id="quantity"
                        type="number"
                        min="0"
                        placeholder="Quantity of the product"
                        name="quantity"
                        value={product.quantity}
                        onChange={
                            handleProductChange
                        }
                    />

                </p>


                {/* PRICE */}

                <p>

                    <label htmlFor="price">
                        Price
                    </label>

                    <br />

                    <input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Price per product"
                        name="price"
                        value={product.price}
                        onChange={
                            handleProductChange
                        }
                    />

                </p>


                {/* CATEGORY */}

                <p>

                    <label htmlFor="category">
                        Category
                    </label>

                    <br />

                    <input
                        id="category"
                        type="text"
                        placeholder="Category name"
                        name="category"
                        value={product.category}
                        onChange={
                            handleProductChange
                        }
                    />

                </p>


                {/* DESCRIPTION */}

                <p>

                    <label htmlFor="description">
                        Description
                    </label>

                    <br />

                    <textarea
                        id="description"
                        name="description"
                        placeholder="Product description"
                        value={
                            product.description
                        }
                        onChange={
                            handleProductChange
                        }
                    />

                </p>


                {/* CURRENT IMAGE */}

                {product.imageUrl && (

                    <div className="current-image">

                        <p>
                            Current product image
                        </p>

                        <img
                            src={
                                product.imageUrl.startsWith("/")
                                    ? product.imageUrl
                                    : `/images/${product.imageUrl}`
                            }
                            alt={product.name}
                        />

                    </div>

                )}


                {/* NEW IMAGE */}

                <p>

                    <label htmlFor="image">
                        Change product image
                    </label>

                    <br />

                    <input
                        type="file"
                        accept="image/*"
                        id="image"
                        onChange={addFile}
                    />

                </p>


                {/* BUTTONS */}

                <p className="edit-buttons">

                    <button
                        id="cancel"
                        type="button"
                        onClick={() =>
                            router.push(
                                `/productDetails/${id}`
                            )
                        }
                    >
                        Cancel
                    </button>


                    <button
                        id="save"
                        type="button"
                        onClick={updateProduct}
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </p>

            </div>

        </div>

    );

}

