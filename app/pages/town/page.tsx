import TownContent from "@/app/pages/town/TownContent"
import { getTown } from "@/app/pages/town/actions/getTown"
import { getTownsCount } from "@/app/pages/town/actions/getTownCounts"

interface Sector {
    id: string
    name: string
    townId: string
    createdAt: Date
}

interface Customer {
    id: string
    name: string
    email: string
    phone: string
    address: string
    townId: string
    sectorId: string
    createdAt: Date
}

interface Town {
    id: string
    name: string
    status: 'ACTIVE' | 'INACTIVE'
    createdAt: Date
    sectors: Sector[]
    customers: Customer[]
}

interface PageProps {
    searchParams: {
        page?: string
        filter?: string
        showForm?: string
        editId?: string
        editName?: string
    }
}

async function getTownsData(): Promise<Town[]> {
    const result = await getTown()
    if (result.success && result.data) {
        return result.data as Town[]
    }
    return []
}

async function getTownsCountData(): Promise<number> {
    const result = await getTownsCount()
    if (result.success && result.data !== undefined) {
        return result.data
    }
    return 0
}

export default async function TownPage({ searchParams }: PageProps) {
    const townsPromise = getTownsData()
    const countPromise = getTownsCountData()
    const params = await searchParams
    return (
        <TownContent
            townsPromise={townsPromise}
            countPromise={countPromise}
            searchParams={params}
        />
    )
}