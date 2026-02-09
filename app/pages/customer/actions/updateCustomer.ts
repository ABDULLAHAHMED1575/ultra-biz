"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

interface Data {
    name: string
    email: string
    townId: string
    sectorId: string
    address: string
    phone_number: string
    vendor: boolean
}

export async function updateCustomer(id: string, info: Data) {
    try {
        const customer = await prisma.customer.update({
            where: { id },
            data: {
                name: info.name,
                email: info.email,
                townId: info.townId,
                sectorId: info.sectorId,
                address: info.address,
                phone: info.phone_number,
                vendor: info.vendor
            },
            include: {
                town: true,
                sector: true
            }
        })
        revalidatePath('/pages/customer')
        return { success: true, data: customer }
    } catch (err) {
        return { success: false, error: "Failed to update Customer" }
    }
}