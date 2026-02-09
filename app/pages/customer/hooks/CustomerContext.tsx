"use client"
import { createContext, useContext, ReactNode } from "react"

type Town = {
    id: string
    name: string
    status?: string
    createdAt?: Date
    customers?: any[]
    sectors?: any[]
}

type Sector = {
    id: string
    name: string
    townId: string
    status?: string
    createdAt?: Date
    customers?: any[]
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
    totalPages: number
    itemsPerPage: number
    towns: Town[]
    sectors: Sector[]
    currentPage: number
    searchFilter: string
    showForm: boolean
    editId?: string
}

const CustomerContextData = createContext<CustomerContextType | undefined>(undefined)

export function CustomerContextProvider({
    children,
    value,
}: {
    children: ReactNode
    value: CustomerContextType
}) {
    return (
        <CustomerContextData.Provider value={value}>
            {children}
        </CustomerContextData.Provider>
    )
}

export function useCustomerContext() {
    const context = useContext(CustomerContextData)
    if (context === undefined) {
        throw new Error("useCustomerContext must be used within a CustomerContext")
    }
    return context
}