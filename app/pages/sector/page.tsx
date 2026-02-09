import { getSector } from "@/app/pages/sector/actions/getSector"
import { getSectorsCount } from "@/app/pages/sector/actions/getSectorCount"
import SectorContent from "@/app/pages/sector/SectorContent"

type SearchParams = {
    page?: string
    filter?: string
    showForm?: string
    editId?: string
}

export default async function SectorPage({
    searchParams,
}: {
    searchParams: SearchParams
}) {
    const params = await searchParams;
    const sectorsResult = await getSector()
    const countResult = await getSectorsCount()

    const sectors = sectorsResult.success && sectorsResult.data ? sectorsResult.data : []
    const sectorsCount = countResult.success && countResult.data !== undefined ? countResult.data : 0

    const page = parseInt(params.page || "1")
    const filter = params.filter || ""
    const showForm = params.showForm === "true"
    const editId = params.editId || null

    return (
        <SectorContent
            sectors={sectors}
            sectorsCount={sectorsCount}
            currentPage={page}
            filterText={filter}
            showForm={showForm}
            editId={editId}
        />
    )
}