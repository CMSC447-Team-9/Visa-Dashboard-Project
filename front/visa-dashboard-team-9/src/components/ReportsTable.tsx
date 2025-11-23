import { EmployeeRecord } from "@/types/EmployeeRecord"
import { RecordFilters } from "@/types/RecordFilters"

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

    var numResults = filteredData.length //finds the number of results after filters are applied

    const sortedData = [...filteredData].sort((a, b) => {
        const aValue = a[sortedBy.key];
        const bValue = b[sortedBy.key];
        if (aValue < bValue) return sortedBy.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortedBy.direction === "asc" ? 1 : -1
        return 0
    })

    return (
        <div className="flex-1 min-h-0 w-full overflow-x-auto overflow-y-auto">

            {/*This is the results button*/}
            <div className="h-1/10 flex" style={{ fontSize : 25, alignItems : "center", paddingBottom : 18}}> 
                <p>Results:&nbsp;</p>
                {/*weird style is for red underlined font*/}
                <p style={{fontFamily: "Arial, Helvetica, sans-serif", fontWeight: "lighter", textDecoration: "underline", color: "#c03000"}}> {numResults} </p>
            </div>

            <table className="min-w-0 w-full table-fixed">
                <thead>
                    <tr>
                        {columnKeys.map(key => (
                            <th key={key} className="border px-2 py-2 cursor-pointer hover:bg-[#c7c8ca] break-words select-none" onClick={() => setSort(key)}>
                                {columnLabels[key]}
                                {sortedBy.key === key ? (sortedBy.direction === "asc" ? " ↑" : " ↓") : ""}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row, i) => (
                        <tr key={i} className="border-t hover:bg-[#c7c8ca]">
                            {columnKeys.map(column => (
                                <td key={column} className="border px-2 py-2 text-center break-words">
                                    {formatCell(column, row[column])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            
        </div>
    )
}

const formatCell = (column: keyof EmployeeRecord, value: string | number) => {
    if (!value) return "Not Entered"
    switch (column) {
        case "expirationDate":
            if (value == -1) return 'Not Entered'
            if (typeof value === "number" && !isNaN(value)) return new Date(value).toLocaleDateString()
            if (typeof value === "string" && value.toLowerCase().startsWith('done')) return 'Done'
            return value

        case "caseType":
            if (typeof value != "string") return value
            if (value.toUpperCase().startsWith('H-1B')) return 'H-1B'
            if (value.toUpperCase().startsWith('J-1')) return 'J-1'
            if (value.toUpperCase().startsWith('F-1')) return 'F-1'
            if (value.toLowerCase() == "permanent residency") return 'Permanent Residency'
            return value;

        case "startDate":
            return new Date(value).toLocaleDateString('en-US')

        default:
            return value?.toString()
    }

}