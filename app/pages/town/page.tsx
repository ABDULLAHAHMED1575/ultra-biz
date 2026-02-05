"use client"

import { useState } from "react"
import { useTownContext } from "@/app/pages/town/hooks/TownContext"
import TownForm from "@/app/pages/town/components/TownForm"
import Table, { type Column } from "@/app/components/Table"
import Pagination from "@/app/components/Pagination"
import Button from "@/app/components/Button"

type TownTableRow = {
    id: string
    name: string
    status: "ACTIVE" | "INACTIVE"
    createdAt: string
}

export default function TownPage() {
    const { towns, loading, addTown, editTown, removeTown, townsCount } = useTownContext()
    const [showForm, setShowForm] = useState(false)
    const [editingTown, setEditingTown] = useState<{ id: string; name: string } | null>(null)
    const [filterText, setFilterText] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

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

    const handleSave = async (name: string) => {
        setIsSubmitting(true)
        let result

        if (editingTown) {
            result = await editTown(editingTown.id, name)
        } else {
            result = await addTown(name)
        }

        setIsSubmitting(false)

        if (result.success) {
            setShowForm(false)
            setEditingTown(null)
        }
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditingTown(null)
    }

    const handleEdit = (town: TownTableRow) => {
        setEditingTown({ id: town.id, name: town.name })
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this town?")) {
            await removeTown(id)
        }
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
                        onChange={(e) => setFilterText(e.target.value)}
                        className="px-4 py-2 border rounded-md w-96 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />

                    {!showForm && (
                        <Button
                            onClick={() => {
                                setEditingTown(null)
                                setShowForm(true)
                            }}
                            className="bg-black text-white"
                        >
                            + Add Town
                        </Button>
                    )}
                </div>

                {showForm && (
                    <TownForm
                        onSave={handleSave}
                        onCancel={handleCancel}
                        isLoading={isSubmitting}
                        initialData={editingTown}
                    />
                )}
            </div>

            <div className="">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        Loading...
                    </div>
                ) : (
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
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}