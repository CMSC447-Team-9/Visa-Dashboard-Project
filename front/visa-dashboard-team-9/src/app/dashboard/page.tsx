"use client"

import { useRef, useState, useEffect } from "react"

const cardClass1: string = "rounded-xl border border-[#A6A7A9] bg-[#B6B7B9] shadow-[0_0_10px_1px_rgba(0,0,0,0.1)]"
const cardClass2: string = "rounded-xl border border-[#A6A7A9] bg-[#B6B7B9] shadow-[0_0_10px_5px_rgba(0,0,0,0.15)]"
export default function Dashboard() {
    const [sortedBy, setSort] = useState<{ key: string; direction: "asc" | "desc" }>({
        key: "name",
        direction: "asc",
    });
    const [filterBy, setFilter] = useState("all")

    const handleSort = (key: string) => {
        setSort((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "asc" };
        });
    }

    const handleFilter = (criteria: string) => {
        setFilter(criteria)
    }

    const getActiveVisas = (): number => {
        return 0;
    }
    const getExpiringVisas = (): number => {
        return 0;
    }

    const expiring = getExpiringVisas()

    // The actual design of the page
    return (
        <div className="flex flex-row justify-center w-full h-full p-2 gap-4">
            {/* List of all Visas */}
            <div className={`flex flex-col w-3/4 h-full items-center justify-center gap-4 ${cardClass2}`}>
            </div>

            {/* Summary of Visas */}
            <div className={`flex flex-col w-1/4 h-full items-center gap-2`}>

                {/* Active Visas */}
                <div className={`flex flex-col w-full h-1/6 ${cardClass1} p-4 items-center cursor-pointer`} onClick={() => handleFilter("active")}>
                    <span className="text-xl mb-2">
                        Active Visas:
                    </span>

                    <span className="flex-1 flex items-center justify-center w-full text-4xl font-bold ">
                        {getActiveVisas()}
                    </span>
                </div>

                {/* Expiring Visas */}
                <div className={`flex flex-col w-full h-1/6 ${cardClass1} p-4 items-center cursor-pointer`} onClick={() => handleSort("expiring")}>
                    <span className="text-xl mb-2">
                        Expiring Visas:
                    </span>

                    <span className={`flex-1 flex items-center justify-center w-full text-4xl font-bold ${expiring > 0 ? "text-red-600" : "text-green-600"}`}>
                        {expiring}
                    </span>
                </div>

                {/* Sum by Visa Types */}
                <div className={`flex-1 flex flex-col w-full ${cardClass1} p-4 items-center`}>
                    <span className="text-xl mb-2">
                        Visas by Type:
                    </span>
                    <span className="flex-1 flex items-center justify-center w-full text-4xl font-bold ">
                        {getActiveVisas()}
                    </span>
                </div>

            </div>

        </div>
    )
}
