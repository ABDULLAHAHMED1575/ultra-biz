"use server"
import prisma from "@/lib/prisma";

export async function updateSector(id: string, data: { name: string; townId: string }) {
    try {
        const sector = await prisma.sector.update({
            where: { id },
            data: {
                name: data.name,
                townId: data.townId,
            },
            include: {
                town: true,
            },
        })

        return { success: true, data: sector }
    } catch (error) {
        return { success: false, error: 'Failed to update sector' }
    }
}