import { EmployeeRecord } from "@/types/EmployeeRecord"
import { RecordFilters } from "@/types/RecordFilters"
import ReportsTableRow from "./ReportsTableRow"

// To show/hide a column, just add a header corresponding to that column
export const columnLabels: Partial<Record<keyof EmployeeRecord, string>> = {
    lastName: "Last Name",
    firstName: "First Name",
    employeeUmbcEmail: "UMBC Email",
    expirationDate: "Expiry Date",
    filedBy: "Filed By",
    countryOfBirth: "Birth Country",
    caseType: "Visa Type",
    department: "Department",
    college: "College",
}

type ReportsTableProps = {
    data: EmployeeRecord[]
    sortedBy: { key: keyof EmployeeRecord; direction: "asc" | "desc" }
    filterBy: RecordFilters
    setSort: (key: keyof EmployeeRecord) => void
}

export default function ReportsTable({ data, sortedBy, filterBy, setSort }: ReportsTableProps) {
    const columnKeys = (Object.keys(columnLabels) as (keyof EmployeeRecord)[]).filter(
        key => columnLabels[key] !== ""
    )

    const filteredData = data.filter(record =>
        Object.entries(filterBy).every(([key, value]) => {
            if (!value) return true

            const recordValue = record[key as keyof EmployeeRecord]

            if (Array.isArray(value)) {
                return value.some(v => v === recordValue)
            }

            if (typeof value === "object" && ("min" in value || "max" in value)) {
                const min = (value as { min?: number; max?: number }).min
                const max = (value as { min?: number; max?: number }).max

                if (typeof recordValue !== "number") return true
                if (min !== undefined && recordValue < min) return false
                if (max !== undefined && recordValue > max) return false
                return true
            }

            return recordValue === value
        })
    )

    const numResults = filteredData.length //finds the number of results after filters are applied

    const sortedData = [...filteredData].sort((a, b) => {
        const aValue = a[sortedBy.key];
        const bValue = b[sortedBy.key];
        if (aValue < bValue) return sortedBy.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortedBy.direction === "asc" ? 1 : -1
        return 0
    })

    return (
        <div className="flex flex-col flex-1 min-h-0 w-full overflow-x-auto overflow-y-auto gap-2 py-1">

            {/*This is the results display*/}
            <div className="flex text-md items-center">
                <p>Results:&nbsp;</p>
                <p className="underline text-[#c03000] font-bold">
                    {numResults}
                </p>
            </div>

            <table className="min-w-0 w-full table-fixed">
                <thead>
                    <tr>
                        {columnKeys.map(key => (
                            <th key={key} className="border px-2 py-2 cursor-pointer hover:bg-gray-100 break-words select-none" onClick={() => setSort(key)}>
                                {columnLabels[key]}
                                {sortedBy.key === key ? (sortedBy.direction === "asc" ? " ↑" : " ↓") : ""}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row, i) => (
                        <ReportsTableRow key={i} row={row} columnKeys={columnKeys} />
                    ))}
                </tbody>
            </table>

        </div>
    )
}