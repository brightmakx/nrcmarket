
import { prisma } from "@/lib/prisma";
import { agentsDb } from "../database/data";
import { agentEntityType } from "../types/agentTypes";
import { AgentOrder } from "../types/orderItemTypes";
import { CustomError } from "../errors/customErrors";


type Delivery = {
    id: number;
    customer: string;
    phone: string;
    location: string;
    items: number;
    total: number;
    deliveredAt: string;
    deliveredTime: string;
};

export class Agent{
    name:string;
    phone:string;
    email:string;
    location:string;
    userId:string;
    agent:Promise<any>;

    constructor(userId:string,data:any){
        this.name=data?.name
        this.phone=data?.phone
        this.email=data?.email
        this.location=data?.location
        this.userId=userId
        this.agent=prisma.agent.findUnique({
            where:{
                userId
            }
        })
    }

    async getAgentId(){
        const {id}=await this.agent
        return id;
    }

    async saveAgent(){
        const agent=await this.agent
        if(agent){
            throw new CustomError("already registered")
        }
        const data:agentEntityType={name:this.name,email:this.email,phone:this.phone}
        const d=await agentsDb.createAgent(this.userId,data)
        await prisma.user.update({
            where:{
                id:this.userId
            },
            data:{
                role:"AGENT"
            }
        })
        return {
            success:true as const,
            ...d
        }
    }

    toAgentOderResponse(order:any){
         let data:AgentOrder={id: 0,
                        customer: "",
                        phone: "",
                        location: "",
                        items: 0,
                        total: 0,
                        status: "PENDING",
                        updatedAt:""
                    }
        data.id=order.id,
        data.customer=order.user.name,
        data.location=order.user.location||""
        data.items=order.quantity,
        data.total=Number(order.cost)
        data.status=order.status
        data.createdAt=order.createdAt?.toISOString()||""
        data.updatedAt=order.updatedAt?.toISOString()||""

        return data;

    }

    async getAgentOrders():Promise<AgentOrder[]>{
        const res=await agentsDb.getAgentByUserId(this.userId,true)
        let data:AgentOrder={id: 0,
                        customer: "",
                        phone: "",
                        location: "",
                        items: 0,
                        total: 0,
                        status: "PENDING"
                    }
        let result:AgentOrder[]=[]
        if(res?.orders){
            for(const p of res.orders){
            const data=this.toAgentOderResponse(p)
            result.push(data)
            }
           
        }
        return result
    }

    async getAgent(){
        const data=await agentsDb.findAgent(this.userId)
        return data
    }
    
    async getOrders({includeDelivered=true},limit?:number,page?:number){
        const agent=await this.getAgent()
        let data:any[]=[]

        let skip;
        if(page&&limit&&page>0&&limit>0){
            skip=(page-1)*limit
        }

        if(includeDelivered){
            data=await prisma.order.findMany({
                where:{
                    OR:[
                        {status:"PENDING"},
                        {status:"DELIVERED"}
                    ],
                    sellerId:agent?.userId
                },
                include:{
                    user:true
                },
                orderBy:{
                    createdAt:"desc"
                },
                take:limit?limit:100,
                skip:skip?skip:0
            })
        }else{
            data=await prisma.order.findMany({
                where:{
                    OR:[
                        {status:"PENDING"},
                        //{status:"PROCESSING"}
                    ]
                },
                include:{
                    user:true
                },
                orderBy:{
                    createdAt:"desc"
                },
                take:limit?limit:100,
                skip:skip?skip:0
        })
        }
        let res:AgentOrder={id: 0,
                        customer: "",
                        phone: "",
                        location: "",
                        items: 0,
                        total: 0,
                        status: "PENDING"
                }
        let result:AgentOrder[]=[]
        for(const o of data){
            const d=this.toAgentOderResponse(o)
            result.push(d)
        }
        return result;
    }

    /*async getDeliveredOrders(){
        return await prisma.order.findMany({
            where:{
                status:"DELIVERED"
            },
            include:{
                user:true
            }
        })
    }*/

    async getDeliveredOrders(){
        const agentId=await this.getAgentId()
        //console.log("agent id: ",agentId)
        const data=await prisma.order.findMany({
            where:{
                agentId
            },
            include:{
                user:true
            }
        })
        //console.log("fount delivered by this agent: ",JSON.stringify(data))
    }
   


    toAgentDeliver(data: any): Delivery[] {

        return data.orders.map((order: any) => {

            const deliveredDate = new Date(order.updatedAt);

            return {
                id: order.id,

                customer: order.user.name,

                phone: order.user.phone ?? "",

                location: order.user.location ?? "",

                items: order.quantity,

                total: Number(order.cost),

                deliveredAt: deliveredDate.toLocaleDateString(),

                deliveredTime: deliveredDate.toLocaleTimeString()
            };
        });
    }

    async getAgentHistory(): Promise<Delivery[]> {
        const agentId = await this.getAgentId();
        const result = await prisma.agent.findUnique({
            where: {
                id: agentId
            },
            include: {
                orders: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!result) {
            return [];
        }

        return this.toAgentDeliver(result);
    }
}