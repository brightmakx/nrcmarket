
import { ordersDb, transactions } from "../database/data";
import { orderEntityType } from "../types/orderTypes";
import { createNotification } from "@/lib/notification";

type OrderItem = {
    name: string;
    quantity: number;
    price: number;
};

type Order = {
    id: string;
    customer: {
        name: string;
        phone: string;
        email: string;
        location: string;
    };
    items: OrderItem[];
    total: number;
    status: "PENDING" | "DELIVERED";
    assignedAt: string;
    notes: string;
};

export async function makeOrder(
    data: orderEntityType
) {
    try {
        const result =
            await transactions.orderTransaction(data);

        await createNotification({
            userId: data.userId,
            title: "Order placed",
            message:
                "Your order has been placed successfully.",
            type: "ORDER",
            entityType: "ORDER",
            entityId:
                result.parentOrderId.toString(),
        });

        for (const order of result.orders) {
            if (!order.sellerId) {
                continue;
            }

            await createNotification({
                userId: order.sellerId,
                title: "New order",
                message:
                    "You have received a new order.",
                type: "ORDER",
                entityType: "SELLER_ORDER",
                entityId:
                    order.orderId.toString(),
            });
        }

        return {
            message: "order placed successfully",
            result,
        };
    } catch (e: any) {
        return {
            error: e.message,
        };
    }
}



function toOrderItem(item:any):OrderItem{
    return {
        name:item.product.name,
        quantity:item.quantity,
        price:item.orderTimePrice
    }
}

export function toOrder(order:any):Order{
    return {
        id:order.id,
        customer:{
            name:order.user.name,
            phone:order.user.phone,
            email:order.user.email,
            location:order.user.location
        },
        items:order.orderedProducts.map(toOrderItem),
        total:order.cost,
        status:order.status,
        assignedAt:order.createdAt,
        notes:order.notes||""
    }
}


export async function getOrderById(orderId:number ){
    const order=await ordersDb.getOrder(orderId)
    if(!order)return null;
    return toOrder(order)

}
