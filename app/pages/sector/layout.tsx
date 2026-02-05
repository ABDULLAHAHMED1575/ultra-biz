import { SectorProvider } from "@/app/pages/sector/hooks/SectorContext"
import { getTown } from "@/app/pages/town/actions/getTown"

export default async function SectorLayout({
   children,
}: {
    children: React.ReactNode
}) {
    const townsResult = await getTown()

    const towns = townsResult.success && townsResult.data
        ? (Array.isArray(townsResult.data)
            ? townsResult.data.map((town) => ({
                id: town.id,
                name: town.name
            }))
            : [{ id: townsResult.data.id, name: townsResult.data.name }])
        : []

    return (
        <SectorProvider initialTowns={towns}>
            {children}
        </SectorProvider>
    )
}