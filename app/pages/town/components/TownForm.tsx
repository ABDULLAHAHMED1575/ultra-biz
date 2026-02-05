"use client"

import { useState, useEffect } from "react"
import Button from "@/app/components/Button"

interface TownFormProps {
    onSave: (name: string) => Promise<void>
    onCancel: () => void
    isLoading?: boolean
    initialData?: { id: string; name: string } | null
}

export default function TownForm({
                                     onSave,
                                     onCancel,
                                     isLoading = false,
                                     initialData = null
                                 }: TownFormProps) {
    const [townName, setTownName] = useState("")

    useEffect(() => {
        if (initialData) {
            setTownName(initialData.name)
        }
    }, [initialData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (townName.trim()) {
            await onSave(townName.trim())
            setTownName("")
        }
    }

    return (
        <div className="rounded-lg border p-6 mb-6">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Town Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={townName}
                            onChange={(e) => setTownName(e.target.value)}
                            placeholder="Enter Town Name"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                            disabled={isLoading}
                        />
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
                        {isLoading ? "Saving..." : initialData ? "Update" : "Save"}
                    </Button>
                </div>
            </form>
        </div>
    )
}