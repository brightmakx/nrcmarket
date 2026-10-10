import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getSession } from "@/lib/session";
import { unAuthorizedResponse } from "../products/route";
import { addService, addServiceImage, addServiceVideo, findAllServices, findServiceById, addServiceConditions, } from "@/app/bussinessLogic/service";
import { isImageBySignature, saveImage, saveImages, saveVideo } from "@/app/bussinessLogic/files";
import { serviceProvider } from "@/app/bussinessLogic/providers";
import { servicesDb } from "@/app/database/data";
import { prisma } from "@/lib/prisma";


export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const session = await getSession();

    if (!session) {
        return unAuthorizedResponse;
    }

    let result;
    const id = searchParams.get("id");
    const sort = searchParams.get("sortBy") || undefined;
    const order = searchParams.get("orderBy") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = Number(searchParams.get("page")) || 0;
    const limit = Number(searchParams.get("limit")) || 0;

    if (id) {
        try {
            const n = Number(id);
            const res = await findServiceById(n);

            if (res.error) {
                return new Response(
                    JSON.stringify({
                        error: "failed to find service with that id"
                    }),
                    { status: 400 }
                );
            }

            result = [res.data];
        } catch {
            return new Response(
                JSON.stringify({ error: "service id must be a number" }),
                { status: 400 }
            );
        }
    } else {
        try {
            result = await findAllServices(
                sort,
                order,
                limit > 0 && page > 0 ? limit : undefined,
                limit > 0 && page > 0 ? page : undefined,
                search
            );
        } catch (e) {
            console.error(e);
            return new Response(
                JSON.stringify({ error: "failed to process your request" }),
                { status: 400 }
            );
        }
    }

    return new Response(
        JSON.stringify({ data: result }),
        { status: 200 }
    );
}
export async function POST(req:NextRequest) {
    const session=await getSession()
    if(!session?.user.id){
        return unAuthorizedResponse;
    }
    const data=await req.json()

    const provider=new serviceProvider(session.user.id,{name:"",location:"",phone:""})
    const isProvider=await provider.isProvider()
    if(!isProvider)return new Response(JSON.stringify({error:"you are not a provider"}),{
        status:401,
        headers:{
                "Content-Type":"application/json"
            }
    })

    const res=await addService(data.name,data.description,session.user.id,data.price)
    if(res.data){
        return new Response(JSON.stringify({data:res.data}))
    }
    if(res.errors){
        return new Response(JSON.stringify({error:"invalid input",errors:res.errors}),{
            status:400,
            headers:{
                "Content-Type":"application/json"
            }
        })
    }
    return new Response(JSON.stringify({error:res.error}),{
        status:400
    });
}

//update request
export async function PUT(req: NextRequest) {

    const session = await getSession();

    if (!session?.user.id) {
        return unAuthorizedResponse;
    }

    try {

        const formData = await req.formData();

        // =========================
        // DATA
        // =========================

        const serviceId = formData.get("serviceId");

        const name = formData.get("name");

        const fee = formData.get("fee");

        const description =
            formData.get("description");

        const conditions = formData.getAll(
            "conditions"
        ) as string[];

        const image = formData.get("image");

        const video = formData.get("video");


        // =========================
        // SERVICE ID
        // =========================

        const id = Number(serviceId);

        if (!Number.isInteger(id) || id <= 0) {

            return new Response(
                JSON.stringify({
                    error:
                        "serviceId must be a valid number"
                }),
                {
                    status: 400
                }
            );
        }


        // =========================
        // CHECK OWNERSHIP
        // =========================

        const service =
            await servicesDb.getService(id);

        if (!service) {

            return new Response(
                JSON.stringify({
                    error: "service not found"
                }),
                {
                    status: 404
                }
            );
        }

        if (
            service.providerId !==
            session.user.id
        ) {

            return new Response(
                JSON.stringify({
                    error:
                        "only allowed to update your service"
                }),
                {
                    status: 403
                }
            );
        }


        // =========================
        // TRACK WHETHER ANYTHING
        // WAS UPDATED
        // =========================

        let updated = false;


        // =========================
        // NAME
        // =========================

        if (
            typeof name === "string" &&
            name.trim().length > 0
        ) {

            const value = name.trim();

            if (value.length < 5) {

                return new Response(
                    JSON.stringify({
                        error:
                            "service name must be at least 5 characters"
                    }),
                    {
                        status: 400
                    }
                );
            }

            await prisma.service.update({

                where: {
                    id
                },

                data: {
                    name: value
                }

            });

            updated = true;
        }


        // =========================
        // DESCRIPTION
        // =========================

        if (
            typeof description === "string" &&
            description.trim().length > 0
        ) {

            const value =
                description.trim();

            await prisma.service.update({

                where: {
                    id
                },

                data: {
                    description: value
                }

            });

            updated = true;
        }


        // =========================
        // FEE
        // =========================

        if (
            typeof fee === "string" &&
            fee.trim() !== ""
        ) {

            const value = Number(
                fee.trim()
            );

            if (
                !Number.isFinite(value) ||
                value < 0
            ) {

                return new Response(
                    JSON.stringify({
                        error:
                            "fee must be a valid number greater than or equal to 0"
                    }),
                    {
                        status: 400
                    }
                );
            }

            await prisma.service.update({

                where: {
                    id
                },

                data: {
                    fee: value
                }

            });

            updated = true;
        }


        // =========================
        // CONDITIONS
        // =========================

        if (conditions.length > 0) {

            const validConditions: string[] = [];

            for (const condition of conditions) {

                const value =
                    condition.trim();

                if (value.length < 8) {

                    return new Response(
                        JSON.stringify({
                            error:
                                `${value}; too short! It should have at least 8 characters`
                        }),
                        {
                            status: 400
                        }
                    );
                }

                validConditions.push(value);
            }

            await addServiceConditions({

                serviceId: id,

                conditions:
                    validConditions

            });

            updated = true;
        }


        // =========================
        // IMAGE
        // =========================

        const imageFile =
            image instanceof File &&
            image.size > 0
                ? image
                : null;


        if (imageFile) {

            const imageName =
                globalThis.crypto.randomUUID() +
                new Date().toISOString() +
                imageFile.name;


            const result =
                await addServiceImage({

                    name: imageName,

                    serviceId: id

                });


            if (result?.error) {

                return new Response(
                    JSON.stringify({
                        error:
                            result.error
                    }),
                    {
                        status: 400
                    }
                );
            }


            if (result?.validationErrors) {

                return new Response(
                    JSON.stringify({
                        error:
                            "failed validation",

                        validationErrors:
                            result.validationErrors
                    }),
                    {
                        status: 400
                    }
                );
            }


            if (result?.data) {

                await saveImage(
                    imageFile,
                    imageName
                );

                updated = true;
            }
        }


        // =========================
        // VIDEO
        // =========================

        const videoFile =
            video instanceof File &&
            video.size > 0
                ? video
                : null;


        if (videoFile) {

            const videoName =
                globalThis.crypto.randomUUID() +
                new Date().toISOString() +
                videoFile.name;


            const result =
                await addServiceVideo(
                    id,
                    videoName
                );


            if (result?.error) {

                return new Response(
                    JSON.stringify({
                        error:
                            result.error
                    }),
                    {
                        status: 400
                    }
                );
            }


            if (result?.validationErrors) {

                return new Response(
                    JSON.stringify({
                        error:
                            "failed validation",

                        validationErrors:
                            result.validationErrors
                    }),
                    {
                        status: 400
                    }
                );
            }


            if (result?.data) {

                await saveVideo(
                    videoFile,
                    videoName
                );

                updated = true;
            }
        }


        // =========================
        // NOTHING TO UPDATE
        // =========================

        if (!updated) {

            return new Response(
                JSON.stringify({
                    error:
                        "nothing to update"
                }),
                {
                    status: 400
                }
            );
        }


        // =========================
        // SUCCESS
        // =========================

        return new Response(
            JSON.stringify({
                message:
                    "Service updated successfully"
            }),
            {
                status: 200
            }
        );

    } catch (error) {

        console.error(
            "Failed to update service:",
            error
        );

        return new Response(
            JSON.stringify({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to update service"
            }),
            {
                status: 400
            }
        );
    }
}
export async function DELETE(req: NextRequest) {
    const session = await getSession();

    if (!session?.user.id) {
        return unAuthorizedResponse;
    }

    try {
        const { searchParams } = req.nextUrl;

        const type = searchParams.get("type");
        const mediaId = searchParams.get("id");

        if (
            !mediaId ||
            !["image", "video"].includes(type || "")
        ) {
            return new Response(
                JSON.stringify({
                    error:
                        "A valid media type and ID are required",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                }
            );
        }

        const id = Number(mediaId);

        if (!Number.isInteger(id) || id <= 0) {
            return new Response(
                JSON.stringify({
                    error: "Invalid media ID",
                }),
                {
                    status: 400,
                }
            );
        }

        // Find the media and its service
        let media:
            | {
                  id: number;
                  name: string;
                  serviceId: number | null;
              }
            | null = null;

        if (type === "image") {
            media = await prisma.image.findUnique({
                where: { id },
            });
        } else {
            media = await prisma.video.findUnique({
                where: { id },
            });
        }

        if (!media) {
            return new Response(
                JSON.stringify({
                    error: "Media not found",
                }),
                {
                    status: 404,
                }
            );
        }

        if (!media.serviceId) {
            return new Response(
                JSON.stringify({
                    error:
                        "This media is not attached to a service",
                }),
                {
                    status: 400,
                }
            );
        }

        // Check that the logged-in user owns the service
        const service =
            await prisma.service.findUnique({
                where: {
                    id: media.serviceId,
                },
            });

        if (!service) {
            return new Response(
                JSON.stringify({
                    error: "Service not found",
                }),
                {
                    status: 404,
                }
            );
        }

        if (
            service.providerId !==
            session.user.id
        ) {
            return new Response(
                JSON.stringify({
                    error:
                        "You are not allowed to delete this media",
                }),
                {
                    status: 403,
                }
            );
        }

        // Delete the physical file
        const filePath = path.join(
            process.cwd(),
            "public",
            "images",
            media.name
        );

        try {
            await fs.unlink(filePath);
        } catch (error: any) {
            // File may already be missing.
            // We still remove the database record.
            if (error?.code !== "ENOENT") {
                console.error(
                    "Failed to delete physical file:",
                    error
                );
            }
        }

        // Delete database record
        if (type === "image") {
            await prisma.image.delete({
                where: { id },
            });
        } else {
            await prisma.video.delete({
                where: { id },
            });
        }

        return new Response(
            JSON.stringify({
                message:
                    `${
                        type === "image"
                            ? "Image"
                            : "Video"
                    } deleted successfully`,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type":
                        "application/json",
                },
            }
        );
    } catch (error) {
        console.error(
            "Delete service media error:",
            error
        );

        return new Response(
            JSON.stringify({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete media",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type":
                        "application/json",
                },
            }
        );
    }
}