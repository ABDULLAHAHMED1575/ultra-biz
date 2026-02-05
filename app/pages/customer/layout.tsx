import { CustomerProvider } from "@/app/pages/customer/hooks/CustomerContext"
import { getTown } from "@/app/pages/town/actions/getTown"
import {getSector} from '@/app/pages/sector/actions/getSector'

export default async function SectorLayout({
   children,
}: {
    children: React.ReactNode
}) {
    const townsResult = await getTown()
    const sectorsResult = await getSector()

    const towns = townsResult.success && townsResult.data
        ? (Array.isArray(townsResult.data)
            ? townsResult.data.map((town) => ({
                id: town.id,
                name: town.name
            }))
            : [{ id: townsResult.data.id, name: townsResult.data.name }])
        : []

    const sectors = sectorsResult.success && sectorsResult.data
        ? sectorsResult.data.map((sector) => ({
            id: sector.id,
            name: sector.name,
            townId: sector.townId
        }))
        : []

    return (
        <CustomerProvider initialTowns={towns} initialSectors={sectors}>
            {children}
        </CustomerProvider>
    )
}