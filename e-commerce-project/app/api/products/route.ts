import { NextRequest } from "next/server";
import { productsDb } from "@/app/database/data";
import { isImageBySignature ,saveImage,deleteFile} from "../../bussinessLogic/files";
import { validProducts } from "@/app/validation/productValidation";
import { saveProducts,getProducts } from "@/app/bussinessLogic/products";
import { getSession } from "@/lib/session";
import { CustomError } from "@/app/errors/customErrors";
import { prisma } from "@/lib/prisma";
 
 
export const unAuthorizedResponse=new Response(JSON.stringify({error:"not authorised"}),{
            status: 401,
            headers:{
                "Content-Type":"application/json"
            }
        })
export async function GET(request: NextRequest) {
    // a session for auth
    const session = await getSession();

    if (!session) {
        return unAuthorizedResponse;
    }

    const { searchParams } = request.nextUrl;

    const onOfferParam = searchParams.get("onOffer");

    const onOffer =onOfferParam === "true"? true : onOfferParam === "false" ? false: undefined;
    const id = searchParams.get("id");
    const category = searchParams.get("category") || undefined;
    const limitParam = searchParams.get("limit");
    const pageParam = searchParams.get("page");

    const limit = limitParam
        ? Number(limitParam)
        : 10;

    const page = pageParam
        ? Number(pageParam)
        : 1;

    const sortBy = searchParams.get("sort");

    const search = searchParams.get("search") || undefined;

    const orderBy =
        searchParams.get("order") || undefined;


    /* =====================================================
       GET SINGLE PRODUCT
    ===================================================== */

    if (id) {

        const product =
            await productsDb.getProduct(
                Number(id),
                true
            );

        const data =
            product?.ownerId === session.user.id
                ? {
                      ...product,
                      owner: true
                  }
                : product;

        if (product) {
            return Response.json({
                data
            });
        }

        return Response.json(
            {
                error: "not found"
            },
            {
                status: 404
            }
        );
    }


    /* =====================================================
       VALIDATE PAGINATION
    ===================================================== */

    const safeLimit =
        Number.isFinite(limit) && limit > 0
            ? Math.min(limit, 100)
            : 10;

    const safePage =
        Number.isFinite(page) && page > 0
            ? page
            : 1;


    /* =====================================================
       GET PRODUCTS
    ===================================================== */

    const data:any= await getProducts(
            safeLimit,
            orderBy,
            safePage,
            search,
            category,
            onOffer
        );


    /* =====================================================
       TOTAL PRODUCTS
    ===================================================== */
    console.log("data[0]:", data[0]);
    const total =
    await prisma.product.count({
        where: onOffer !== undefined
            ? {
                  onOffer: onOffer
              }
            : undefined
    });

    const totalPages =
        Math.ceil(total / safeLimit);


    /* =====================================================
       RESPONSE
    ===================================================== */

    return Response.json({
        data,

        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages,

            hasNextPage:
                safePage < totalPages,

            hasPreviousPage:
                safePage > 1
        }
    });
}

export async function POST(request:NextRequest) {
    //a session for auth
    const session = await getSession();
    if(!session){
        return unAuthorizedResponse;
    }
    //get the data
    const data=await request.formData()
    const products=data.getAll("products[]")
    const images:any[]=data.getAll("images[]")

    //validate the data
    let validated;
    try{
        validated=validProducts(products,images)
    }catch(e){
        if(e instanceof CustomError)return new Response(JSON.stringify({error:e.message}),{status:400})
        return new Response(JSON.stringify({error:"validation failed"}),{status:400})
    }
    

    //save the data
    for(const i of images){
        if(await isImageBySignature(i)){
            await saveImage(i,i.name)
        }else{
            return new Response(JSON.stringify({error:"invalid input"}),{status:400})
        } 
    }
    const saved=await saveProducts(validated,session.user.id)
   
    //console.log(`saved: ${JSON.stringify(saved)}`)
    //return the rensponse body
        if(saved)return Response.json({
                message:"created",
                data:validated
            },{
                status:201
            }
        )
        return Response.json({
            error:{
                message:"failed"
            }
        },{
            status:400
        })

}
export async function PUT(request: NextRequest) {

    // Check authentication
    const session = await getSession();

    if (!session) {
        return unAuthorizedResponse;
    }

    // Get product ID
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");
    if (!id) {
        return Response.json(
            {
                error: "Product ID is required"
            },
            {
                status: 400
            }
        );
    }

    const productId = Number(id);

    if (Number.isNaN(productId)) {
        return Response.json(
            {
                error: "Invalid product ID"
            },
            {
                status: 400
            }
        );
    }

    try {

        // Check if product exists
        const existingProduct = await productsDb.getProduct(
            productId,
            true
        );

        if (!existingProduct) {
            return Response.json(
                {
                    error: "Product not found"
                },
                {
                    status: 404
                }
            );
        }

        // Get form data
        const data = await request.formData();
        const onOfferValue = data.get("onOffer")?.toString();
        const name = data.get("name")?.toString().trim();
        const quantityValue = data.get("quantity")?.toString();
        const priceValue = data.get("price")?.toString();
        const category = data.get("category")?.toString().trim();
        const description =
            data.get("description")?.toString().trim() || "";

        const image = data.get("image");

        // Validate required fields
        if (!name) {
            return Response.json(
                { error: "Product name is required" },
                { status: 400 }
            );
        }

        if (!quantityValue) {
            return Response.json(
                { error: "Product quantity is required" },
                { status: 400 }
            );
        }

        if (!priceValue) {
            return Response.json(
                { error: "Product price is required" },
                { status: 400 }
            );
        }

        if (!category) {
            return Response.json(
                { error: "Product category is required" },
                { status: 400 }
            );
        }

        const quantity = Number(quantityValue);
        const price = Number(priceValue);

        if (Number.isNaN(quantity) || quantity < 0) {
            return Response.json(
                { error: "Invalid quantity" },
                { status: 400 }
            );
        }

        if (Number.isNaN(price) || price < 0) {
            return Response.json(
                { error: "Invalid price" },
                { status: 400 }
            );
        }

        // Keep the old image unless a new image was uploaded
        let imageName = existingProduct.imageUrl;

        if (
            image instanceof File &&
            image.size > 0
        ) {

            // Check image signature
            const validImage =
                await isImageBySignature(image);

            if (!validImage) {
                return Response.json(
                    {
                        error: "Invalid image file"
                    },
                    {
                        status: 400
                    }
                );
            }

            // Save new image
            await saveImage(image, image.name);

            imageName = image.name;
        }

        const updateData: any = {
            name,
            price,
            quantity,
            category,
            description,
            imageUrl: imageName
        };

        if (onOfferValue !== null) {
            updateData.onOffer = onOfferValue === "true";
        }
        // Update product
        const updatedProduct =
            await productsDb.updateProduct(
                productId,
                updateData
            );

        return Response.json(
            {
                message: "Product updated successfully",
                data: updatedProduct
            },
            {
                status: 200
            }
        );

    } catch (error) {

        console.error(
            "UPDATE PRODUCT ERROR:",
            error
        );

        return Response.json(
            {
                error: "Failed to update product"
            },
            {
                status: 500
            }
        );
    }
}

export async function DELETE(request: NextRequest) {

    const session = await getSession();

    if (!session?.user?.id) {
        return unAuthorizedResponse;
    }

    const { searchParams } = request.nextUrl;

    const idParam = searchParams.get("id");

    if (!idParam) {
        return Response.json(
            {
                success: false,
                message: "Product ID is required",
            },
            { status: 400 }
        );
    }

    const id = Number(idParam);

    if (!Number.isInteger(id) || id <= 0) {
        return Response.json(
            {
                success: false,
                message: "Invalid product ID",
            },
            { status: 400 }
        );
    }

    try {

        const product = await prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                ownerId: true,
                imageUrl: true
            },
        });

        if (!product) {
            return Response.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 }
            );
        }

        if (product.ownerId !== session.user.id&&session.user.role!=="ADMIN") {
            return Response.json(
                {
                    success: false,
                    message: "You are not authorized to delete this product",
                },
                { status: 403 }
            );
        }

        await prisma.product.delete({
            where: { id },
        });
        try {
            await deleteFile(product.imageUrl);
        } catch (fileError) {
            console.error(
                "Failed to delete product image:",
                fileError
            );
        }
        return Response.json({
            success: true,
            message: "Product deleted successfully",
        });

    } catch (error) {

        console.error(
            "DELETE /api/products error:",
            error
        );

        return Response.json(
            {
                success: false,
                message: "Failed to delete product",
            },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {

    // Check authentication
    const session = await getSession();

    if (!session) {
        return unAuthorizedResponse;
    }

    // Get product ID
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
        return Response.json(
            {
                error: "Product ID is required"
            },
            {
                status: 400
            }
        );
    }

    const productId = Number(id);

    if (Number.isNaN(productId)) {
        return Response.json(
            {
                error: "Invalid product ID"
            },
            {
                status: 400
            }
        );
    }

    try {
        // Check if product exists
        const existingProduct =
            await productsDb.getProduct(
                productId,
                true
            );

        if (!existingProduct) {
            return Response.json(
                {
                    error: "Product not found"
                },
                {
                    status: 404
                }
            );
        }
        // Get offer status
        const data = await request.json();

        if (typeof data.onOffer !== "boolean") {
            return Response.json(
                {
                    error: "onOffer must be a boolean"
                },
                {
                    status: 400
                }
            );
        }

        // Update only offer status
        const updatedProduct =
            await productsDb.updateProduct(
                productId,
                {
                    onOffer: data.onOffer
                }
            );

        return Response.json(
            {
                message: data.onOffer
                    ? "Product added to offers"
                    : "Product removed from offers",
                data: updatedProduct
            },
            {
                status: 200
            }
        );

    } catch (error) {

        console.error(
            "UPDATE OFFER STATUS ERROR:",
            error
        );

        return Response.json(
            {
                error: "Failed to update offer status"
            },
            {
                status: 500
            }
        );
    }
}
