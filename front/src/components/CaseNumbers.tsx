// /components/CaseNumbers.tsx

import { DashboardData } from "@/types/DashboardData"

export default function CaseNumbers({ data }: { data: DashboardData["case_data"] }) {
    const rows = [
        ["F-1", data["total_F-1"]],
        ["J-1", data["total_J-1"]],
        ["H-1B", data["total_H-1B"]],
        ["Residency", data["total_Residency"]],
        ["Total Active", data["total_live"]]
    ]

    return (
        <div className="flex flex-col gap-3">
            {rows.map(([label, value]) => (
                <div key={label} className="flex justify-between w-full text-xl border-b pb-1">
                    <span>{label}</span>
                    <span className="text-[#c03000] font-bold underline">{value}</span>
                </div>
            ))}
        </div>
    )
}
