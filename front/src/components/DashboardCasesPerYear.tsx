import { Stats } from "@/types/DashboardData"
const thClass = "px-3 py-3 font-semibold select-none"
const tdClass = "px-3 py-2 text-center break-words text-[15px]"

export default function CasesPerYear({ stats }: { stats: Stats }) {
    const rows = [
        { type: "F-1", calendar: stats["f-1_calendar"], reporting: stats["f-1_reporting"], academic: stats["f-1_academic"] },
        { type: "J-1", calendar: stats["j-1_calendar"], reporting: stats["j-1_reporting"], academic: stats["j-1_academic"] },
        { type: "H-1B", calendar: stats["h-1b_calendar"], reporting: stats["h-1b_reporting"], academic: stats["h-1b_academic"] },
        { type: "Residency", calendar: stats["pr_calendar"], reporting: stats["pr_reporting"], academic: stats["pr_academic"] },
    ]

    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-2xl underline mb-2">Cases This Year</h2>
            <table className="min-w-0 w-full table-fixed border-collapse text-sm rounded-xl overflow-hidden shadow-md">
                <thead>
                    <tr className="bg-gray-400 border-b">
                        <th className={thClass}>Visa Type</th>
                        <th className={thClass}>Calendar Year</th>
                        <th className={thClass}>Reporting Year</th>
                        <th className={thClass}>Academic Year</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-400">
                    {rows.map((row, i) => (
                        <tr key={i} className={`${i % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`}>
                            <td className={`${tdClass} font-semibold`}>{row.type}</td>
                            <td className={tdClass}>{row.calendar}</td>
                            <td className={tdClass}>{row.reporting}</td>
                            <td className={tdClass}>{row.academic}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}