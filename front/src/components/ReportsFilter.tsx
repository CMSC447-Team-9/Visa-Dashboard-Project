'use client'

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { EmployeeRecord, RecordTypes } from "@/types/EmployeeRecord"
import { RecordFilters, FilterValue } from "@/types/RecordFilters"
import { columnLabels } from "./ReportsTable"

type ReportsFilterProps = {
    filterOptions: Partial<{ [K in keyof EmployeeRecord]: EmployeeRecord[K][] }>
    filterBy: RecordFilters
    updateFilter: <K extends keyof EmployeeRecord>(
        key: K,
        value: EmployeeRecord[K][] | { min?: EmployeeRecord[K]; max?: EmployeeRecord[K] } | undefined
    ) => void
    columns?: number
}

export default function ReportsFilter({ filterOptions, filterBy, updateFilter, columns = 3 }: ReportsFilterProps) {
    // This display filter options based on which columns are actually visible in the table
    const visibleColumns = (Object.keys(columnLabels) as (keyof EmployeeRecord)[]).filter(key => columnLabels[key]?.trim() !== "")
    const keys = visibleColumns

    // This opens the menu based on the key that was clicked
    const [openMenu, setOpenMenu] = useState<keyof EmployeeRecord | null>(null)
    const handleClick = (key: keyof EmployeeRecord) => {
        const btn = buttonRefs.current[key as string]
        if (btn) {
            const rect = btn.getBoundingClientRect()
            setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width })
        }
        setOpenMenu(openMenu === key ? null : key)
    }

    // This, along with createPortal allows the dropdown menus to appear above the other elements
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })

    // This allows menus to close when clicking away from them
    const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
    const menuRefs = useRef<Record<string, HTMLDivElement | null>>({})
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openMenu) {
                const menuEl = menuRefs.current[openMenu]
                const buttonEl = buttonRefs.current[openMenu]
                if (menuEl && !menuEl.contains(event.target as Node) && buttonEl && !buttonEl.contains(event.target as Node)) {
                    setOpenMenu(null)
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [openMenu])

    return (
        <div className="overflow-x-auto">
            {/* Filter Grid */}
            <div className="grid gap-4 w-full p-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
                {keys.map(key => {
                    const selected = filterBy[key] as FilterValue<EmployeeRecord[typeof key]> | undefined;
                    return (
                        <div key={key} className="flex flex-row items-center justify-between gap-4 relative">
                            <label className="font-semibold mb-1 w-1/4">{columnLabels[key] ?? key}:</label>
                            <div className="relative flex-1">
                                {/* This is the selection/display for the filter */}
                                <button ref={el => { buttonRefs.current[key as string] = el }} className="border p-2 rounded text-left w-full bg-gray-200 hover:bg-gray-300" onClick={() => handleClick(key)}>
                                    {(() => {
                                        if (!selected) return "Select..."
                                        const fieldType = RecordTypes[key]
                                        if (fieldType === "string") return Array.isArray(selected) ? selected.join(", ") : String(selected)

                                        if (!Array.isArray(selected)) {
                                            const { min, max } = selected as { min?: number; max?: number }
                                            const format = fieldType === "timestamp"
                                                ? (v: number) => new Date(v).toLocaleDateString()
                                                : (v: number) => v.toString()

                                            if (min !== undefined && max !== undefined) return `${format(min)} <-> ${format(max)}`
                                            if (min !== undefined) return `≥ ${format(min)}`
                                            if (max !== undefined) return `≤ ${format(max)}`
                                        }

                                        return "Select..."
                                    })()}
                                </button>

                                {/* This is the menu to select for that filter */}
                                {openMenu === key && createPortal(
                                    <div ref={el => { menuRefs.current[key as string] = el }} className="absolute z-50 border rounded bg-white shadow-lg max-h-60 overflow-auto" style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }}>
                                        {(() => {
                                            const fieldType = RecordTypes[key]
                                            if (fieldType === "string") {
                                                return filterOptions[key]?.map(option => {
                                                    const isSelected = Array.isArray(selected) && selected.includes(option)
                                                    return (
                                                        <div key={String(option)} className={`p-2 cursor-pointer hover:bg-gray-100 ${isSelected ? "bg-blue-100 font-semibold" : ""}`} onClick={() => {
                                                            let newSelected = Array.isArray(selected) ? [...selected] : []
                                                            if (isSelected) newSelected = newSelected.filter(v => v !== option)
                                                            else newSelected.push(option as EmployeeRecord[typeof key])
                                                            updateFilter(key, newSelected.length > 0 ? newSelected : undefined)
                                                        }}>
                                                            {String(option || "Not Entered")}
                                                        </div>
                                                    )
                                                })
                                            } else if (fieldType === "number") {
                                                return (
                                                    <div className="flex flex-row gap-2 p-2">
                                                        <div className="w-1/2">
                                                            <label className="text-sm font-medium w-full">Min</label>
                                                            <input type="number" className="border rounded p-1 w-full" defaultValue={selected && !Array.isArray(selected) ? selected.min ?? "" : ""} onChange={e => updateFilter(key, { ...(Array.isArray(selected) ? {} : selected), min: e.target.value ? Number(e.target.value) as EmployeeRecord[typeof key] : undefined })} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="text-sm font-medium w-full">Max</label>
                                                            <input type="number" className="border rounded p-1 w-full" defaultValue={selected && !Array.isArray(selected) ? selected.max ?? "" : ""} onChange={e => updateFilter(key, { ...(Array.isArray(selected) ? {} : selected), max: e.target.value ? Number(e.target.value) as EmployeeRecord[typeof key] : undefined })} />
                                                        </div>
                                                    </div>
                                                )
                                            } else if (fieldType === "timestamp") {
                                                return (
                                                    <div className="flex flex-col gap-2 p-2">
                                                        <div className="">
                                                            <label className="text-sm font-medium w-full">Start Date</label>
                                                            <input type="date" className="border rounded p-1 w-full" defaultValue={selected && !Array.isArray(selected) && selected.min ? new Date(selected.min).toISOString().slice(0, 10) : ""} onChange={e => updateFilter(key, { ...(Array.isArray(selected) ? {} : selected), min: e.target.value ? new Date(e.target.value).getTime() as EmployeeRecord[typeof key] : undefined })} />
                                                        </div>
                                                        <div className="">
                                                            <label className="text-sm font-medium w-full">End Date</label>
                                                            <input type="date" className="border rounded p-1 w-full" defaultValue={selected && !Array.isArray(selected) && selected.max ? new Date(selected.max).toISOString().slice(0, 10) : ""} onChange={e => updateFilter(key, { ...(Array.isArray(selected) ? {} : selected), max: e.target.value ? new Date(e.target.value).getTime() as EmployeeRecord[typeof key] : undefined })} />
                                                        </div>
                                                    </div>
                                                )
                                            } else {
                                                return ""
                                            }
                                        })()}
                                    </div>,
                                    document.body)}
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* Clear Filters Button */}
            <div className="flex justify-end">
                <button className="border p-2 rounded bg-red-100 text-red-800 hover:bg-red-200" onClick={() => { keys.forEach(key => updateFilter(key, undefined)) }}>
                    Clear Filters
                </button>
            </div>

        </div>
    )
}
