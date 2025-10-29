import { EmployeeRecord } from "@/app/types/EmployeeRecord"

type DashboardTableProps = {
    data: EmployeeRecord[]
    sortedBy: { key: keyof EmployeeRecord; direction: "asc" | "desc" }
    filterBy: string
    setSort: (key: keyof EmployeeRecord) => void
    setFilter: (key: string) => void
}

const columnLabels: Record<keyof EmployeeRecord, string> = {
    lastName: "Last Name",
    firstName: "First Name",
    employeeUmbcEmail: "UMBC Email",
    personalEmail: "",
    expirationDate: "Expiry Date",
    filedBy: "Filed By",
    countryOfBirth: "Birth Country",
    allCitizenships: "",
    gender: "",
    caseType: "Visa Type",
    permanentResidencyNotes: "",
    dependents: "",
    initialH1bStart: "",
    startDate: "",
    prepExtensionDate: "",
    maxHPeriod: "",
    documentExpiryI94: "",
    generalNotes: "",
    socCode: "",
    socCodeDescription: "",
    department: "Department",
    employeeTitle: "",
    departmentAdmin: "",
    departmentAdvisorPiChair: "",
    annualSalary: "",
    employeeEducationalLevel: "",
    employeeEducationalField: "",
}

const formatCell = (column: keyof EmployeeRecord, value: string | number) => {
    if (!value) return "Not Entered"
    switch (column) {
        case "expirationDate":
            if (value == -1) return 'Not Entered'
            if (typeof value === "number" && !isNaN(value)) return new Date(value).toLocaleDateString('en-US')
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

export default function DashboardTable({ data, sortedBy, filterBy, setSort, setFilter }: DashboardTableProps) {
    const columnKeys = (Object.keys(columnLabels) as (keyof EmployeeRecord)[]).filter(
        key => columnLabels[key] !== ""
    )

    const filteredData = data

    const sortedData = [...filteredData].sort((a, b) => {
        const aValue = a[sortedBy.key];
        const bValue = b[sortedBy.key];
        if (aValue < bValue) return sortedBy.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortedBy.direction === "asc" ? 1 : -1;
        return 0;
    })
    return (
        <table className="min-w-0 table-fixed">
            <thead>
                <tr>
                    {columnKeys.map(key => (
                        <th key={key} className="border px-2 py-2 cursor-pointer hover:bg-[#c7c8ca] break-words" onClick={() => setSort(key)}>
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
    )
}