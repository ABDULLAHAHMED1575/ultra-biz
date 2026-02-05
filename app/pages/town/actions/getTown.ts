"use server"
import prisma from '@/lib/prisma';

export async function getTown(name?:string){
    try{
        if(name){
            const townName = await prisma.town.findUnique({
                where: {name:name},
                include: {
                    sectors: true,
                    customers: true,
                },
            })
            if(!townName){
                return {success: false, message: 'Town not found'}
            }
            return {success: true, message: 'Town not found', data: townName}
        }
        const townDetail = await prisma.town.findMany({
            include: {
                sectors: true,
                customers: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return {success: true, data: townDetail}
    }catch(error){
        return {success: false, message: 'Failed to fetch towns'};
    }
}