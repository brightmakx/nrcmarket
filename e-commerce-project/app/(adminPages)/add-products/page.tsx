"use client"

import { useEffect, useState } from "react"
import "@/app/components/styles/createProduct1.css"
import toast from "react-hot-toast"
import { authenticate } from "@/lib/actions/sever-actions"
import { loginRedirect } from "@/lib/actions/redirects"

type productObject = {
    name?: string
    quantity?: string
    price?: string
    category?: string
    categoryId?: string
    description?: string
}

type Category = {
    id: number
    name: string
}

export default function Page() {

    useEffect(() => {
        async function auth() {
            const user = await authenticate()

            if (!user) {
                loginRedirect()
            }
        }

        auth()
    }, [])

    const [products, setProducts] =
        useState<productObject[] | null>([])

    const [product, setProduct] =
        useState<productObject | null>()

    const [files, setFiles] =
        useState<File[] | null>([])

    const [file, setFile] =
        useState<File | null>()

    const [categories, setCategories] =
        useState<Category[]>([])

    useEffect(() => {

        async function fetchCategories() {

            try {

                const res = await fetch(
                    "/api/categories"
                )

                const result = await res.json()

                if (!res.ok) {
                    toast.error(
                        result.message ||
                        "Failed to load categories"
                    )
                    return
                }

                setCategories(result.data || [])

            } catch {

                toast.error(
                    "Failed to load categories"
                )
            }
        }

        fetchCategories()

    }, [])

    function addFile(
        e: React.ChangeEvent<HTMLInputElement>
    ) {

        const f = e.target.files?.[0]

        if (f) {
            setFile(f)
        }
    }

    function handleProductChange(
        event: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) {

        const {
            name,
            value
        } = event.currentTarget

        if (name === "categoryId") {

            const selectedCategory =
                categories.find(
                    category =>
                        category.id === Number(value)
                )

            setProduct({
                ...product,
                categoryId: value,
                category:
                    selectedCategory?.name
            })

            return
        }

        setProduct({
            ...product,
            [name]: value || null
        })
    }

    function addToList() {

        if (product != null) {

            if (!product.categoryId) {

                toast.error(
                    "Please select a category"
                )

                return
            }

            if (products != null) {

                setProducts([
                    ...products,
                    product
                ])

            } else {

                setProducts([
                    product
                ])
            }
        }

        if (file != null) {

            if (files !== null) {

                setFiles([
                    ...files,
                    file
                ])

            } else {

                setFiles([
                    file
                ])
            }
        }

        toast.success(
            "Product added to list"
        )

        setProduct(null)
        setFile(null)
    }

    function send() {

        const formData = new FormData()

        if (products) {

            for (const p of products) {

                formData.append(
                    "products[]",
                    JSON.stringify(p)
                )
            }
        }

        if (files) {

            for (const f of files) {

                formData.append(
                    "images[]",
                    f
                )
            }
        }

        async function sendData() {

            try {

                const res = await fetch(
                    "/api/products",
                    {
                        
                        method: "POST",
                        body: formData
                    }
                )

                const result =
                    await res.json()

                if (!res.ok) {

                    toast.error(
                        result.message ||
                        "Failed to add products"
                    )

                    return
                }

                toast.success(
                    "Products added successfully"
                )

                setFiles([])
                setProducts([])

            } catch {

                toast.error(
                    "Something went wrong"
                )
            }
        }

        sendData()
    }

    return (

        <div className="main mx-auto w-80">

            <h1 className="font-bold">
                add products
            </h1>

            <div className="details">

                <p>

                    <label htmlFor="name">
                        name
                    </label>

                    <br />

                    <input
                        id="name"
                        placeholder="product name"
                        name="name"
                        onChange={handleProductChange}
                        value={
                            product?.name ?? ""
                        }
                    />

                </p>

                <p>

                    <label htmlFor="stock">
                        stock
                    </label>

                    <br />

                    <input
                        id="stock"
                        placeholder="quantity of the product"
                        name="quantity"
                        onChange={handleProductChange}
                        value={
                            product?.quantity ?? ""
                        }
                    />

                </p>

                <p>

                    <label htmlFor="price">
                        price
                    </label>

                    <br />

                    <input
                        id="price"
                        placeholder="price per product"
                        name="price"
                        onChange={handleProductChange}
                        value={
                            product?.price ?? ""
                        }
                    />

                </p>

                <p>

                    <label htmlFor="category">
                        Category
                    </label>

                    <br />

                    <select
                        id="category"
                        name="categoryId"
                        value={
                            product?.categoryId ?? ""
                        }
                        onChange={
                            handleProductChange
                        }
                    >

                        <option value="">
                            Select category
                        </option>

                        {categories.map(
                            (category) => (

                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>

                            )
                        )}

                    </select>

                </p>

                <p>

                    <label htmlFor="description">
                        Description
                    </label>

                    <br />

                    <input
                        type="text"
                        id="description"
                        name="description"
                        onChange={
                            handleProductChange
                        }
                        value={
                            product?.description ?? ""
                        }
                    />

                </p>

                <p>

                    <label htmlFor="image">
                        product image
                    </label>

                    <br />

                    <input
                        type="file"
                        accept="image/*"
                        id="image"
                        onChange={addFile}
                    />

                </p>

                <p>

                    <button
                        id="addToList"
                        onClick={addToList}
                    >
                        addToList
                    </button>

                    <button
                        id="send"
                        onClick={send}
                        className="sm:bg-blue-400"
                    >
                        send
                    </button>

                </p>

            </div>

        </div>
    )
}