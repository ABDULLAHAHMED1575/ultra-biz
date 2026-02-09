"use client"

import { createContext, useContext, ReactNode } from "react"

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
    sectorsCount: number
    towns: Town[]
}

const SectorContext = createContext<SectorContextType | undefined>(undefined)

export function SectorProvider({
   children,
   sectors,
   sectorsCount,
   towns
}: {
    children: ReactNode
    sectors: Sector[]
    sectorsCount: number
    towns: Town[]
}) {
    return (
        <SectorContext.Provider
            value={{
                sectors,
                sectorsCount,
                towns,
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