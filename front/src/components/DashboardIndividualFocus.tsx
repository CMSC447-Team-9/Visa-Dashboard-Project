import { VisaData } from "@/types/DashboardData"
import Link from "next/link"

export default function IndividualFocus({ visas }: { visas?: VisaData[] }) {

    if (!visas || visas.length === 0)
        return <p className="text-gray-500 text-center p-3">No upcoming renewals</p>

    const nextExpiring = visas.reduce((earliest, current) => {
        return new Date(current.expiration_date) < new Date(earliest.expiration_date) ? current : earliest
    }, visas[0])

    const fieldClass : string = "px-2 mx-2 mb-1 rounded-sm border bg-gray-100"

    return (
        <div className="flex flex-col gap-2 text-center">
            <h2 className="text-2xl underline mb-2 text-center">Next Expiration</h2>
            
            <div className="flex flex-row justify-center">
                <div className={`${fieldClass}`}>
                    <p><b>Name:</b> <br/> {nextExpiring.first_name} {nextExpiring.last_name}</p>
                </div>
                <div className={`${fieldClass}`}>
                    <p><b>Case Type:</b> <br/> {nextExpiring.case_type}</p>
                </div>
                <div className={`${fieldClass}`}>
                    <p><b>Expiration:</b> <br/> {nextExpiring.expiration_date}</p>
                </div>
            </div>

            <Link href={`/reports/${nextExpiring.umbc_email}`}>
                <button className="bg-black text-white px-3 py-2 rounded-md hover:opacity-80">
                    View Full Case
                </button>
            </Link>
        </div>
    )
}
