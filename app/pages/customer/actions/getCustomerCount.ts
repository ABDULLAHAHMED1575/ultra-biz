"use server"
import prisma from "@/lib/prisma"

export async function getCustomerCount(){
    try{
        const count = await prisma.customer.count();
        return { success: true, data: count }
    }catch(err){
        return { success: false, error: 'Failed to count customers' }
    }
}