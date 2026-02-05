"use server"
import prisma from '@/lib/prisma'

export async function getCustomer(search?:string){
    try{
        if(search){
            const detail = await prisma.customer.findMany({
                where: search
                    ? {
                        OR: [
                            { name: { contains: search, mode: "insensitive" } },
                            { email: { contains: search, mode: "insensitive" } },
                            { phone: { contains: search, mode: "insensitive" } },
                            { address: { contains: search, mode: "insensitive" } },
                            {
                                town: {
                                    name: { contains: search, mode: "insensitive" },
                                },
                            },
                            {
                                sector: {
                                    name: { contains: search, mode: "insensitive" },
                                },
                            },
                        ],
                    }
                    : undefined,

                include: {
                    town: true,
                    sector: true,
                },
                orderBy: { createdAt: "desc" },
            })
            if(!detail){
                return { success: false, error: 'No customer found' }
            }
            return { success: true, data: detail }
        }
        const customerDetail = await prisma.customer.findMany({
            include:{
                town:true,
                sector:true,
            },
            orderBy:{createdAt:"desc"}
        })
        return {success:true, data:customerDetail};
    }catch(err){
        return {success:false, error:"Failed to get Customer"};
    }
}