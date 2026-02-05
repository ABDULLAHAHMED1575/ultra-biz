"use server"
import prisma from '@/lib/prisma'

export async function getSectorsCount() {
    try {
        const count = await prisma.sector.count()
        return { success: true, data: count }
    } catch (error) {
        return { success: false, error: 'Failed to count sectors' }
    }
}