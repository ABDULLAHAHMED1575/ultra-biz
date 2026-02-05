"use server"
import prisma from "@/lib/prisma"

export async function deleteCustomer(id: string) {
    try {
        await prisma.customer.delete({
            where: { id }
        })
        return {
            success: true,
            message: "Customer deleted successfully"
        }
    } catch (error) {
        return {
            success: false,
            error: "Failed to delete Customer"
        }
    }
}