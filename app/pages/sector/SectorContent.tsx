"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useSectorContext } from "@/app/pages/sector/hooks/SectorContext"
import SectorForm from "@/app/pages/sector/components/SectorForm"
import Table, { type Column } from "@/app/components/Table"
import Pagination from "@/app/components/Pagination"
import Button from "@/app/components/Button"
import { deleteSector } from "@/app/pages/sector/actions/deleteSector"

type SectorTableRow = {
    id: string
    name: string
    belongsTo: string
    townId: string
    status: "ACTIVE" | "INACTIVE"
    createdAt: string
}

type Sector = {
    id: string
    name: string
    townId: string
    createdAt: Date
    town?: { id: string; name: string }
}

export default function SectorContent({
    sectors,
    sectorsCount,
    currentPage,
    filterText,
    showForm,
    editId,
}: {
    sectors: Sector[]
    sectorsCount: number
    currentPage: number
    filterText: string
    showForm: boolean
    editId: string | null
}) {
    const { towns } = useSectorContext()
    const router = useRouter()
    const searchParams = useSearchParams()

    const itemsPerPage = 10

    const filteredSectors = sectors.filter((sector) =>
        sector.name.toLowerCase().includes(filterText.toLowerCase()) ||
        sector.town?.name.toLowerCase().includes(filterText.toLowerCase())
    )

    const totalPages = Math.ceil(filteredSectors.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedSectors = filteredSectors.slice(
        startIndex,
        startIndex + itemsPerPage
    )

    const from = sectorsCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
    const to = Math.min(currentPage * itemsPerPage, sectorsCount)

    const editingSector = editId
        ? sectors.find((s) => s.id === editId)
        : null

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this sector?")) {
            await deleteSector(id)
            router.refresh()
        }
    }

    const createQueryString = (params: Record<string, string>) => {
        const urlParams = new URLSearchParams(searchParams.toString())
        Object.entries(params).forEach(([key, value]) => {
            urlParams.set(key, value)
        })
        return urlParams.toString()
    }

    const removeQueryString = (...names: string[]) => {
        const params = new URLSearchParams(searchParams.toString())
        names.forEach(name => params.delete(name))
        return params.toString()
    }

    const columns: Column<SectorTableRow>[] = [
        { key: "name", label: "Name" },
        { key: "belongsTo", label: "Belongs To" },
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
                    <Link
                        href={`?${createQueryString({ showForm: "true", editId: row.id })}`}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                        Edit
                    </Link>
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

    const tableData: SectorTableRow[] = paginatedSectors.map((sector) => ({
        id: sector.id,
        name: sector.name,
        belongsTo: sector.town?.name || "N/A",
        townId: sector.townId,
        status: "ACTIVE" as const,
        createdAt: new Date(sector.createdAt).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
    }))

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-6">Sectors</h1>

                <div className="flex justify-between items-center mb-6">
                    <form className="w-96">
                        <input
                            type="text"
                            name="filter"
                            placeholder="Filter Sectors..."
                            defaultValue={filterText}
                            onChange={(e) => {
                                const params = new URLSearchParams(searchParams.toString())
                                if (e.target.value) {
                                    params.set("filter", e.target.value)
                                } else {
                                    params.delete("filter")
                                }
                                params.delete("page")
                                router.push(`?${params.toString()}`)
                            }}
                            className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                    </form>

                    {!showForm && (
                        <Link href={`?${createQueryString({ showForm: "true" })}`}>
                            <Button className="bg-black text-white">
                                + Add Sector
                            </Button>
                        </Link>
                    )}
                </div>

                {showForm && (
                    <SectorForm
                        onCancel={() => router.push(`?${removeQueryString("showForm", "editId")}`)}
                        towns={towns}
                        initialData={
                            editingSector
                                ? {
                                    id: editingSector.id,
                                    name: editingSector.name,
                                    townId: editingSector.townId,
                                }
                                : null
                        }
                    />
                )}
            </div>

            <div>
                <Table columns={columns} data={tableData} />
                <p className="text-sm mt-4">
                    Showing{" "}
                    <span className="font-medium">{from}</span>–
                    <span className="font-medium">{to}</span> of{" "}
                    <span className="font-medium">{sectorsCount}</span>
                </p>
                <div className="px-4 pb-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                            router.push(`?${createQueryString({ page: page.toString() })}`)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}