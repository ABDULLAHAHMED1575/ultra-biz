"use client"

import { use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTownContext } from "@/app/pages/town/hooks/TownContext"
import TownForm from "@/app/pages/town/components/TownForm"
import Table, { type Column } from "@/app/components/Table"
import Pagination from "@/app/components/Pagination"
import Button from "@/app/components/Button"

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

type TownTableRow = {
    id: string
    name: string
    status: "ACTIVE" | "INACTIVE"
    createdAt: string
}

interface TownClientProps {
    townsPromise: Promise<Town[]>
    countPromise: Promise<number>
    searchParams: {
        page?: string
        filter?: string
        showForm?: string
        editId?: string
        editName?: string
    }
}

export default function TownContent({ townsPromise, countPromise, searchParams }: TownClientProps) {
    const router = useRouter()
    const { addTown, editTown, removeTown } = useTownContext()

    const towns = use(townsPromise)
    const townsCount = use(countPromise)

    const currentPage = parseInt(searchParams.page || "1", 10)
    const filterText = searchParams.filter || ""
    const showForm = searchParams.showForm === "true"
    const editingTown = searchParams.editId && searchParams.editName
        ? { id: searchParams.editId, name: searchParams.editName }
        : null

    const itemsPerPage = 10

    const filteredTowns = towns.filter((town) =>
        town.name.toLowerCase().includes(filterText.toLowerCase())
    )

    const totalPages = Math.ceil(filteredTowns.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedTowns = filteredTowns.slice(
        startIndex,
        startIndex + itemsPerPage
    )
    const totalItems = townsCount

    const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
    const to = Math.min(currentPage * itemsPerPage, totalItems)

    const createQueryString = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams()

        if (searchParams.page && !updates.page) params.set("page", searchParams.page)
        if (searchParams.filter && !updates.filter) params.set("filter", searchParams.filter)
        if (searchParams.showForm && !updates.showForm) params.set("showForm", searchParams.showForm)
        if (searchParams.editId && !updates.editId) params.set("editId", searchParams.editId)
        if (searchParams.editName && !updates.editName) params.set("editName", searchParams.editName)

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        })

        return params.toString()
    }

    const handleSave = async (name: string) => {
        let result

        if (editingTown) {
            result = await editTown(editingTown.id, name)
        } else {
            result = await addTown(name)
        }

        if (result.success) {
            router.push(`?${createQueryString({ showForm: null, editId: null, editName: null })}`)
            router.refresh()
        }
    }

    const handleCancel = () => {
        router.push(`?${createQueryString({ showForm: null, editId: null, editName: null })}`)
    }

    const handleEdit = (town: TownTableRow) => {
        router.push(`?${createQueryString({
            showForm: "true",
            editId: town.id,
            editName: town.name
        })}`)
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this town?")) {
            const result = await removeTown(id)
            if (result.success) {
                router.refresh()
            }
        }
    }

    const handleFilterChange = (value: string) => {
        router.push(`?${createQueryString({ filter: value || null, page: "1" })}`)
    }

    const handlePageChange = (page: number) => {
        router.push(`?${createQueryString({ page: page.toString() })}`)
    }

    const columns: Column<TownTableRow>[] = [
        { key: "name", label: "Name" },
        {
            key: "status",
            label: "Status",
            render: (value) => (
                <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                        value === "ACTIVE"
                            ? "text-green-700"
                            : "text-red-700"
                    }`}
                >
                    {value}
                </span>
            ),
        },
        { key: "createdAt", label: "Created At" },
        {
            key: "id",
            label: "Actions",
            render: (_, row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ]

    const tableData: TownTableRow[] = paginatedTowns.map((town) => ({
        id: town.id,
        name: town.name,
        status: town.status,
        createdAt: new Date(town.createdAt).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
    }))

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-6">Towns</h1>

                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        placeholder="Filter Towns..."
                        value={filterText}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="px-4 py-2 border rounded-md w-96 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />

                    {!showForm && (
                        <Link href={`?${createQueryString({ showForm: "true", editId: null, editName: null })}`}>
                            <Button className="bg-black text-white">
                                + Add Town
                            </Button>
                        </Link>
                    )}
                </div>

                {showForm && (
                    <TownForm
                        onSave={handleSave}
                        onCancel={handleCancel}
                        initialData={editingTown}
                    />
                )}
            </div>

            <div>
                <Table columns={columns} data={tableData}/>
                <p className="text-sm mt-4">
                    Showing{" "}
                    <span className="font-medium">{from}</span>–
                    <span className="font-medium">{to}</span> of{" "}
                    <span className="font-medium">{totalItems}</span>
                </p>
                <div className="px-4 pb-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    )
}