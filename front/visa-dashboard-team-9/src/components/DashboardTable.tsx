"use client"

import { useState } from "react"

import { EmployeeRecord } from "@/app/types/EmployeeRecord"

type DashboardTableProps = {
    data: EmployeeRecord[]
    sortedBy: { key: keyof EmployeeRecord; direction: "asc" | "desc" }
    filterBy: string
    setSort: (key: keyof EmployeeRecord) => void
    setFilter: (key: string) => void
}

export default function DashboardTable({ data, sortedBy, filterBy, setSort, setFilter }: DashboardTableProps) {
    const filteredData = data

    const sortedData = [...filteredData].sort((a, b) => {
        const aValue = a[sortedBy.key];
        const bValue = b[sortedBy.key];
        if (aValue < bValue) return sortedBy.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortedBy.direction === "asc" ? 1 : -1;
        return 0;
    })

    return (
        <div className="w-full h-full p-2">
            <table className="w-full border-collapse border">
                <thead>
                    <tr>
                        {Object.keys(data[0] || {}).map(key => (
                            <th
                                key={key}
                                className="border px-4 py-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => setSort(key as keyof EmployeeRecord)}
                            >
                                {key} {sortedBy.key === key ? (sortedBy.direction === "asc" ? "↑" : "↓") : ""}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row, idx) => (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                            {Object.keys(row).map(colKey => (
                                <td key={colKey} className="border px-4 py-2 text-center">
                                    {row[colKey as keyof EmployeeRecord]?.toString()}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}