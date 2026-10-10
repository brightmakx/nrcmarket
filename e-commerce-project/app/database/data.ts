import { prisma } from "../../lib/prisma"
import { getAllProducts} from "../data/products";//the products we've been using 
import { Status } from "../../lib/generated/prisma/enums";
import { userEntityType } from "../types/userTypes";
import { orderEntityType } from "../types/orderTypes";
import { orderItemEntityType } from "../types/orderItemTypes";
import { categoryEntityType } from "../types/categoryTypes";
import { serviceEntityType,} from "../types/serviceTypes";
import { serviceProviderEntityType } from "../types/serviceProviderEntityType";
import { agentEntityType } from "../types/agentTypes";
import { CustomError } from "../errors/customErrors";
 import { unstable_cache } from "next/cache";

export async  function getProducts(sortBy?:string,order?:string){
    const products=await prisma.product.findMany({
        orderBy:{
            [sortBy || 'id']:(order as 'asc' | 'desc') || 'asc'
        }
    });
    return products;
}

export async function createProduct(name:string,price:number,imageUrl:string,rating:number,category:string){

    const categoryObject=await prisma.category.findFirst({
        where:{
            name:{equals:category}
        }
    })

    //adding a product to the database
    const product=await prisma.product.create({
        data:{
            name:name,
            price:price,
            imageUrl:imageUrl,
            rating:rating,
            quantity:1,
            category:{
                //handling the relationship, create if the category doesnt exist otherwise connect
                connectOrCreate:{
                    where:{
                        name:category//if this exists it will just connect the created product to that category
                    },
                    create:{
                        //if not it will create the category and connect it to this product
                        name:category,
                        imageUrl:imageUrl
                    }
                }
            }
        }
    })
    return product;
}



export default async function Db(){
    const products=await getAllProducts();

    //taking all products from the list
    //and pass them one by one to createProduct function ndaipanga mmwambamu
    for (const p of products){
        await createProduct(p.name,p.price,p.imageUrl,p.rating,p.category);
    }

    //just to confirm on the console
    //console.log("products created");

   /*
   
   deleting all

    await prisma.product.deleteMany();
    await prisma.category.deleteMany();*/

}
type productEntity={name:string,price:number,imageUrl:string,rating:number,category:string,quantity:number,description?:string,categoryId?:number,ownerId?:string}
export const productsDb={
    createProduct:function({name,price,imageUrl,rating,category,quantity,description,categoryId,ownerId}:productEntity){
        return prisma.product.create({
            data:{
                name:name,
                price:price,
                imageUrl:imageUrl,
                rating:rating,
                quantity:quantity,
                description:description? description:null,
                categoryId:categoryId||1,
                ownerId
            }
        })

    },
    createProducts:async function(productsList:productEntity[],ownerId:string){
        let products=[]
        for(const p of productsList){
            const x=await this.createProduct({...p,ownerId})
            if(!x) throw new  CustomError(`failed to save product: ${p.name}`)
            products.push(x);
        }
        return products;
    },
    getProduct:async function(id:number,includeCategory=false){
        const product=await prisma.product.findUnique({
            where:{
                id:id
            },
            include:{
                category:includeCategory
            }
        })
        return product;
    },
    updateProduct: async function (
    id: number,
    {
        name,
        price,
        quantity,
        imageUrl,
        category,
        description,
        onOffer
    }: {
        name?: string;
        price?: number;
        quantity?: number;
        imageUrl?: string;
        category?: string;
        description?: string;
        onOffer?: boolean;
    }
) {

    return await prisma.product.update({
        where: {
            id: id
        },

        data: {

            ...(onOffer !== undefined && {
                onOffer: onOffer
            }),

            ...(name !== undefined && {
                name: name
            }),

            ...(price !== undefined && {
                price: price
            }),

            ...(quantity !== undefined && {
                quantity: quantity
            }),

            ...(description !== undefined && {
                description: description || null
            }),

            ...(imageUrl !== undefined && {
                imageUrl: imageUrl
            }),

            ...(category !== undefined && {
                category: {
                    connectOrCreate: {
                        where: {
                            name: category
                        },
                        create: {
                            name: category,
                            imageUrl: imageUrl || ""
                        }
                    }
                }
            })
        },

        include: {
            category: true
        }
    });
},
//cache the products to avoid multiple requests
getProducts: async function (
    order?: string,
    limit?: number,
    page?: number,
    category?: string,
    onOffer?: boolean
) {
    const products = await prisma.product.findMany({
        where: {
            ...(category && {
                category: {
                    name: category
                }
            }),

            ...(onOffer !== undefined && {
                onOffer: onOffer
            })
        },
                orderBy: {
                    id: (order as "asc" | "desc") || "asc"
                },
                ...(limit
                    ? {
                        skip: page
                            ? (page - 1) * limit
                            : 0,
                        take: limit
                    }
                    : {})
            });

            return products;
        },
 searchProducts: async function (
    search: string,
    limit?: number,
    page?: number,
    category?: string,
    onOffer?:boolean
) {
    const offset = limit && page
        ? (page - 1) * limit
        : 0;

    const ftsProducts:[] = await prisma.$queryRaw`
        SELECT
            p.id,
            p.name,
            p."imageUrl",
            p.rating,
            p."categoryId",
            p.price,
            p.quantity,
            p.description,
            p."ownerId"
        FROM ecommerce."Product" p
        WHERE
            p.search_vector @@ websearch_to_tsquery(
                'english',
                ${search}
            )
            AND (
                ${category}::text IS NULL
                OR EXISTS (
                    SELECT 1
                    FROM ecommerce."Category" c
                    WHERE c.id = p."categoryId"
                    AND c.name = ${category}
                )
            )
        ORDER BY ts_rank(
            p.search_vector,
            websearch_to_tsquery('english', ${search})
        ) DESC
        LIMIT ${limit || 10}
        OFFSET ${offset}
    `;

    if (ftsProducts.length > 0) {
        return ftsProducts;
    }

    const fuzzyProducts = await prisma.$queryRaw`
        SELECT
            p.id,
            p.name,
            p."imageUrl",
            p.rating,
            p."categoryId",
            p.price,
            p.quantity,
            p.description,
            p."ownerId"
        FROM ecommerce."Product" p
        WHERE
            p.name % ${search}
            AND (
                ${category}::text IS NULL
                OR EXISTS (
                    SELECT 1
                    FROM ecommerce."Category" c
                    WHERE c.id = p."categoryId"
                    AND c.name = ${category}
                )
            )
        ORDER BY similarity(p.name, ${search}) DESC
        LIMIT ${limit || 10}
        OFFSET ${offset}
    `;

    return fuzzyProducts;
},
    getCategoryByName:async function(name:string){
        const category=await prisma.category.findFirst({
            where:{
                name:name
            }
        })
        return category;
    },
    getCategoryById:async function (id:number) {
        const category=await prisma.category.findUnique({
            where:{id},
            include:{
                products:true
            }
        })
    }
    ,
    getCategories:async function(sortBy?:string,order?:string){
        const categories=await prisma.category.findMany({
            orderBy:{
                [sortBy || 'id']:(order as 'asc' | 'desc') || 'asc'
            },
            include:{
                products:true
            }
        });
        return categories;
    },
    decrementProductQuantity:async (id:number,decrement:number)=>{
        return await prisma.product.update({
            where:{
                id:id
            },
            data:{
                price:{
                    decrement:decrement
                }
            }
        })
    },
    deleteAllProducts:async ()=>{
        await prisma.product.deleteMany();
    }
}

export const usersDb={
    updateUser:async function(id:string,data:any){
        return await prisma.user.update({
            where:{
                id:id
            },
            data
        })
    },
    createUser:async function({name,email,password,phone,location}:userEntityType){
        //console.log(email);
        return prisma.user.create({
            data:{
                id:"",
                name:name,
                email:email,
                phone:phone,
                location:location
            }
        })
    },
    getUserBySession:async function(session:string) {
        return await prisma.user.findFirst({
            where:{
            }
        })
    },
    getUserByEmail:async function(email:string) {
        return await prisma.user.findUnique({
            where:{
                email:email
            },
            include:{
                serviceProvider:true
            }
        })
    },
    /*createUsers:async function(usersList:userEntityType[]){
        return prisma.user.createMany({
            data:usersList
        })
    },*/
    getUser:async function(id:string, includeOrders?:boolean){
        const user=await prisma.user.findUnique({
            where:{
                id:id
            },
            include:{
                serviceProvider:true,
                orders:includeOrders===true?{
                    orderBy:{
                        createdAt:"desc"
                    },
                }:false
            }
        })
        return user;
    },
    getUsers:async function(sortBy?:string,order?:string){
        const users=await prisma.user.findMany({
            orderBy:{
                [sortBy || 'id']:(order as 'asc' | 'desc') || 'asc'
            }
        });
        return users;
    },
    async deleteUserByEmail(email:string) {
    const deleted=await prisma.user.delete({
        where:{
            email:email
        }
    })
    return deleted;
    },
    async createService({}){

    }

}
export const ordersDb={
    deleteAll:async ()=>{
        await prisma.order.deleteMany()
    },
    //ids of the orderd products
    getProductIds:async function(products:any) {
        let Ids:any=[];
        async function getIds(){ 
            for(const p of products){
                const pd=await prisma.product.findFirst({
                    where:{
                        name:{
                            equals:p.name
                        }
                    }
                })
                pd?.id&&Ids.push(pd.id)
            }
        }
        await getIds();
        return Ids;
    }, 
    createOrder:async function({userId,quantity,totalPrice,status,products}:orderEntityType){
        const st=status.toUpperCase()
        const productIds=await this.getProductIds(products)
        const result= prisma.order.create({
            data:{
                userId:userId,
                quantity:quantity,
                cost:totalPrice,
                status:st as Status,
            }
    })
    return result;
},

    getOrder:async function(id:number){
        const order=await prisma.order.findUnique({
            where:{
                id:id,
            },
            include:{
                orderedProducts:{
                    include:{
                        product:true
                    }
                },
                user:true
            }
        })
        return order;
    },
    getOrders:async function(sortBy?:string,order?:string,limit?:number){
         
        const orders=await prisma.order.findMany({
            orderBy:{
                [sortBy || 'id']:(order as 'asc' | 'desc') || 'asc'
            },
            
        });
        return orders;
    },
   getOrdersByUserId: async function(
    userId:string,
    sortBy?:string,
    order?:string,
    limit?:number
){

    const parentOrders = await prisma.parentOrder.findMany({

        where:{
            userId:userId
        },

        orderBy:{
            [sortBy || 'id']:
                (order as 'asc' | 'desc') || 'desc'
        },

        take:limit || 5,

        include:{
            orders:{
                include:{
                    seller:{
                        select:{
                            id:true,
                            name:true
                        }
                    },

                    orderedProducts:{
                        include:{
                            product:true
                        }
                    }
                }
            }
        }

    });

    return parentOrders;

},
    getOrderByUserEmail:async function(email:string) {
        const user=await usersDb.getUserByEmail(email);
        return await prisma.order.findMany({
            where:{
                userId:user?.id
            },
            orderBy:{
                createdAt:"desc"
            }
        })
    },
    updateOrderStatus:async function(id:number,status:string,agentId:string){
        const st=status.toUpperCase()
        const order=await prisma.order.updateMany({
            where:{
                id:id,
                status:{
                    not:Status.DELIVERED
                }
            },
            data:{
                status:st as Status,
                agentId:agentId
            }
        })
        return order.count>0? true:false;
    },
    deliverOrder: async (id: number, agentId: string) => {
        await prisma.$transaction(async (tx) => {
            // Get the order together with the products ordered
            const order = await tx.order.findUnique({
                where: {
                    id
                },
                include: {
                    orderedProducts: true
                }
            })

            if (!order) {
                throw new  CustomError("Order not found")
            }

            if (order.status === Status.DELIVERED) {
                throw new CustomError("Order has already been delivered")
            }

            // Decrement stock for each product
            for (const item of order.orderedProducts) {

                const updated = await tx.product.updateMany({
                    where: {
                        id: item.productId,
                        quantity: {
                            gte: item.quantity
                        }
                    },
                    data: {
                        quantity: {
                            decrement: item.quantity
                        }
                    }
                })

                // Stock is no longer sufficient
                if (updated.count === 0) {
                    throw new CustomError(
                        `Product ${item.productId} does not have enough stock`
                    )
                }
            }

            // Mark order as delivered
            await tx.order.update({
                where: {
                    id
                },
                data: {
                    agentId,
                    status: Status.DELIVERED
                }
            })
        })
        return true
    }
}

export const ordered_productsDb={
    getOrderedProduct:async function(id:number){
        const orderedProduct=await prisma.ordered_products.findUnique({
            where:{
                id:id
            }
        })
        return orderedProduct;
    },
    getOrderedProductByOderIdAndProductId:async (oderId:number,productId:number)=>{
        const data=await prisma.ordered_products.findUnique({
            where:{
                orderId_productId:{
                    productId:productId,
                    orderId:oderId
                }
            }
        })
    },
    addOrderedProduct:async function({orderId,productId,quantity,orderTimePrice}:orderItemEntityType){
        const orderedProduct=await prisma.ordered_products.create({
            data:{
                orderId:orderId,
                productId:productId,
                quantity:quantity,
                orderTimePrice:orderTimePrice
            }
        })
        return orderedProduct;
    },
    addOrderedProducts:async function(orderedProductsList:any){
        const orderedProducts=await prisma.ordered_products.createMany({
            data:orderedProductsList
        })
        return orderedProducts;
    },
    getOrderedProducts:async function(sortBy?:string,order?:string){
        const orderedProducts=await prisma.ordered_products.findMany({
            orderBy:{
                [sortBy || 'id']:(order as 'asc' | 'desc') || 'asc'
            }
        });
        return orderedProducts;
    }
}

export const servicesDb={
    async getServicesByProviderId(id:string){
        return await prisma.service.findMany({
            where:{
                providerId:id
            },
            include:{
                images:true
            }
        })
    },
    createService:async function({name,description,providers}:serviceEntityType){
        const service=await prisma.service.create({
            data:{
                name:name,
                description:description,
                providerId:""
            }
        })
        await prisma.serviceProvider.update({
            where:{
                id:service.id
            },data:{
                serviceId:providers[0].id
            }
        })
        return service;
    },
    createServices:async function(servicesList:any){
        const services=await prisma.service.createMany({
            data:servicesList
        })
        return services;
    },

    getService:async function(id:number){
        const service=await prisma.service.findUnique({
            where:{
                id:id
            },
            include:{
                images:{
                    orderBy:{
                       createdAt:"desc"
                    }
                },
                videos:{
                    orderBy:{
                        createdAt:"desc"
                    }
                },
                provider:{
                    include:{
                        serviceProvider:true
                    }
                }
            }
        })
        return service;
    },
    getServices: async function (
    sortBy?: string,
    order?: string,
    limit = 0,
    page = 0,
    search?: string
) {
    const include = {
        images: { orderBy: { createdAt: "desc" as const } },
        videos: { orderBy: { createdAt: "desc" as const } },
        provider: { include: { serviceProvider: true } }
    };

    if (search?.trim()) {
        const term = search.trim();
        const paginated = limit > 0 && page > 0;

        const matches = await prisma.$queryRaw<{ id: number }[]>`
            SELECT s.id
            FROM "ecommerce"."Service" s
            WHERE s.search_vector @@ plainto_tsquery('english', ${term})
               OR s.name % ${term}
            ORDER BY (
                ts_rank(s.search_vector, plainto_tsquery('english', ${term}))
                + public.similarity(s.name, ${term}) * 0.5
            ) DESC
            LIMIT ${paginated ? limit : null}
            OFFSET ${paginated ? (page - 1) * limit : 0}
        `;

        if (!matches.length) return [];

        const ids = matches.map(s => s.id);
        const services = await prisma.service.findMany({
            where: { id: { in: ids } },
            include
        });

        const positions = new Map(ids.map((id, i) => [id, i]));
        return services.sort(
            (a, b) => (positions.get(a.id) ?? 0) - (positions.get(b.id) ?? 0)
        );
    }

    return prisma.service.findMany({
        orderBy: {
            [sortBy || "id"]: (order as "asc" | "desc") || "asc"
        },
        ...(limit > 0 && page > 0
            ? { take: limit, skip: (page - 1) * limit }
            : {}),
        include
    });
},
    async addServiceConditions({serviceId,conditions}:{serviceId:number,conditions:string[]}){
        return await prisma.service.update({
            where:{
                id:serviceId
            },data:{
                conditions
            }
        })
    }
    
}

export const serviceProvidersDb={
    getServiceProviderByEmail:async (email:string)=>{
        return await prisma.serviceProvider.findUnique({
            where:{
                email
            }
        })
    },
    async getServiceProviderByUserId(userId:string){
        return await prisma.serviceProvider.findUnique({
            where:{
                userId:userId
            }
        })
    },
    getServiceProvider:async function(id:number){
        return await prisma.serviceProvider.findUnique({
            where:{
                id:id
            }
        })
    },
    createServiceProvider:async function({name,rating,location,phone,email,serviceId,userId,title,images,availability}:serviceProviderEntityType){
        return await prisma.serviceProvider.create({
            data:{
                availability,
                name:name,
                rating:rating,
                location:location,
                phone:phone,
                email:email,
                serviceId:serviceId,
                userId,
                title,
                images:{
                    createMany:{
                        data:images||[]
                    }
                }
            }
        })
    },
    addProviderImages: async function(images:string[],providerId:number) {
         for(const i of images){
            await prisma.image.create({
                data:{
                    name:i,
                    serviceProviderId:providerId
                }
            })
         }
    },
    createServiceProviders:async function(serviceProvidersList:serviceProviderEntityType[]){
        return await prisma.serviceProvider.createMany({
            data:serviceProvidersList
        })
    },
    getServiceProviders:async function(sortBy?:string,order?:string){
        const serviceProviders=await prisma.serviceProvider.findMany({
            orderBy:{
                [sortBy || 'id']:(order as 'asc' | 'desc') || 'asc'
            }
        });
        return serviceProviders;
    },
    getProviderService:async (email:string)=>{
        async function getServiceId(){
            const res=await prisma.serviceProvider.findUnique({
                where:{
                    email:email
                }
            })
            return res?.serviceId
        }
        const id=await getServiceId()
        return id? servicesDb.getService(id): null
    },
    addServiceProviderImage: async ({serviceId,providerId,name}:{providerId:number,name:string,serviceId:number})=>{
        return await  imagesDb.createImage(name,serviceId,providerId)
    },
    updateServiceProvider:async (userId:string,data:any)=>{
        return await prisma.serviceProvider.update({
            where:{
                userId:userId
            },
            data
        })
}
}
export const videosDb={
    createVideo:async (name:string,serviceId:number)=>{
        const video=await prisma.video.create({
            data:{
                name:name,
                serviceId:serviceId
            }
        })
        return video;
    },
    getVideo:async (id:number)=>{
        return await prisma.video.findUnique({
            where:{id}
        })
    },
    getServiceVideos:async (serviceId:number)=>{
        return await prisma.video.findMany({
            where:{
                serviceId
            }
        })
    }
}

export const imagesDb={
    createImage:async (name:string,serviceId:number,providerId?:number)=>{
        return await prisma.image.create({
            data:{
                name,
                serviceId,
                serviceProviderId:providerId
            }
        })
    },
    getImage:async (id:number)=>{
        return await prisma.image.findUnique({
            where:{id}
        })
    },
    getServiceImages:async (serviceId:number)=>{
        return await prisma.image.findMany({
            where:{serviceId}
        })
    }
}

export const agentsDb={
    createAgent:async function(userId:string,data:agentEntityType){
        const user=await prisma.user.findUnique({
            where:{id:userId}
        })
        if(user)return await prisma.agent.create({
            data:{
                userId:userId,
                name:data.name||user?.name||"",
                email:data.email||user?.email||"",
                phone:data.phone||user?.phone||"",
                location:data.location||user?.location||""
            }
        })
    },
    getAgent:async function(id:string,includeOrders?:boolean){
        if(!includeOrders) return await prisma.agent.findUnique({where:{id}})
        return await prisma.agent.findUnique({
            where:{id},
            include:{
                orders:{
                    include:{
                        orderedProducts:true
                    }
                }
            }
        }
    )
    },
    findAgent:async (userId:string)=>{
        return await prisma.agent.findUnique({
            where:{
                userId
            },
            include:{
                orders:true
            }
        })
    },
    getAgentByUserId:async (userId:string,includeOrders?:boolean)=>{
        return await prisma.agent.findUnique({
            where:{
                userId
            },
            include:{
                orders:{
                    include:{
                        orderedProducts:true,
                        user:true
                    }
                }
            }
        })
    },
    updateAgent:async (id:string,data:{})=>{
        return await prisma.agent.update({
            where:{
                id
            },
            data
        })
    }
}


export const bookingsDb = {

    createBooking: async function ({
        serviceId,
        providerId,
        userId,
        name,
        email,
        phone,
        location,
        preferredDate,
        message,
        fee,
    }: {
        serviceId: number;
        providerId: number;
        userId: string;
        name: string;
        email: string;
        phone: string;
        location: string;
        preferredDate?: Date | null;
        message?: string | null;
        fee: number;
    }) {

        return await prisma.booking.create({
            data: {
                serviceId,
                providerId,
                userId,
                name,
                email,
                phone,
                location,
                preferredDate,
                message,
                fee,
            },
        });
    },

    getServiceForBooking: async function (serviceId: number) {

        return await prisma.service.findUnique({
            where: {
                id: serviceId,
            },
            include: {
                provider: {
                    include: {
                        serviceProvider: true,
                    },
                },
            },
        });
    },

    getBooking: async function (id: number) {

        return await prisma.booking.findUnique({
            where: {
                id,
            },
            include: {
                service: true,
                provider: true,
                user: true,
                review:true
            },
        });
    },

    getUserBookings: async function (userId: string) {

        return await prisma.booking.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                service: true,
                provider: true,
            },
        });
    },

    getProviderBookings: async function (providerId: number) {

        return await prisma.booking.findMany({
            where: {
                providerId,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                service: true,
                user: true,
            },
        });
    },

    getProviderBookingsByUserId: async function (userId: string) {

        const provider = await prisma.serviceProvider.findUnique({
            where: {
                userId,
            },
        });

        if (!provider) {
            return null;
        }

        return await prisma.booking.findMany({
            where: {
                providerId: provider.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                service: true,
                user: true,
            },
        });
    },

    updateProviderBookingStatus: async function ({
        id,
        providerId,
        status,
    }: {
        id: number;
        providerId: number;
        status: "ACCEPTED" | "CANCELLED" | "COMPLETED";
    }) {

        return await prisma.booking.updateMany({
            where: {
                id,
                providerId,
            },
            data: {
                status,
            },
        });
    },
};

export const transactions = {
    orderTransaction: async (data: orderEntityType) => {

        const result = await prisma.$transaction(async (tx) => {

            // check products and get their owners
            const products = [];

            for (const p of data.products) {

                const product = await tx.product.findFirst({
                    where: {
                        id: p.id,
                        quantity: {
                            gte: p.quantity
                        }
                    }
                });

                // product does not have enough stock
                if (!product) {
                    throw new CustomError(
                        `Product ${p.name} is out of stock`
                    );
                }

                products.push({
                    ...p,
                    ownerId: product.ownerId
                });
            }


            // make parent order entity
            const parentOrder = await tx.parentOrder.create({
                data: {
                    userId: data.userId,
                    quantity: data.quantity,
                    cost: data.totalPrice
                }
            });


            // group products according to their owner
            const sellerProducts =
                new Map<string | null, typeof products>();

            for (const product of products) {

                if (!sellerProducts.has(product.ownerId)) {
                    sellerProducts.set(product.ownerId, []);
                }

                sellerProducts
                    .get(product.ownerId)!
                    .push(product);
            }


            // store created seller orders
            const orders:any[]= [];


            // create an order for each owner
            for (
                const [sellerId, sellerProductsList]
                of sellerProducts
            ) {

                const quantity =
                    sellerProductsList.reduce(
                        (total, product) =>
                            total + product.quantity,
                        0
                    );

                const cost =
                    sellerProductsList.reduce(
                        (total, product) =>
                            total +
                            (Number(product.price) *
                            product.quantity),
                        0
                    );


                // make seller order entity
                const order = await tx.order.create({
                    data: {
                        userId: data.userId,
                        quantity,
                        cost,
                        status:
                            data.status.toUpperCase() as Status,
                        parentOrderId: parentOrder.id,
                        sellerId
                    }
                });


                orders.push({
                    orderId: order.id,
                    sellerId
                });


                // save in ordered products
                for (const p of sellerProductsList) {

                    await tx.ordered_products.create({
                        data: {
                            productId: p.id,
                            orderId: order.id,
                            orderTimePrice: p.price,
                            quantity: p.quantity
                        }
                    });
                }
            }


            return {
                parentOrderId: parentOrder.id,
                orders
            };
        });


        return result;
    }
};
export const serviceRatingDb = {
    getProviderRating: async function (providerId: number) {
            const result = await prisma.serviceReview.aggregate({
                where: {
                    providerId,
                },
                _avg: {
                    rating: true,
                },
                _count: {
                    rating: true,
                },
            });

            console.log("providerId:", providerId);
            console.log("provider rating result:", result);

            return {
                rating: result._avg.rating ?? 0,
                reviewCount: result._count.rating,
            };
        },

    createReview: async function ({
        rating,
        comment,
        userId,
        serviceId,
        providerId,
        bookingId,
    }: {
        rating: number;
        comment?: string;
        userId: string;
        serviceId: number;
        providerId: number;
        bookingId: number;
    }) {
        return await prisma.serviceReview.create({
            data: {
                rating,
                comment,
                userId,
                serviceId,
                providerId,
                bookingId,
            },
        });
    },

    getServiceReviews: async function (serviceId: number) {
        return await prisma.serviceReview.findMany({
            where: {
                serviceId,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });
    },

    getServiceRating: async function (serviceId: number) {
        const result = await prisma.serviceReview.aggregate({
            where: {
                serviceId,
            },
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
        });

        return {
            rating: result._avg.rating ?? 0,
            reviewCount: result._count.rating,
        };
    },

    getUserServiceReview: async function ({
        userId,
        serviceId,
    }: {
        userId: string;
        serviceId: number;
    }) {
        return await prisma.serviceReview.findFirst({
            where: {
                userId,
                serviceId,
            },
        });
    },
};



export const categoryDb= {
    createCategory: async function (data: {
        name: string;
        imageUrl: string;
        description?: string | null;
    }) {

        const category = await prisma.category.create({
            data: {
                name: data.name.trim(),
                imageUrl: data.imageUrl,
                description: data.description ?? null,
            },
        });

        return category;
    },

    getCategoryById: async function (id: number) {

        const category = await prisma.category.findUnique({
            where: {
                id,
            },
            
        });

        return category;
    },

    getCategoryByName: async function (name: string) {

        const category = await prisma.category.findUnique({
            where: {
                name,
            },
        });

        return category;
    },

    getCategoryWithProducts: async function (id: number) {
        const category = await prisma.category.findUnique({
            where: {
                id,
            },
            include: {
                products: true,
            },
        });
        return category;
    },

    getCategoryWithProductCount: async function (id: number) {
        const category = await prisma.category.findUnique({
            where: {
                id,
            },
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });
        return category;
    },

    getCategories: async function (
        sortBy?: string,
        order?: string
    ) {
        const categories = await prisma.category.findMany({
            orderBy: {
                [sortBy || "id"]:
                    (order as "asc" | "desc") || "asc",
            },
        });
        return categories;
    },

    getCategoriesWithProducts: async function (
        sortBy?: string,
        order?: string
    ) {

        const categories = await prisma.category.findMany({
            include: {
                products: true,
            },

            orderBy: {
                [sortBy || "id"]:
                    (order as "asc" | "desc") || "asc",
            },
        });

        return categories;
    },

    getCategoriesWithProductCounts: async function (
        sortBy?: string,
        order?: string
    ) {

        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },

            orderBy: {
                [sortBy || "id"]:
                    (order as "asc" | "desc") || "asc",
            },
        });

        return categories;
    },

    categoryExists: async function (id: number) {

        const category = await prisma.category.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
            },
        });

        return !!category;
    },

    categoryNameExists: async function (name: string) {

        const category = await prisma.category.findUnique({
            where: {
                name,
            },
            select: {
                id: true,
            },
        });

        return !!category;
    },

    updateCategory: async function (
        id: number,
        data: {
            name?: string;
            imageUrl?: string;
            description?: string | null;
        }
    ) {

        const category = await prisma.category.update({
            where: {
                id,
            },

            data: {
                ...(data.name !== undefined && {
                    name: data.name,
                }),

                ...(data.imageUrl !== undefined && {
                    imageUrl: data.imageUrl,
                }),

                ...(data.description !== undefined && {
                    description: data.description,
                }),
            },
        });

        return category;
    },

    updateCategoryName: async function (
        id: number,
        name: string
    ) {

        const category = await prisma.category.update({
            where: {
                id,
            },

            data: {
                name,
            },
        });

        return category;
    },

    updateCategoryImage: async function (
        id: number,
        imageUrl: string
    ) {

        const category = await prisma.category.update({
            where: {
                id,
            },

            data: {
                imageUrl,
            },
        });

        return category;
    },

    updateCategoryDescription: async function (
        id: number,
        description: string | null
    ) {

        const category = await prisma.category.update({
            where: {
                id,
            },

            data: {
                description,
            },
        });

        return category;
    },

    deleteCategory: async function (id: number) {

        const category = await prisma.category.delete({
            where: {
                id,
            },
        });

        return category;
    },

    deleteEmptyCategory: async function (id: number) {

        const productCount = await prisma.product.count({
            where: {
                categoryId: id,
            },
        });

        if (productCount > 0) {
            return {
                deleted: false,
                reason: "CATEGORY_HAS_PRODUCTS",
            };
        }

        await prisma.category.delete({
            where: {
                id,
            },
        });

        return {
            deleted: true,
        };
    },
    countCategories: async function () {

        const count = await prisma.category.count();

        return count;
    },
 
    countCategoryProducts: async function (id: number) {

        const count = await prisma.product.count({
            where: {
                categoryId: id,
            },
        });

        return count;
    },

    searchCategories: async function (
        search: string
    ) {

        const categories = await prisma.category.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        description: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            },

            orderBy: {
                name: "asc",
            },
        });

        return categories;
    },

    getCategoriesPaginated: async function (
        page: number = 1,
        limit: number = 20,
        sortBy: string = "id",
        order: string = "asc"
    ) {

        const skip = (page - 1) * limit;

        const [categories, total] =
            await prisma.$transaction([

                prisma.category.findMany({
                    skip,
                    take: limit,

                    orderBy: {
                        [sortBy]:
                            (order as "asc" | "desc") ||
                            "asc",
                    },
                }),

                prisma.category.count(),
            ]);

        return {
            categories,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    },

    getCategoryStats: async function (id: number) {

        const category = await prisma.category.findUnique({
            where: {
                id,
            },

            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });

        if (!category) {
            return null;
        }

        return {
            id: category.id,
            name: category.name,
            imageUrl: category.imageUrl,
            description: category.description,
            productCount: category._count.products,
        };
    },

    getCategoryByNameWithProducts: async function (
        name: string
    ) {

        const category = await prisma.category.findUnique({
            where: {
                name,
            },

            include: {
                products: true,
            },
        });

        return category;
    },

    getCategoryByIdWithProductCount: async function (
        id: number
    ) {

        const category = await prisma.category.findUnique({
            where: {
                id,
            },

            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });

        return category;
    },
}

