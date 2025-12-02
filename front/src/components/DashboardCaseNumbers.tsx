import { DashboardData } from "@/types/DashboardData"

const thClass = "px-3 py-3 font-semibold select-none"
const tdClass = "px-3 py-2 text-center break-words text-[15px]"

export default function CaseNumbers({ data }: { data: DashboardData["case_data"] }) {
    const rows = [
        ["F-1", data["total_F-1"]],
        ["J-1", data["total_J-1"]],
        ["H-1B", data["total_H-1B"]],
        ["Other", data["total_live"]-data["total_H-1B"]-data["total_J-1"]-data["total_F-1"]],
        ["Total Active", data["total_live"]],
        ["Residency", data["total_Residency"]],

    ]

    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-2xl underline mb-2">Total Case Types</h2>
            <table className="min-w-0 w-full table-fixed border-collapse text-sm rounded-xl overflow-hidden shadow-md">
                <thead>
                    <tr className="bg-gray-400 border-b">
                        <th className={thClass}>Visa Type</th>
                        <th className={thClass}>Count</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-400">
                    {rows.map(([label, value], i) => (
                        <tr key={label} className={`${i % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`}>
                            <td className={`${tdClass} font-semibold`}>{label}</td>
                            <td className={`${tdClass} font-bold underline text-[#c03000]`}>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
