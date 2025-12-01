// /components/CasesPerYear.tsx

import { VisaData } from "@/types/DashboardData"

type YearCounts = {
    year: string
    F1: number
    J1: number
    H1B: number
    Residency: number
}

const thClass = "px-3 py-3 font-semibold cursor-pointer select-none hover:bg-gray-100"
const tdClass = "px-3 py-2 text-center break-words text-[15px]"

export default function CasesPerYear({ visas }: { visas: VisaData[] }) {

    // Group by expiration year
    const yearlyMap = new Map<string, YearCounts>()

    visas.forEach(v => {
        const year = new Date(v.expiration_date).getFullYear().toString()

        if (!yearlyMap.has(year)) {
            yearlyMap.set(year, { year, F1: 0, J1: 0, H1B: 0, Residency: 0 })
        }

        const entry = yearlyMap.get(year)!

        switch (v.case_type) {
            case "F-1": entry.F1++; break
            case "J-1": entry.J1++; break
            case "H-1B": entry.H1B++; break
            case "Residency": entry.Residency++; break
        }
    })

    const yearly = Array.from(yearlyMap.values()).sort((a, b) => Number(a.year) - Number(b.year))

    if (yearly.length === 0)
        return <p className="text-gray-500 text-center p-3">No expiration data available</p>

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl underline mb-2">Cases Per Year</h2>

            <table className="w-full table-fixed border-collapse text-sm rounded-xl overflow-hidden shadow-md">
                <thead>
                    <tr className="bg-gray-200 border-b">
                        <th className={thClass}>Year</th>
                        <th className={thClass}>F-1</th>
                        <th className={thClass}>J-1</th>
                        <th className={thClass}>H-1B</th>
                        <th className={thClass}>Residency</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-400">
                    {yearly.map((row, i) => (
                        <tr key={i} className={`${i % 2 === 0 ? "bg-gray-100" : "bg-gray-200"} cursor-pointer hover:bg-gray-300 transition`}>
                            <td className={`${tdClass} font-semibold`}>{row.year}</td>
                            <td className={tdClass}>{row.F1}</td>
                            <td className={tdClass}>{row.J1}</td>
                            <td className={tdClass}>{row.H1B}</td>
                            <td className={tdClass}>{row.Residency}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
