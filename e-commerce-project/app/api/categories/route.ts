import { NextRequest, NextResponse } from "next/server";
import { categoryBusiness } from "@/app/bussinessLogic/category";
import { getSession } from "@/lib/session";
import { saveImage, validateImage } from "@/app/bussinessLogic/files";
import crypto from "crypto";
import path from "path";
import { unAuthorizedResponse } from "../products/route";
 

export async function GET(request: NextRequest) {

    const session = await getSession();

    if (!session?.user) {
        return unAuthorizedResponse;
    }

    try {

        const { searchParams } =request.nextUrl

        const idParam = searchParams.get("id");
        const name = searchParams.get("name");
        const sortBy = searchParams.get("sortBy") || undefined;

        const includeProducts=searchParams.get("includeProducts")

        const orderParam = searchParams.get("order");
        const order =
            orderParam === "asc" || orderParam === "desc"
                ? orderParam
                : undefined;

        if (idParam) {

            const id = Number(idParam);

            if (!Number.isInteger(id) || id <= 0) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid category ID",
                    },
                    { status: 400 }
                );
            }

            const result =!includeProducts? await categoryBusiness.getCategoryById(id): await categoryBusiness.getCategoryWithProducts(id);

            return NextResponse.json(
                result,
                { status: result.success ? 200 : 404 }
            );
        }

        if (name) {
            const result =await categoryBusiness.getCategoryByName(name);
            return NextResponse.json(
                result,
                { status: result.success ? 200 : 404 }
            );
        }

        const result =!includeProducts?await categoryBusiness.getCategories(
                sortBy,
                order
            ):await categoryBusiness.getCategoriesWithProducts();

        return NextResponse.json(result);

    } catch (error) {

        console.error("GET /api/categories error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve categories",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {

    try {

        const session = await getSession();

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const formData = await request.formData();

        const name = formData.get("name");
        const description = formData.get("description");
        const image = formData.get("image");

        if (!(image instanceof File)) {
            return NextResponse.json(
                {
                    success: false,
                    errors: {
                        image: "Category image is required.",
                    },
                },
                { status: 400 }
            );
        }

        const imageValidation = await validateImage(image);

        if (!imageValidation.valid) {
            return NextResponse.json(
                imageValidation,
                { status: 400 }
            );
        }

        const extension = path.extname(image.name).toLowerCase();
        const imageName = `${crypto.randomUUID()}${extension}`;

        const result =
            await categoryBusiness.createCategory({
                name: typeof name === "string" ? name : "",
                imageUrl: imageName,
                description:
                    typeof description === "string"
                        ? description
                        : null,
            });

        if (!result.success) {
            return NextResponse.json(
                result,
                { status: 400 }
            );
        }

        const imageSaved =
            await saveImage(image, imageName);

        if (!imageSaved) {
            if(result.data){
                await categoryBusiness.deleteCategory(
                result.data.id
            );
            }
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to save category image.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            result,
            { status: 201 }
        );

    } catch (error) {

        console.error("POST /api/categories error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create category",
            },
            { status: 500 }
        );
    }
}