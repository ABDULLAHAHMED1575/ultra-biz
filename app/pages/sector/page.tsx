"use client"

import { useState } from "react"
import { useSectorContext } from "@/app/pages/sector/hooks/SectorContext"
import SectorForm from "@/app/pages/sector/components/SectorForm"
import Table, { type Column } from "@/app/components/Table"
import Pagination from "@/app/components/Pagination"
import Button from "@/app/components/Button"

type SectorTableRow = {
    id: string
    name: string
    belongsTo: string
    status: "ACTIVE" | "INACTIVE"
    createdAt: string
}

export default function SectorPage() {
    const { sectors, loading, addSector, sectorsCount, towns } = useSectorContext()
    const [showForm, setShowForm] = useState(false)
    const [filterText, setFilterText] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

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
    const totalItems = sectorsCount

    const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
    const to = Math.min(currentPage * itemsPerPage, totalItems)

    const handleSave = async (name: string, townId: string) => {
        setIsSubmitting(true)
        const result = await addSector(name, townId)
        setIsSubmitting(false)

        if (result.success) {
            setShowForm(false)
        }
    }

    const handleCancel = () => {
        setShowForm(false)
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
    ]

    const tableData: SectorTableRow[] = paginatedSectors.map((sector) => ({
        id: sector.id,
        name: sector.name,
        belongsTo: sector.town?.name || "N/A",
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
                    <input
                        type="text"
                        placeholder="Filter Sectors..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="px-4 py-2 border rounded-md w-96 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />

                    {!showForm && (
                        <Button
                            onClick={() => setShowForm(true)}
                            className="bg-transparent"
                        >
                            + Add Sector
                        </Button>
                    )}
                </div>

                {showForm && (
                    <SectorForm
                        onSave={handleSave}
                        onCancel={handleCancel}
                        isLoading={isSubmitting}
                        towns={towns}
                    />
                )}
            </div>

            <div>
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        Loading...
                    </div>
                ) : (
                    <div>
                        <Table columns={columns} data={tableData} />
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
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}