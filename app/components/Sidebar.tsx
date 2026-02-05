"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Sidebar() {
    const router = useRouter()
    const [openDefinition, setOpenDefinition] = useState(false)

    return (
        <aside className="w-64 h-screen text-white px-4 py-6">
            <h1 className="text-3xl font-bold p-6 m-6">
                Ultra biz
            </h1>
            <hr className="my-4" />
            <p className="text-xs uppercase mb-2">
                Application
            </p>
            <button
                onClick={() => router.push("/pages/home")}
                className="w-full text-left px-2 py-2 mb-4 border rounded-lg hover:bg-gray-500"
            >
                Home
            </button>
            <button
                onClick={() => setOpenDefinition(!openDefinition)}
                className="w-full text-xs flex justify-between items-center rounded-md hover:bg-gray-500"
            >
                <span>DEFINITION</span>
                <span>{openDefinition ? "▲" : "▼"}</span>
            </button>
            {openDefinition && (
                <div className="ml-4 mt-1 flex flex-col gap-1 border-l">
                    <button
                        onClick={() => router.push("/pages/town")}
                        className="text-left px-2 py-1 rounded hover:bg-gray-500"
                    >
                        Town
                    </button>
                    <button
                        onClick={() => router.push("/pages/sector")}
                        className="text-left px-2 py-1 rounded hover:bg-gray-500"
                    >
                        Sector
                    </button>
                    <button
                        onClick={() => router.push("/pages/customer")}
                        className="text-left px-2 py-1 rounded hover:bg-gray-500"
                    >
                        Customer
                    </button>
                </div>
            )}
        </aside>
    )
}