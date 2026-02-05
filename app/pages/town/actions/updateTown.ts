"use server"
import prisma from '@/lib/prisma';

export async function updateTown(id: string, data: { name: string }) {
    try {
        const town = await prisma.town.update({
            where: { id },
            data: {
                name: data.name,
            }
        })
        return {
            success: true,
            data: town
        }
    } catch (error) {
        return {
            success: false,
            error: "Failed to update Town"
        }
    }
}