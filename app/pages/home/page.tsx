"use client"

import React from "react"
import Card from "@/app/components/Card"
import { Building, Layers, Users } from "lucide-react"

export default function Home() {
    return (
        <main className="min-h-screen px-6 py-12 flex flex-col items-center">
            <h1 className="mb-12 text-2xl font-semibold">
                Ultra Biz Home
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
                <Card
                    title="Towns"
                    description="Add or View Town in Ultra Biz"
                    icon={<Building size={20} />}
                    href="/pages/town"
                />

                <Card
                    title="Sectors"
                    description="Add or View Sectors in Ultra Biz"
                    icon={<Layers size={20} />}
                    href="/pages/sector"
                />

                <Card
                    title="Customers"
                    description="Add or View Customers in Ultra Biz"
                    icon={<Users size={20} />}
                    href="/pages/customer"
                />
            </div>
        </main>
    )
}