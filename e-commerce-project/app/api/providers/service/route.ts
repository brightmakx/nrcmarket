import { getSession } from "@/lib/session";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { servicesDb } from "@/app/database/data";
import { deleteFile } from "@/app/bussinessLogic/files";

function unauthorized() {
    return new Response(
        JSON.stringify({
            success: false,
            error: "Unauthorized",
        }),
        {
            status: 401,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}


/*
|--------------------------------------------------------------------------
| GET SERVICE
|--------------------------------------------------------------------------
*/

export async function GET(request:NextRequest) {
    try {
        const session = await getSession();

        if (!session?.user?.id) {
            return unauthorized();
        }
        const {searchParams}=request.nextUrl;
        const id=searchParams.get("id")
        const userId = session.user.id;

        const provider = await prisma.serviceProvider.findUnique({
            where: {
                userId,
            },
        });

        if (!provider) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "You are not a service provider",
                }),
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        if(id){
         const data= await servicesDb.getService(Number(id))
         return new Response(JSON.stringify({data}))
        }
        type imageType={ id: number; createdAt: Date; name: string; serviceId: number | null; serviceProviderId: number | null; }
        const providerServices:{
                name: string;
                description: string;
                conditions: string[];
                id: number;
                images?:imageType[];
                providerId?: string | null;
                }[]=await servicesDb.getServicesByProviderId(session.user.id)
        let data:any[]=[]
        for(const p of providerServices){
            delete p.providerId
            let n={...p,serviceImage:p.images?p.images[0]?.name:null}
            delete n.images
            data.push(n)
            console.log("service images: ",JSON.stringify(p.images))
        }
        return new Response(
            JSON.stringify({
                success: true,
                data
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

    } catch (error) {
        console.error("GET service error:", error);

        return new Response(
            JSON.stringify({
                success: false,
                error: "Failed to retrieve service",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}


/*
|--------------------------------------------------------------------------
| PUT - EDIT SERVICE
|--------------------------------------------------------------------------
*/

export async function PUT(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session?.user?.id) {
            return unauthorized();
        }

        const userId = session.user.id;

        const body = await req.json();

        const {
            name,
            description,
            conditions,
            fee,
        } = body;


        // Find provider belonging to logged-in user
        const provider = await prisma.serviceProvider.findUnique({
            where: {
                userId,
            },
            select: {
                id: true,
                serviceId: true,
            },
        });


        if (!provider) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "You are not a service provider",
                }),
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }


        if (!provider.serviceId) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "You do not have a service to edit",
                }),
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }


        // Basic validation
        if (!name || !name.trim()) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Service name is required",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }


        const updatedService = await prisma.service.update({
            where: {
                id: provider.serviceId,
            },
            data: {
                name: name.trim(),

                description:
                    typeof description === "string"
                        ? description.trim()
                        : "",

                conditions:
                    Array.isArray(conditions)
                        ? conditions
                        : [],

                fee:
                    fee !== null &&
                    fee !== undefined &&
                    fee !== ""
                        ? Number(fee)
                        : null,
            },
        });


        return new Response(
            JSON.stringify({
                success: true,
                message: "Service updated successfully",
                data: updatedService,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

    } catch (error) {
        console.error("PUT service error:", error);

        return new Response(
            JSON.stringify({
                success: false,
                error: "Failed to update service",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}

export async function DELETE(request:NextRequest) {
    try {
        const session = await getSession();

        if (!session?.user?.id) {
            return unauthorized();
        }

        const userId = session.user.id;

        const {searchParams}=request.nextUrl;
        const serviceId=searchParams.get("id")
        let id;
        if(serviceId){
            id=Number(serviceId)
        }

        if(!id){
            return new Response(JSON.stringify({error:"specify a valid id"}))
        }
        // Find the provider belonging to the logged-in user
        const provider = await prisma.serviceProvider.findUnique({
            where: {
                userId,
            },
            select: {
                id: true,
                serviceId: true,
            },
        });


        if (!provider) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "You are not a service provider",
                }),
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        //find the service to be deleted
        const service=await prisma.service.findFirst({
            where:{
                providerId:session.user.id,
                id:id
            },
            include:{
                images:true,
                videos:true
            }
        })

        if(!service){
            return new Response(JSON.stringify({error:"service not found"}),{status:404})
        }

        const bookings= await prisma.booking.findMany({
            where: {
                serviceId:id
            },
        });
 
        await prisma.$transaction(async (tx) => {

            // Delete service reviews
            await tx.serviceReview.deleteMany({
                where: {
                    serviceId: id,
                },
            });


            // Delete service images
            await tx.image.deleteMany({
                where: {
                    serviceId:id,
                },
            });

            try {
                for (const image of service.images) {
                    await deleteFile(image.name);
                }
            } catch (fileError) {
                console.error(
                    "Failed to delete service images:",
                    fileError
                );
            }

            // Delete videos
            await tx.video.deleteMany({
                where: {
                    serviceId:id,
                },
            });


            try {
                for (const video of service.videos) {
                    await deleteFile(video.name);
                }
            } catch (fileError) {
                console.error(
                    "Failed to delete service videos:",
                    fileError
                );
            }

            // Remove service from provider

            // Delete service
            await tx.service.delete({
                where: {
                    id: service.id,
                },
            });
        });


        return new Response(
            JSON.stringify({
                success: true,
                message: "Service deleted successfully",
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

    } catch (error) {
        console.error("DELETE service error:", error);

        return new Response(
            JSON.stringify({
                success: false,
                error: "Failed to delete service",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}