"use server"
import prisma from '@/lib/prisma';

export async function deleteTown(id: string) {
    try {
        await prisma.town.delete({
            where: { id }
        })
        return {
            success: true,
            message: "Town deleted successfully"
        }
    } catch (error) {
        return {
            success: false,
            error: "Failed to delete Town"
        }
    }
}