"use client"

import { useRouter } from "next/navigation"
import CustomerForm from "@/app/pages/customer/components/CustomerForm"
import { createCustomer } from "@/app/pages/customer/actions/createCustomer"
import { updateCustomer } from "@/app/pages/customer/actions/updateCustomer"

type Town = {
    id: string
    name: string
}

type Sector = {
    id: string
    name: string
    townId: string
}

type Props = {
    towns: Town[]
    sectors: Sector[]
    initialData?: {
        id: string
        name: string
        email: string
        townId: string
        sectorId: string
        address: string
        phone_number: string
        vendor: boolean
    } | null
    currentPage: number
    searchFilter: string
}

export default function CustomerFormWrapper({
    towns,
    sectors,
    initialData,
    currentPage,
    searchFilter,
}: Props) {
    const router = useRouter()

    const handleSave = async (data: {
        name: string
        email: string
        townId: string
        sectorId: string
        address: string
        phone_number: string
        vendor: boolean
    }) => {
        let result

        if (initialData) {
            result = await updateCustomer(initialData.id, data)
        } else {
            result = await createCustomer(data)
        }

        if (result.success) {
            const params = new URLSearchParams()
            params.set('page', currentPage.toString())

            if (searchFilter) {
                params.set('search', searchFilter)
            }

            router.replace(`/pages/customer?${params.toString()}`)
            router.refresh()
        } else {
            alert(result.error || "An error occurred while saving")
        }
    }

    const handleCancel = () => {
        const params = new URLSearchParams({
            page: currentPage.toString(),
            ...(searchFilter && { search: searchFilter }),
        })
        router.push(`/pages/customer?${params}`)
    }

    return (
        <CustomerForm
            onSave={handleSave}
            onCancel={handleCancel}
            towns={towns}
            sectors={sectors}
            initialData={initialData}
        />
    )
}