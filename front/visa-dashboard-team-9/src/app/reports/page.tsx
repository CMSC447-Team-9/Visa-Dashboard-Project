"use client"

import { useState, useEffect } from "react"
import { ReportsData, visaTypes } from "@/types/ReportsData"
import { EmployeeRecord } from "@/types/EmployeeRecord"
import { REPORTS_PATH } from "@/types/API_Paths"
import { RecordFilters } from "@/types/RecordFilters"
import ReportsTable from "@/components/ReportsTable"
import ReportsFilter from "@/components/ReportsFilter"

const cardClass1: string = "rounded-xl border border-[#A6A7A9] bg-[#B6B7B9] shadow-[0_0_10px_1px_rgba(0,0,0,0.1)]"
const cardClass2: string = "rounded-xl border border-[#A6A7A9] bg-[#B6B7B9] shadow-[0_0_10px_5px_rgba(0,0,0,0.15)]"

export default function Reports() {
    /* 
    THIS SECTION HANDLES RETRIEVING AND STORING DATA FROM API
    data: ReportsData Object
    setData: Setter for data, takes ReportsData as argument
     */
    const [data, setData] = useState<ReportsData | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(REPORTS_PATH)
                if (!res.ok) throw new Error("Failed to fetch")
                const json = await res.json()
                setData(json)
            } catch (err) {
                console.error("Error fetching data:", err)
            }
        }

        fetchData()
    }, [])

    /* 
    THIS SECTION HANDLES THE SORTING CRITERIA FOR DATA
    Default:
    key: lastName
    direction: asc

    sortedBy: (key, direction): where key is the column, and direction is "asc" or "desc" for ascending and descending, respectively
    setSort: Setter for sorting, takes a tuple (key, direction)
    */
    const [sortedBy, setSort] = useState<{ key: keyof EmployeeRecord; direction: "asc" | "desc" }>({
        key: "lastName",
        direction: "asc",
    })

    const handleSort = (key: keyof EmployeeRecord) => {
        setSort((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" }
            }
            return { key, direction: "asc" }
        })
    }

    /*
    THIS SECTION HANDLES FILTERING CRITERIA FOR DATA
    */
    const [filterBy, setFilter] = useState<RecordFilters>({})

    function updateFilter<K extends keyof EmployeeRecord>(
        key: K,
        value: EmployeeRecord[K][] | { min?: EmployeeRecord[K]; max?: EmployeeRecord[K] } | undefined
    ) {

        // This bit of logic converts single filters "example" to ["example"]
        let newValue
        if (value === undefined) newValue = undefined
        else if (!Array.isArray(value) && typeof value !== "object") newValue = [value]
        else newValue = value

        setFilter(prev => ({
            ...prev,
            [key]: newValue,
        }))
    }

    // This function returns all unique values from a given key in EmployeeRecord
    function getUniqueValues(employees: EmployeeRecord[]): Partial<{ [K in keyof EmployeeRecord]: EmployeeRecord[K][] }> {
        if (employees.length === 0) return {}

        return Object.fromEntries(
            (Object.keys(employees[0]) as (keyof EmployeeRecord)[])
                .map(key => {
                    const values = Array.from(new Set(employees.map(emp => emp[key])))
                    const sorted = values.slice().sort((a, b) => {
                        if (typeof a === "number" && typeof b === "number") return a - b
                        return String(a).localeCompare(String(b))
                    })
                    return [key, sorted]
                })
        )

    }


    // Simple Getters
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
            <div className={`flex flex-col w-13/16 h-full p-4 gap-2 ${cardClass2}`}>
                {/* Filter component */}
                <ReportsFilter filterOptions={getUniqueValues(getEntries())} filterBy={filterBy} updateFilter={updateFilter} />
                <hr/>
                {/* Table component */}
                <ReportsTable data={entries} sortedBy={sortedBy} filterBy={filterBy} setSort={handleSort} />
            </div>

            {/* Summary of Visas */}
            <div className={`flex-1 flex flex-col h-full items-center gap-2`}>

                {/* Active Visas */}
                <div className={`flex flex-col w-full h-1/6 ${cardClass1} p-4 items-center cursor-pointer`} onClick={() => []}>
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
                            <span key={label} className="flex flex-col flex-1 items-center justify-center border w-full rounded-xl cursor-pointer" onClick={() => { updateFilter("caseType", [label]) }}>
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
