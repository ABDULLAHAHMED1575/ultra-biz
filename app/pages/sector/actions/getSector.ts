"use server"
import prisma from "@/lib/prisma"

export async function getSector(name?:string) {
    try{
        if(name){
            const sector = await prisma.sector.findMany({
                where: { name:name },
                include: {
                    town: true,
                    customers: true,
                },
            })
            if (!sector) {
                return { success: false, error: 'Sector not found' }
            }
            return { success: true, data: sector }
        }
        const sectors = await prisma.sector.findMany({
            include: {
                town: true,
                customers: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return { success: true, data: sectors }
    }catch(err){
        return { success: false, error: 'Failed to fetch sectors' }
    }
}