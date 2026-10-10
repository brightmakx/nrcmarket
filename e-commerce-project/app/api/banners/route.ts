import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveImage } from "@/app/bussinessLogic/files";
import { getSession } from "@/lib/session";
import path from "path";
import { unlink } from "fs/promises";


// GET ALL BANNERS
export async function GET() {
    try {

        const banners = await prisma.banner.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(banners);

    } catch (error) {

        console.error("Error fetching banners:", error);

        return NextResponse.json(
            {
                error: "Failed to fetch banners",
            },
            {
                status: 500,
            }
        );
    }
}


// UPLOAD BANNER
export async function POST(request: NextRequest) {

    try {

        // Check logged-in user
        const session = await getSession();

        if (!session?.user) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }


        // Check ADMIN
        if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                {
                    error: "Only administrators can upload banners",
                },
                {
                    status: 403,
                }
            );
        }


        const formData = await request.formData();

        const image = formData.get("image");


        if (!(image instanceof File)) {
            return NextResponse.json(
                {
                    error: "Banner image is required",
                },
                {
                    status: 400,
                }
            );
        }


        // Get extension
        const originalName = image.name;

        const extension =
            path.extname(originalName).toLowerCase();


        // Create unique filename
        const fileName =
            `banner-${Date.now()}-${crypto.randomUUID()}${extension}`;


        // Save image
        const saved = await saveImage(
            image,
            fileName
        );


        if (!saved) {
            return NextResponse.json(
                {
                    error: "Invalid image or image could not be saved",
                },
                {
                    status: 400,
                }
            );
        }


        // URL used by browser
        const imageUrl =
            `/images/${fileName}`;


        // Save database record
        const banner = await prisma.banner.create({
            data: {
                imageUrl,
            },
        });


        return NextResponse.json(
            banner,
            {
                status: 201,
            }
        );

    } catch (error) {

        console.error("Error uploading banner:", error);

        return NextResponse.json(
            {
                error: "Failed to upload banner",
            },
            {
                status: 500,
            }
        );
    }
}


// DELETE BANNER
export async function DELETE(request: NextRequest) {
    try {
        // 1. Get the logged-in user
        const session = await getSession();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Get the user's actual role from the database
        const currentUser = await prisma.user.findUnique({
            where: {
                id: session.user.id
            },
            select: {
                role: true
            }
        });

        // 3. Make sure the user exists
        if (!currentUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // 4. Check if the user is an ADMIN
        if (currentUser.role !== "ADMIN") {
            return NextResponse.json(
                {
                    error: "Only administrators can delete banners",
                    role: currentUser.role
                },
                { status: 403 }
            );
        }

        // 5. Get the banner ID
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: "Banner ID is required" },
                { status: 400 }
            );
        }

        // 6. Find the banner
        const banner = await prisma.banner.findUnique({
            where: { id }
        });

        if (!banner) {
            return NextResponse.json(
                { error: "Banner not found" },
                { status: 404 }
            );
        }

        // 7. Delete the database record
        await prisma.banner.delete({
            where: { id }
        });

        // 8. Delete the image file
        const imageName = path.basename(banner.imageUrl);

        const imagePath = path.join(
            process.cwd(),
            "public",
            "images",
            imageName
        );

        try {
            await unlink(imagePath);
        } catch (error) {
            console.warn(
                "Could not delete image file:",
                error
            );
        }

        return NextResponse.json({
            message: "Banner deleted successfully"
        });

    } catch (error) {
        console.error(
            "Error deleting banner:",
            error
        );

        return NextResponse.json(
            { error: "Failed to delete banner" },
            { status: 500 }
        );
    }
}