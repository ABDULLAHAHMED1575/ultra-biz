"use client"

import { useState, useEffect } from "react"
import Button from "@/app/components/Button"
import Dropdown from "@/app/components/Dropdown"

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
    isLoading?: boolean
    towns: Array<{ id: string; name: string }>
    sectors: Array<{ id: string; name: string; townId: string }>
}

export default function CustomerForm({
    onSave,
    onCancel,
    isLoading = false,
    towns,
    sectors
}: CustomerFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone_number: "",
        address: "",
        townId: "",
        sectorId: "",
        vendor: false
    })

    const [filteredSectors, setFilteredSectors] = useState(sectors)

    useEffect(() => {
        if (formData.townId) {
            setFilteredSectors(sectors.filter(s => s.townId === formData.townId))
            // Reset sector if it doesn't belong to selected town
            if (formData.sectorId) {
                const sectorBelongsToTown = sectors.find(
                    s => s.id === formData.sectorId && s.townId === formData.townId
                )
                if (!sectorBelongsToTown) {
                    setFormData(prev => ({ ...prev, sectorId: "" }))
                }
            }
        } else {
            setFilteredSectors(sectors)
        }
    }, [formData.townId, sectors])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (
            formData.name.trim() &&
            formData.email.trim() &&
            formData.phone_number.trim() &&
            formData.address.trim() &&
            formData.townId &&
            formData.sectorId
        ) {
            await onSave(formData)
            setFormData({
                name: "",
                email: "",
                phone_number: "",
                address: "",
                townId: "",
                sectorId: "",
                vendor: false
            })
        }
    }

    const townOptions = towns.map(town => ({
        label: town.name,
        value: town.id
    }))

    const sectorOptions = filteredSectors.map(sector => ({
        label: sector.name,
        value: sector.id
    }))

    return (
        <div className="rounded-lg border p-6 mb-6">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Customer Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter Customer Name"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter Email"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={formData.phone_number}
                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                            placeholder="Enter Phone Number"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Address
                        </label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Enter Address"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Town
                        </label>
                        <div className="w-full px-4 py-2 border rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-900">
                            <Dropdown
                                options={townOptions}
                                value={formData.townId}
                                onChange={(value) => setFormData({ ...formData, townId: value })}
                                placeholder="Select Town"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Sector
                        </label>
                        <div className="w-full px-4 py-2 border rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-900">
                            <Dropdown
                                options={sectorOptions}
                                value={formData.sectorId}
                                onChange={(value) => setFormData({ ...formData, sectorId: value })}
                                placeholder="Select Sector"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.vendor}
                            onChange={(e) => setFormData({ ...formData, vendor: e.target.checked })}
                            className="w-4 h-4"
                            disabled={isLoading}
                        />
                        <span className="text-sm font-medium">Is Vendor</span>
                    </label>
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        onClick={onCancel}
                        className="border"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </div>
            </form>
        </div>
    )
}