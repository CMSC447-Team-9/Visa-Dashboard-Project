// /components/IndividualFocus.tsx

import { VisaData } from "@/types/DashboardData"

export default function IndividualFocus({ visa }: { visa?: VisaData }) {
    if (!visa)
        return <p className="text-gray-500 text-center p-3">No case selected</p>

    return (
        <div className="flex flex-col p-4 gap-3 text-left">
            <h2 className="text-2xl font-bold underline">Individual Focus</h2>

            <p><b>Name:</b> {visa.last_name}, {visa.first_name}</p>
            <p><b>Case Type:</b> {visa.case_type}</p>
            <p><b>Expiration:</b> {visa.expiration_date}</p>

            <button className="bg-black text-white px-3 py-2 rounded-md hover:opacity-80">
                View Full Case
            </button>
        </div>
    )
}
