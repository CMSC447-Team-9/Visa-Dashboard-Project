import { VisaData } from "@/types/DashboardData"
import Link from "next/link"

export default function IndividualFocus({ visas }: { visas?: VisaData[] }) {

    if (!visas || visas.length === 0)
        return <p className="text-gray-500 text-center p-3">No upcoming renewals</p>

    const nextExpiring = visas.reduce((earliest, current) => {
        return new Date(current.expiration_date) < new Date(earliest.expiration_date) ? current : earliest
    }, visas[0])


    return (
        <div className="flex flex-col gap-3 text-left">
            <h2 className="text-xl underline mb-2 text-center font-semibold">Next Expiration</h2>

            <p><b>Name:</b> {nextExpiring.first_name} {nextExpiring.last_name}</p>
            <p><b>Case Type:</b> {nextExpiring.case_type}</p>
            <p><b>Expiration:</b> {nextExpiring.expiration_date}</p>
            <Link href={`/reports/${nextExpiring.umbc_email}`}>
                <button className="bg-black text-white px-3 py-2 rounded-md hover:opacity-80">
                    View Full Case
                </button>
            </Link>
        </div>
    )
}
