"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useCustomerContext } from "@/app/pages/customer/hooks/CustomerContext"
import CustomerFormWrapper from "@/app/pages/customer/components/CustomerFormWrapper"
import Table, { type Column } from "@/app/components/Table"
import Button from "@/app/components/Button"
import Pagination from "@/app/components/Pagination"
import { deleteCustomer } from "@/app/pages/customer/actions/deleteCustomer"

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

export default function CustomerContent() {
    const router = useRouter()

    const {
        customers,
        loading,
        customersCount,
        totalPages,
        itemsPerPage,
        towns,
        sectors,
        currentPage,
        searchFilter,
        showForm,
        editId
    } = useCustomerContext()

    const startIndex = (currentPage - 1) * itemsPerPage
    const from = customersCount === 0 ? 0 : startIndex + 1
    const to = Math.min(startIndex + customers.length, customersCount)

    const editingCustomer = editId
        ? customers.find((c: any) => c.id === editId)
        : null

    const handleEdit = (row: CustomerTableRow) => {
        const params = new URLSearchParams({
            page: currentPage.toString(),
            ...(searchFilter && { search: searchFilter }),
            showForm: "true",
            editId: row.id,
        })
        router.push(`/pages/customer?${params}`)
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this customer?")) {
            const result = await deleteCustomer(id)
            if (result.success) {
                const remainingItems = customersCount - 1
                const maxPage = Math.ceil(remainingItems / itemsPerPage)
                const targetPage = currentPage > maxPage ? Math.max(1, maxPage) : currentPage

                const params = new URLSearchParams({
                    page: targetPage.toString(),
                    ...(searchFilter && { search: searchFilter }),
                })
                router.push(`/pages/customer?${params}`)
                router.refresh()
            }
        }
    }

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams({
            page: page.toString(),
            ...(searchFilter && { search: searchFilter }),
        })
        router.push(`/pages/customer?${params}`)
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

    const tableData: CustomerTableRow[] = customers.map((customer: any) => ({
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
                    <form action="/pages/customer" method="get" className="flex gap-2">
                        <input
                            type="text"
                            name="search"
                            placeholder="Filter Customers..."
                            defaultValue={searchFilter}
                            className="px-4 py-2 border rounded-md w-96 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                        <input type="hidden" name="page" value="1" />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700"
                        >
                            Search
                        </button>
                        {searchFilter && (
                            <Link href="/pages/customer">
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded-md hover:bg-gray-700"
                                >
                                    Clear
                                </button>
                            </Link>
                        )}
                    </form>

                    {!showForm && (
                        <Link
                            href={`/pages/customer?${new URLSearchParams({
                                ...(searchFilter && { search: searchFilter }),
                                page: currentPage.toString(),
                                showForm: "true",
                            })}`}
                        >
                            <Button className="bg-black text-white">+ Add Customer</Button>
                        </Link>
                    )}
                </div>

                {showForm && (
                    <CustomerFormWrapper
                        towns={towns}
                        sectors={sectors}
                        initialData={
                            editingCustomer
                                ? {
                                    id: editingCustomer.id,
                                    name: editingCustomer.name,
                                    email: editingCustomer.email,
                                    townId: editingCustomer.townId,
                                    sectorId: editingCustomer.sectorId,
                                    address: editingCustomer.address,
                                    phone_number: editingCustomer.phone,
                                    vendor: editingCustomer.vendor,
                                }
                                : null
                        }
                        currentPage={currentPage}
                        searchFilter={searchFilter}
                    />
                )}
            </div>

            <div>
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        Loading...
                    </div>
                ) : customers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {searchFilter
                            ? `No customers found matching "${searchFilter}"`
                            : "No customers found. Add your first customer to get started."}
                    </div>
                ) : (
                    <div>
                        <Table columns={columns} data={tableData} />
                        <div className="flex justify-between items-center mt-4">
                            <p className="text-sm">
                                Showing{" "}
                                <span className="font-medium">{from}</span> to{" "}
                                <span className="font-medium">{to}</span> of{" "}
                                <span className="font-medium">{customersCount}</span>
                            </p>
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}