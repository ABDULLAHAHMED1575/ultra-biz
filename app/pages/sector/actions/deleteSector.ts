"use server"
import prisma from "@/lib/prisma";

export async function deleteSector(id: string) {
    try {
        await prisma.sector.delete({
            where: { id }
        })
        return {
            success: true,
            message: "Sector deleted successfully"
        }
    } catch (error) {
        return {
            success: false,
            error: "Failed to delete Sector"
        }
    }
}