"use client"

import { useRef, useState, useEffect } from "react"
import { DashboardData, visaTypes } from "../types/DashboardData"
import { EmployeeRecord } from "../types/EmployeeRecord"
import DashboardTable from "@/components/DashboardTable"

const cardClass1: string = "rounded-xl border border-[#A6A7A9] bg-[#B6B7B9] shadow-[0_0_10px_1px_rgba(0,0,0,0.1)]"
const cardClass2: string = "rounded-xl border border-[#A6A7A9] bg-[#B6B7B9] shadow-[0_0_10px_5px_rgba(0,0,0,0.15)]"

const DASHBOARD_API: string = "/api/dashboard"

export default function Dashboard() {
    // Manage Data
    const [data, setData] = useState<DashboardData | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(DASHBOARD_API)
                if (!res.ok) throw new Error("Failed to fetch")
                const json = await res.json()
                setData(json)
            } catch (err) {
                console.error("Error fetching data:", err)
            }
        }

        fetchData()
    }, [])

    // Manage sorting
    const [sortedBy, setSort] = useState<{ key: keyof EmployeeRecord; direction: "asc" | "desc" }>({
        key: "lastName",
        direction: "asc",
    })

    const handleSort = (key: keyof EmployeeRecord) => {
        setSort((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "asc" };
        });
    }

    // Manage Filtering
    const [filterBy, setFilter] = useState("all")

    const handleFilter = (criteria: string) => {
        setFilter(criteria)
    }

    const getActiveVisas = (): number => {
        if (!data) return 0
        return data.active
    }
    const getExpiringVisas = (): number => {
        if (!data) return 0
        return data.expiring
    }
    const getVisaTypes = (): visaTypes => {
        if (!data) return { null: 0 }
        return data.visaTypes
    }
    const getEntries = (): EmployeeRecord[] => {
        if (!data) return []
        return data.entries
    }

    const expiring: number = getExpiringVisas()
    const visaTypes: visaTypes = getVisaTypes()
    const entries: EmployeeRecord[] = getEntries()

    // The actual design of the page
    return (
        <div className="flex flex-row justify-center w-full h-full p-2 gap-4">
            {/* List of all Visas */}
            <div className={`flex flex-col w-13/16 h-full justify-start p-4 gap-4 ${cardClass2} overflow-x-auto`}>
                <DashboardTable data={entries} sortedBy={sortedBy} filterBy={filterBy} setSort={handleSort} setFilter={handleFilter}/>
            </div>

            {/* Summary of Visas */}
            <div className={`flex-1 flex flex-col h-full items-center gap-2`}>

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
                <div className={`flex flex-col w-full h-1/6 ${cardClass1} p-4 items-center cursor-pointer`} onClick={() => handleSort("expirationDate")}>
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
                    <span className="flex-1 flex flex-col items-center justify-evenly w-full text-2xl text-center gap-4">
                        {Object.entries(visaTypes).map(([label, value]) => (
                            <span key={label} className="flex flex-col flex-1 items-center justify-center border w-full rounded-xl cursor-pointer" onClick={() => handleFilter(label)}>
                                <span className="font-semibold">{label.toUpperCase()}:</span>
                                <span>{value}</span>
                            </span>
                        ))}
                    </span>
                </div>

            </div>

        </div>
    )
}
