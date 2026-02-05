"use client"

import { useState } from "react"
import Button from "@/app/components/Button"
import Dropdown from "@/app/components/Dropdown"

interface SectorFormProps {
    onSave: (name: string, townId: string) => Promise<void>
    onCancel: () => void
    isLoading?: boolean
    towns: Array<{ id: string; name: string }>
}

export default function SectorForm({
   onSave,
   onCancel,
   isLoading = false,
   towns
}: SectorFormProps) {
    const [sectorName, setSectorName] = useState("")
    const [selectedTownId, setSelectedTownId] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (sectorName.trim() && selectedTownId) {
            await onSave(sectorName.trim(), selectedTownId)
            setSectorName("")
            setSelectedTownId("")
        }
    }

    const townOptions = towns.map(town => ({
        label: town.name,
        value: town.id
    }))

    return (
        <div className="rounded-lg border p-6 mb-6">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Sector Name
                        </label>
                        <input
                            type="text"
                            value={sectorName}
                            onChange={(e) => setSectorName(e.target.value)}
                            placeholder="Enter Sector Name"
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
                                value={selectedTownId}
                                onChange={setSelectedTownId}
                                placeholder="Select Town"
                            />
                        </div>
                    </div>
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