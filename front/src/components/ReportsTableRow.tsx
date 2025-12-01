"use client";

import { useRouter } from "next/navigation";
import { EmployeeRecord } from "@/types/EmployeeRecord";

export default function ReportsTableRow({ row, columnKeys }: { row: EmployeeRecord, columnKeys: (keyof EmployeeRecord)[] }) {
    const router = useRouter();

    return (
        <tr onClick={() => router.push(`/reports/${row.employeeUmbcEmail}`)} className="border-t hover:bg-[#c7c8ca] cursor-pointer select-none">
            {columnKeys.map(column => (
                <td key={column} className="border px-2 py-2 text-center break-words">
                    {formatCell(column, row[column])}
                </td>
            ))}
        </tr>
    );
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