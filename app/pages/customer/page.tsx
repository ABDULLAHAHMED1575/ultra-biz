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
    vendor: boolean
    createdAt: string
}

export default function CustomerPage() {
    const { customers, loading, addCustomer, customersCount, towns, sectors } = useCustomerContext()
    const [showForm, setShowForm] = useState(false)
    const [filterText, setFilterText] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const itemsPerPage = 10

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(filterText.toLowerCase()) ||
        customer.email.toLowerCase().includes(filterText.toLowerCase()) ||
        customer.phone.toLowerCase().includes(filterText.toLowerCase()) ||
        customer.address.toLowerCase().includes(filterText.toLowerCase()) ||
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
        const result = await addCustomer(data)
        setIsSubmitting(false)

        if (result.success) {
            setShowForm(false)
        }
    }

    const handleCancel = () => {
        setShowForm(false)
    }

    const columns: Column<CustomerTableRow>[] = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "address", label: "Address" },
        { key: "town", label: "Town" },
        { key: "sector", label: "Sector" },
        {
            key: "vendor",
            label: "Vendor",
            render: (value) => (
                <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                        value
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                >
                    {value ? "Yes" : "No"}
                </span>
            ),
        },
        { key: "createdAt", label: "Created At" },
    ]

    const tableData: CustomerTableRow[] = paginatedCustomers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        town: customer.town?.name || "N/A",
        sector: customer.sector?.name || "N/A",
        vendor: customer.vendor || false,
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
                            onClick={() => setShowForm(true)}
                            className="bg-transparent"
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
                        sectors={sectors}
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