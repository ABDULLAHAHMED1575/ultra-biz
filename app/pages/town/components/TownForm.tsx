"use client"

import Button from "@/app/components/Button"

interface TownFormProps {
    onSave: (name: string) => Promise<void>
    onCancel: () => void
    initialData?: { id: string; name: string } | null
}

export default function TownForm({
    onSave,
    onCancel,
    initialData = null
}: TownFormProps) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const townName = formData.get("townName") as string

        if (townName?.trim()) {
            await onSave(townName.trim())
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
                            name="townName"
                            defaultValue={initialData?.name || ""}
                            placeholder="Enter Town Name"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                            required
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
                        {initialData ? "Update" : "Save"}
                    </Button>
                </div>
            </form>
        </div>
    )
}