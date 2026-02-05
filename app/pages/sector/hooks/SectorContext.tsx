"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getSector } from "@/app/pages/sector/actions/getSector"
import { getSectorsCount } from "@/app/pages/sector/actions/getSectorCount"
import { createSector } from "@/app/pages/sector/actions/createSector"
import { updateSector } from "@/app/pages/sector/actions/updateSector"
import { deleteSector } from "@/app/pages/sector/actions/deleteSector"

type Town = {
    id: string
    name: string
}

type Sector = {
    id: string
    name: string
    townId: string
    createdAt: Date
    town?: Town
}

type SectorContextType = {
    sectors: Sector[]
    loading: boolean
    sectorsCount: number
    towns: Town[]
    addSector: (name: string, townId: string) => Promise<{ success: boolean; error?: string }>
    editSector: (id: string, name: string, townId: string) => Promise<{ success: boolean; error?: string }>
    removeSector: (id: string) => Promise<{ success: boolean; error?: string }>
    refreshSectors: () => Promise<void>
}

const SectorContext = createContext<SectorContextType | undefined>(undefined)

export function SectorProvider({
                                   children,
                                   initialTowns = []
                               }: {
    children: ReactNode
    initialTowns?: Town[]
}) {
    const [sectors, setSectors] = useState<Sector[]>([])
    const [loading, setLoading] = useState(true)
    const [sectorsCount, setSectorsCount] = useState(0)

    const fetchSectors = async () => {
        setLoading(true)
        const result = await getSector()
        if (result.success && result.data) {
            setSectors(result.data)
        }
        setLoading(false)
    }

    const fetchSectorsCount = async () => {
        const result = await getSectorsCount()
        if (result.success && result.data !== undefined) {
            setSectorsCount(result.data)
        }
    }

    const addSector = async (name: string, townId: string) => {
        const result = await createSector({ name, townId })
        if (result.success) {
            await fetchSectors()
            await fetchSectorsCount()
        }
        return result
    }

    const editSector = async (id: string, name: string, townId: string) => {
        const result = await updateSector(id, { name, townId })
        if (result.success) {
            await fetchSectors()
            await fetchSectorsCount()
        }
        return result
    }

    const removeSector = async (id: string) => {
        const result = await deleteSector(id)
        if (result.success) {
            await fetchSectors()
            await fetchSectorsCount()
        }
        return result
    }

    const refreshSectors = async () => {
        await fetchSectors()
        await fetchSectorsCount()
    }

    useEffect(() => {
        fetchSectors()
        fetchSectorsCount()
    }, [])

    return (
        <SectorContext.Provider
            value={{
                sectors,
                loading,
                sectorsCount,
                towns: initialTowns,
                addSector,
                editSector,
                removeSector,
                refreshSectors,
            }}
        >
            {children}
        </SectorContext.Provider>
    )
}

export function useSectorContext() {
    const context = useContext(SectorContext)
    if (context === undefined) {
        throw new Error("useSectorContext must be used within a SectorProvider")
    }
    return context
}