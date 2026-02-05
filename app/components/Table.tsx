import React from "react"

export type Column<T> = {
    key: keyof T
    label: string
    render?: (value: T[keyof T], row: T) => React.ReactNode
}

interface TableProps<T> {
    columns: Column<T>[]
    data: T[]
}

export default function Table<T extends { id?: string }>({
    columns,
    data,
}: TableProps<T>) {
    return (
        <div className="overflow-x-auto border rounded-lg">
            <table className="w-full border-collapse">
                <thead>
                <tr className="text-left text-sm font-bold border-b">
                    {columns.map((col) => (
                        <th
                            key={String(col.key)}
                            className="px-4 py-3 font-medium"
                        >
                            {col.label}
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody className="text-sm">
                {data.length === 0 && (
                    <tr>
                        <td
                            colSpan={columns.length}
                            className="px-4 py-6 text-center text-bold"
                        >
                            No data found
                        </td>
                    </tr>
                )}

                {data.map((row, index) => (
                    <tr
                        key={row.id ?? index}
                    >
                        {columns.map((col) => (
                            <td
                                key={String(col.key)}
                                className="px-4 py-3 border-b border-collapse"
                            >
                                {col.render
                                    ? col.render(row[col.key], row)
                                    : String(row[col.key] ?? "")
                                }
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}