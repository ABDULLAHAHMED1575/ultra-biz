"use server"
import prisma from '@/lib/prisma';

export async function createTown(data:{name:string}) {
    try {
        const town = await prisma.town.create({
            data:{
                name:data.name,
            }
        })
        return {
            success: true,
            data: town
        }
    }catch (error) {
        return {
            success: false,
            error: "Failed to create Town"
        }
    }
}