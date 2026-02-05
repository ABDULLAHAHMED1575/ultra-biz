"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getCustomer } from "@/app/pages/customer/actions/getCustomer"
import { getCustomerCount } from "@/app/pages/customer/actions/getCustomerCount"
import { createCustomer } from "@/app/pages/customer/actions/createCustomer"
import { updateCustomer } from "@/app/pages/customer/actions/updateCustomer"
import { deleteCustomer } from "@/app/pages/customer/actions/deleteCustomer"
import { getSector } from "@/app/pages/sector/actions/getSector"

type Town = {
    id: string
    name: string
}

type Sector = {
    id: string
    name: string
    townId: string
}

type Customer = {
    id: string
    name: string
    email: string
    phone: string
    address: string
    townId: string
    sectorId: string
    vendor: boolean
    createdAt: Date
    town?: Town
    sector?: Sector
}

type CustomerContextType = {
    customers: Customer[]
    loading: boolean
    customersCount: number
    towns: Town[]
    sectors: Sector[]
    addCustomer: (data: {
        name: string
        email: string
        townId: string
        sectorId: string
        address: string
        phone_number: string
        vendor: boolean
    }) => Promise<{ success: boolean; error?: string }>
    editCustomer: (id: string, data: {
        name: string
        email: string
        townId: string
        sectorId: string
        address: string
        phone_number: string
        vendor: boolean
    }) => Promise<{ success: boolean; error?: string }>
    removeCustomer: (id: string) => Promise<{ success: boolean; error?: string }>
    refreshCustomers: () => Promise<void>
    searchCustomers: (searchTerm: string) => Promise<void>
    loadSectorsByTown: (townId: string) => Promise<Sector[]>
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function CustomerProvider({
                                     children,
                                     initialTowns = []
                                 }: {
    children: ReactNode
    initialTowns?: Town[]
}) {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [customersCount, setCustomersCount] = useState(0)
    const [sectors, setSectors] = useState<Sector[]>([])

    const fetchCustomers = async (search?: string) => {
        setLoading(true)
        const result = await getCustomer(search)
        if (result.success && result.data) {
            setCustomers(result.data)
        }
        setLoading(false)
    }

    const fetchCustomersCount = async () => {
        const result = await getCustomerCount()
        if (result.success && result.data !== undefined) {
            setCustomersCount(result.data)
        }
    }

    const fetchSectors = async () => {
        const result = await getSector()
        if (result.success && result.data) {
            setSectors(result.data)
        }
    }

    const loadSectorsByTown = async (townId: string) => {
        const result = await getSector()
        if (result.success && result.data) {
            const filteredSectors = result.data.filter(s => s.townId === townId)
            return filteredSectors
        }
        return []
    }

    const addCustomer = async (data: {
        name: string
        email: string
        townId: string
        sectorId: string
        address: string
        phone_number: string
        vendor: boolean
    }) => {
        const result = await createCustomer(data)
        if (result.success) {
            await fetchCustomers()
            await fetchCustomersCount()
        }
        return result
    }

    const editCustomer = async (id: string, data: {
        name: string
        email: string
        townId: string
        sectorId: string
        address: string
        phone_number: string
        vendor: boolean
    }) => {
        const result = await updateCustomer(id, data)
        if (result.success) {
            await fetchCustomers()
            await fetchCustomersCount()
        }
        return result
    }

    const removeCustomer = async (id: string) => {
        const result = await deleteCustomer(id)
        if (result.success) {
            await fetchCustomers()
            await fetchCustomersCount()
        }
        return result
    }

    const refreshCustomers = async () => {
        await fetchCustomers()
        await fetchCustomersCount()
    }

    const searchCustomers = async (searchTerm: string) => {
        await fetchCustomers(searchTerm)
    }

    useEffect(() => {
        fetchCustomers()
        fetchCustomersCount()
        fetchSectors()
    }, [])

    return (
        <CustomerContext.Provider
            value={{
                customers,
                loading,
                customersCount,
                towns: initialTowns,
                sectors,
                addCustomer,
                editCustomer,
                removeCustomer,
                refreshCustomers,
                searchCustomers,
                loadSectorsByTown,
            }}
        >
            {children}
        </CustomerContext.Provider>
    )
}

export function useCustomerContext() {
    const context = useContext(CustomerContext)
    if (context === undefined) {
        throw new Error("useCustomerContext must be used within a CustomerProvider")
    }
    return context
}