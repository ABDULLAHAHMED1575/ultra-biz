"use server"
import prisma from '@/lib/prisma'

export async function getCustomer(search?: string, page: number = 1, limit: number = 10) {
    try {
        const skip = (page - 1) * limit
        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" as const } },
                    { email: { contains: search, mode: "insensitive" as const } },
                    { phone: { contains: search, mode: "insensitive" as const } },
                    { address: { contains: search, mode: "insensitive" as const } },
                    {
                        town: {
                            name: { contains: search, mode: "insensitive" as const },
                        },
                    },
                    {
                        sector: {
                            name: { contains: search, mode: "insensitive" as const },
                        },
                    },
                ],
            }
            : undefined

        const [customers, totalCount] = await Promise.all([
            prisma.customer.findMany({
                where,
                include: {
                    town: true,
                    sector: true,
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.customer.count({ where })
        ])

        return {
            success: true,
            data: customers,
            count: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit)
        }
    } catch (err) {
        return {
            success: false,
            error: "Failed to get Customer",
            data: [],
            count: 0,
            page: 1,
            limit: 10,
            totalPages: 0
        }
    }
}