import { SectorProvider } from "@/app/pages/sector/hooks/SectorContext"
import { getTown } from "@/app/pages/town/actions/getTown"
import { getSector } from "@/app/pages/sector/actions/getSector"
import { getSectorsCount } from "@/app/pages/sector/actions/getSectorCount"

export default async function SectorLayout({
   children,
}: {
    children: React.ReactNode
}) {
    const townsResult = await getTown()
    const sectorsResult = await getSector()
    const countResult = await getSectorsCount()

    const towns = townsResult.success && townsResult.data
        ? (Array.isArray(townsResult.data)
            ? townsResult.data.map((town) => ({
                id: town.id,
                name: town.name
            }))
            : [{ id: townsResult.data.id, name: townsResult.data.name }])
        : []

    const sectors = sectorsResult.success && sectorsResult.data ? sectorsResult.data : []
    const sectorsCount = countResult.success && countResult.data !== undefined ? countResult.data : 0
    return (
        <SectorProvider
            sectors={sectors}
            sectorsCount={sectorsCount}
            towns={towns}
        >
            {children}
        </SectorProvider>
    )
}