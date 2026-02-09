import CustomerContent from "@/app/pages/customer/CustomerContent"
import { CustomerContextProvider } from "@/app/pages/customer/hooks/CustomerContext"
import { getCustomer } from "@/app/pages/customer/actions/getCustomer"
import { getSector } from "@/app/pages/sector/actions/getSector"
import { getTown } from "@/app/pages/town/actions/getTown"

type PageProps = {
    searchParams: Promise<{
        page?: string
        search?: string
        showForm?: string
        editId?: string
    }>
}

export default async function CustomerPage({ searchParams }: PageProps) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const filterText = params.search || ""
    const showForm = params.showForm === "true"
    const editId = params.editId
    const itemsPerPage = 10

    const [customersResult, sectorsResult, townsResult] = await Promise.all([
        getCustomer(filterText, currentPage, itemsPerPage),
        getSector(),
        getTown(),
    ])

    const customers = customersResult.success ? customersResult.data || [] : []
    const customersCount = customersResult.success ? customersResult.count || 0 : 0
    const totalPages = customersResult.success ? customersResult.totalPages || 0 : 0
    const sectors = sectorsResult.success ? sectorsResult.data || [] : []
    const towns = townsResult.success
        ? (Array.isArray(townsResult.data) ? townsResult.data : [])
        : []

    const contextValue = {
        customers,
        loading: false,
        customersCount,
        totalPages,
        itemsPerPage,
        towns,
        sectors,
        currentPage,
        searchFilter: filterText,
        showForm,
        editId,
    }

    return (
        <CustomerContextProvider value={contextValue}>
            <CustomerContent />
        </CustomerContextProvider>
    )
}