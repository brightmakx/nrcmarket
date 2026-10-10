export type orderItemEntityType={
    orderId:number,
    productId:number,
    quantity:number,
    orderTimePrice:number
}

export type Status = "PENDING" | "DELIVERED";

export type AgentOrder = {
id: number;
customer: string;
phone: string;
location: string;
items: number;
total: number;
status: string;
createdAt?: string;
updatedAt?: string
};