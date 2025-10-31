'use client'

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { EmployeeRecord } from "@/app/types/EmployeeRecord"
import { RecordFilters } from "@/app/types/RecordFilters"
import { columnLabels } from "./DashboardTable"

type DashboardFilterProps = {
    filterOptions: Partial<{ [K in keyof EmployeeRecord]: EmployeeRecord[K][] }>
    filterBy: RecordFilters
    updateFilter: <K extends keyof EmployeeRecord>(
        key: K,
        value: EmployeeRecord[K][] | { min?: EmployeeRecord[K]; max?: EmployeeRecord[K] } | undefined
    ) => void
    columns?: number
}

export default function DashboardFilter({ filterOptions, filterBy, updateFilter, columns = 3 }: DashboardFilterProps) {
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
        <div className="grid gap-4 w-full p-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {keys.map(key => {
                const selected = filterBy[key] as EmployeeRecord[typeof key][] | undefined
                return (
                    <div key={key} className="flex flex-row items-center justify-between gap-4 relative">
                        <label className="font-semibold mb-1">{columnLabels[key] ?? key}:</label>
                        <div className="relative flex-1">
                            <button ref={el => { buttonRefs.current[key as string] = el }} className="border p-2 rounded text-left w-full" onClick={() => handleClick(key)}>
                                {selected && selected.length > 0 ? selected.join(", ") : "Select..."}
                            </button>
                            {openMenu === key && createPortal(
                                <div ref={el => { menuRefs.current[key as string] = el }} className="absolute z-50 border rounded bg-white shadow-lg max-h-60 overflow-auto" style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }}>
                                    {filterOptions[key]?.map(option => {
                                        const isSelected = selected?.includes(option as any)
                                        return (
                                            <div key={String(option)} className={`p-2 cursor-pointer hover:bg-gray-100 ${isSelected ? "bg-blue-100 font-semibold" : ""}`} onClick={() => {
                                                let newSelected: EmployeeRecord[typeof key][] = selected ? [...selected] : []
                                                if (isSelected) newSelected = newSelected.filter(v => v !== option)
                                                else newSelected.push(option as EmployeeRecord[typeof key])
                                                updateFilter(key, newSelected.length > 0 ? newSelected : undefined)
                                            }}>
                                                {String(option)}
                                            </div>
                                        )
                                    })}
                                </div>,
                                document.body
                            )}
                        </div>
                    </div>
                )
            })}
            <div className="flex justify-end">
                <button className="border p-2 rounded bg-red-100 text-red-800 hover:bg-red-200" onClick={() => {
                    keys.forEach(key => updateFilter(key, undefined))
                }}>
                    Clear Filters
                </button>
            </div>
        </div>
    )
}
