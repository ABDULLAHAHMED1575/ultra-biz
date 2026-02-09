"use client"

import { createSector } from "@/app/pages/sector/actions/createSector"
import { updateSector } from "@/app/pages/sector/actions/updateSector"
import Button from "@/app/components/Button"
import { useRouter } from "next/navigation"

interface SectorFormProps {
    onCancel: () => void
    towns: Array<{ id: string; name: string }>
    initialData?: { id: string; name: string; townId: string } | null
}

export default function SectorForm({
   onCancel,
   towns,
   initialData = null
}: SectorFormProps) {
    const router = useRouter()

    const handleSubmit = async (formData: FormData) => {
        const name = formData.get("name") as string
        const townId = formData.get("townId") as string

        if (!name?.trim() || !townId) {
            alert("Please fill in all fields")
            return
        }

        let result
        if (initialData) {
            result = await updateSector(initialData.id, { name: name.trim(), townId })
        } else {
            result = await createSector({ name: name.trim(), townId })
        }

        if (result.success) {
            router.refresh()
            onCancel()
        } else {
            alert(result.error || "Failed to save sector")
        }
    }

    return (
        <div className="rounded-lg border p-6 mb-6">
            <form action={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Sector Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={initialData?.name || ""}
                            placeholder="Enter Sector Name"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Town
                        </label>
                        <select
                            name="townId"
                            defaultValue={initialData?.townId || ""}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                            required
                        >
                            <option value="">Select Town</option>
                            {towns.map((town) => (
                                <option key={town.id} value={town.id}>
                                    {town.name}
                                </option>
                            ))}
                        </select>
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
                        className="bg-black text-white hover:bg-gray-800"
                    >
                        {initialData ? "Update" : "Save"}
                    </Button>
                </div>
            </form>
        </div>
    )
}