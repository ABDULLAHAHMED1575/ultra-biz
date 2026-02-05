"use server"
import prisma from '@/lib/prisma';

export async function getTownsCount() {
    try {
        const count = await prisma.town.count()
        return { success: true, data: count }
    } catch (error) {
        console.error('Error counting towns:', error)
        return { success: false, error: 'Failed to count towns' }
    }
}