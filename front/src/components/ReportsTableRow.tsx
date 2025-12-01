"use client";

import { useRouter } from "next/navigation";
import { EmployeeRecord } from "@/types/EmployeeRecord";

export default function ReportsTableRow({ row, columnKeys, index }: { row: EmployeeRecord, columnKeys: (keyof EmployeeRecord)[], index: number }) {
    const router = useRouter();
    return (
        <tr onClick={() => router.push(`/reports/${row.employeeUmbcEmail}`)} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"} cursor-pointer hover:bg-gray-300 transition`}>
            {columnKeys.map(col =>
                 <td key={col} className="px-3 py-2 text-center break-words text-[15px]">{formatCell(col, row[col])}
                 </td>)}
        </tr>
    )
}



const formatCell = (column: keyof EmployeeRecord, value: string | number) => {
    if (!value) return "Not Entered"
    switch (column) {
        case "expirationDate":
            if (value == -1) return 'Not Entered'
            if (typeof value === "string" && value.toLowerCase().startsWith('done')) return 'Done'
            return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

        case "startDate":
            return new Date(value).toLocaleDateString('en-US')

        default:
            return value?.toString()
    }

}