"use client"

import Button from "@/app/components/Button"

interface CustomerFormProps {
    onSave: (data: {
        name: string
        email: string
        townId: string
        sectorId: string
        address: string
        phone_number: string
        vendor: boolean
    }) => Promise<void>
    onCancel: () => void
    towns: Array<{ id: string; name: string }>
    sectors: Array<{ id: string; name: string; townId: string }>
    initialData?: {
        id: string
        name: string
        email: string
        townId: string
        sectorId: string
        address: string
        phone_number: string
        vendor: boolean
    } | null
}

export default function CustomerForm({
    onSave,
    onCancel,
    towns,
    sectors,
    initialData = null,
}: CustomerFormProps) {
    const handleTownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const form = e.currentTarget.form
        if (form) {
            const sectorSelect = form.querySelector('select[name="sectorId"]') as HTMLSelectElement
            const townId = e.target.value
            if (sectorSelect) {
                sectorSelect.value = ""
                const options = sectorSelect.querySelectorAll('option')
                options.forEach((option) => {
                    const optionTownId = option.getAttribute('data-town-id')
                    if (option.value === "") {
                        option.style.display = ""
                    } else if (optionTownId === townId) {
                        option.style.display = ""
                    } else {
                        option.style.display = "none"
                    }
                })
                sectorSelect.disabled = !townId
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            townId: formData.get("townId") as string,
            sectorId: formData.get("sectorId") as string,
            address: formData.get("address") as string,
            phone_number: formData.get("phone_number") as string,
            vendor: formData.get("vendor") === "on",
        }

        if (!data.name.trim()) {
            alert("Customer name is required")
            return
        }
        if (!data.email.trim()) {
            alert("Email is required")
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            alert("Please enter a valid email address")
            return
        }
        if (!data.phone_number.trim()) {
            alert("Phone number is required")
            return
        }
        if (!data.address.trim()) {
            alert("Address is required")
            return
        }
        if (!data.townId) {
            alert("Please select a town")
            return
        }
        if (!data.sectorId) {
            alert("Please select a sector")
            return
        }

        await onSave(data)
    }

    return (
        <div className="rounded-lg border p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
                {initialData ? "Edit Customer" : "Add New Customer"}
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Customer Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={initialData?.name || ""}
                            placeholder="Enter Customer Name"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={initialData?.email || ""}
                            placeholder="Enter Email"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phone_number"
                            defaultValue={initialData?.phone_number || ""}
                            placeholder="Enter Phone Number"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="address"
                            defaultValue={initialData?.address || ""}
                            placeholder="Enter Address"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Town <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="townId"
                            defaultValue={initialData?.townId || ""}
                            onChange={handleTownChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                            required
                        >
                            <option value="">Select Town</option>
                            {towns.map(town => (
                                <option key={town.id} value={town.id}>
                                    {town.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Sector <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="sectorId"
                            defaultValue={initialData?.sectorId || ""}
                            disabled={!initialData?.townId}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-700 disabled:cursor-not-allowed"
                            required
                        >
                            <option value="">Select Sector</option>
                            {sectors.map(sector => (
                                <option
                                    key={sector.id}
                                    value={sector.id}
                                    data-town-id={sector.townId}
                                    style={{
                                        display: initialData?.townId && sector.townId !== initialData.townId ? 'none' : ''
                                    }}
                                >
                                    {sector.name}
                                </option>
                            ))}
                        </select>
                        {!initialData?.townId && (
                            <p className="mt-1 text-sm text-gray-500">
                                Please select a town first
                            </p>
                        )}
                    </div>

                    <div className="col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="vendor"
                                defaultChecked={initialData?.vendor || false}
                                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                            />
                            <span className="text-sm font-medium">Is Vendor</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        onClick={onCancel}
                        className="border hover:bg-gray-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-black text-white hover:bg-gray-800"
                    >
                        {initialData ? "Update Customer" : "Save Customer"}
                    </Button>
                </div>
            </form>
        </div>
    )
}