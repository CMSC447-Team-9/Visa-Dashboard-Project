// /components/UpcomingCasesTable.tsx
import { VisaData } from "@/types/DashboardData"

const thClass = "px-3 py-3 font-semibold select-none hover:bg-gray-100"
const tdClass = "px-3 py-2 text-center break-words text-[15px]"

export default function PendingCasesTable({ visas }: { visas?: VisaData[] }) {
    if (!visas || visas.length === 0)
        return <p className="text-center text-gray-500 p-4">No upcoming renewals</p>

    return (
        <>
            <h2 className="text-xl underline mb-2 font-semibold">Pending Cases</h2>

            <table className="w-full table-fixed border-collapse text-sm rounded-xl overflow-hidden shadow-md">
                <thead>
                    <tr className="bg-gray-200 border-b">
                        <th className={thClass}>Name</th>
                        <th className={thClass}>Case Type</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-400">
                    {visas.map((v, i) => (
                        <tr key={i} className={`${i % 2 === 0 ? "bg-gray-100" : "bg-gray-200"} hover:bg-gray-300 transition`}>
                            <td className={tdClass}>{v.first_name} {v.last_name}</td>
                            <td className={tdClass}>{v.case_type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
