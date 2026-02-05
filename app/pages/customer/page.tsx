"use client"

import { useState } from "react"
import { useCustomerContext } from "@/app/pages/customer/hooks/CustomerContext"
import CustomerForm from "@/app/pages/customer/components/CustomerForm"
import Table, { type Column } from "@/app/components/Table"
import Pagination from "@/app/components/Pagination"
import Button from "@/app/components/Button"

type CustomerTableRow = {
    id: string
    name: string
    email: string
    phone: string
    address: string
    town: string
    sector: string
    townId: string
    sectorId: string
    vendor: boolean
    createdAt: string
}

export default function CustomerPage() {
    const {
        customers,
        loading,
        addCustomer,
        editCustomer,
        removeCustomer,
        customersCount,
        towns,
        sectors,
        loadSectorsByTown
    } = useCustomerContext()

    const [showForm, setShowForm] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<{
        id: string
        name: string
        email: string
        townId: string
        sectorId: string
        address: string
        phone_number: string
        vendor: boolean
    } | null>(null)
    const [filterText, setFilterText] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [availableSectors, setAvailableSectors] = useState(sectors)

    const itemsPerPage = 10

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(filterText.toLowerCase()) ||
        customer.email.toLowerCase().includes(filterText.toLowerCase()) ||
        customer.phone.toLowerCase().includes(filterText.toLowerCase()) ||
        customer.town?.name.toLowerCase().includes(filterText.toLowerCase()) ||
        customer.sector?.name.toLowerCase().includes(filterText.toLowerCase())
    )

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedCustomers = filteredCustomers.slice(
        startIndex,
        startIndex + itemsPerPage
    )
    const totalItems = customersCount

    const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
    const to = Math.min(currentPage * itemsPerPage, totalItems)

    const handleSave = async (data: {
        name: string
        email: string
        townId: string
        sectorId: string
        address: string
        phone_number: string
        vendor: boolean
    }) => {
        setIsSubmitting(true)
        let result

        if (editingCustomer) {
            result = await editCustomer(editingCustomer.id, data)
        } else {
            result = await addCustomer(data)
        }

        setIsSubmitting(false)

        if (result.success) {
            setShowForm(false)
            setEditingCustomer(null)
        }
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditingCustomer(null)
    }

    const handleEdit = (customer: CustomerTableRow) => {
        setEditingCustomer({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            townId: customer.townId,
            sectorId: customer.sectorId,
            address: customer.address,
            phone_number: customer.phone,
            vendor: customer.vendor
        })
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this customer?")) {
            await removeCustomer(id)
        }
    }

    const handleTownChange = async (townId: string) => {
        const townSectors = await loadSectorsByTown(townId)
        setAvailableSectors(townSectors)
    }

    const columns: Column<CustomerTableRow>[] = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "town", label: "Town" },
        { key: "sector", label: "Sector" },
        { key: "address", label: "Address" },
        {
            key: "vendor",
            label: "Vendor",
            render: (value) => (
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    value ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                }`}>
                    {value ? "Yes" : "No"}
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

    const tableData: CustomerTableRow[] = paginatedCustomers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        town: customer.town?.name || "N/A",
        sector: customer.sector?.name || "N/A",
        townId: customer.townId,
        sectorId: customer.sectorId,
        vendor: customer.vendor,
        createdAt: new Date(customer.createdAt).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
    }))

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-6">Customers</h1>

                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        placeholder="Filter Customers..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="px-4 py-2 border rounded-md w-96 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />

                    {!showForm && (
                        <Button
                            onClick={() => {
                                setEditingCustomer(null)
                                setAvailableSectors(sectors)
                                setShowForm(true)
                            }}
                            className="bg-black text-white"
                        >
                            + Add Customer
                        </Button>
                    )}
                </div>

                {showForm && (
                    <CustomerForm
                        onSave={handleSave}
                        onCancel={handleCancel}
                        isLoading={isSubmitting}
                        towns={towns}
                        sectors={availableSectors}
                        initialData={editingCustomer}
                        onTownChange={handleTownChange}
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