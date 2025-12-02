import { DashboardData, Stats, VisaData } from "@/types/DashboardData"
import { DASHBOARD_PATH } from "@/types/API_Paths"
import umbc_logo from '../../../public/umbc_shield.png'
import Image from "next/image"
import UpcomingCasesTable from '@/components/DashboardUpcomingCasesTable'
import CaseNumbers from '@/components/DashboardCaseNumbers'
import IndividualFocus from '@/components/DashboardIndividualFocus'
import CasesPerYear from '@/components/DashboardCasesPerYear'
import PendingCasesTable from "@/components/DashboardPendingCasesTable"

const cardClass: string = "rounded-xl border border-[#C8C9CB] bg-[#D8D9DB] shadow-[0_0_10px_5px_rgba(0,0,0,0.15)]"

/*
-Turn current dashboard into reporting page based on feedback from Diane
-Move visa type numbers from reporting page to dashboard and make them more compact (I have ideas for that)
-Add new ui element on the dashboard for cases per: academic year, calendar year, and reporting year per case types
-Add export to csv option on reporting page
-Add reload button on sidebar to manually reload data
*/
export default async function Dashboard() {
    let data: DashboardData;
    try {
        const res = await fetch(`${DASHBOARD_PATH}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        data = await res.json();
    } catch (err) {
        console.error(err);
        return <div><h1>Could not fetch data from {DASHBOARD_PATH}</h1></div>;
    }
    const renewableVisas: VisaData[] = data.renew_visas
    const pendingVisas: VisaData[] = data.pending_visas
    const caseData = data.case_data
    const totalActive: number = caseData.total_live
    const stats: Stats = data.stats

    return (
        <div className="flex flex-col w-full space-y-4 text-center">
            {/* top row */}
            <div className="flex flex-row flex-1 min-h-0 space-x-4">
                {/* left side */}
                <div className="flex flex-col w-7/10 min-h-0 space-y-4">
                    {/* top left row */}
                    <div className="flex flex-row space-x-4">
                        <div className="flex w-4/10 p-2 items-center">
                            <Image src={umbc_logo} alt="UMBC Shield Graphic" className="w-6 md:w-8 lg:w-10 h-auto" />
                            <h2 className="text-2xl ml-2">Dashboard</h2>
                        </div>
                        <div className={`${cardClass} flex flex-col w-6/10 p-3 gap-2 items-center`}>
                            <div className="flex w-full p-2 text-2xl justify-center items-center">
                                <p>Total Active Visas:&nbsp;</p>
                                <p className="underline text-[#c03000] font-bold">{totalActive}</p>
                            </div>
                        </div>
                    </div>

                    {/* bottom left row */}
                    <div className={`${cardClass} flex-1 min-h-0 p-3`}>
                        <div className="flex flex-col w-full h-full overflow-y-auto">
                            <UpcomingCasesTable visas={renewableVisas} />
                        </div>
                    </div>
                </div>

                {/* top right side */}
                <div className={`${cardClass} flex-1 min-h-0 p-3`}>
                    <div className="h-full overflow-y-auto">
                        <IndividualFocus visas={renewableVisas} />
                    </div>
                </div>
            </div>

            {/* bottom row */}
            <div className="flex flex-row flex-1 min-h-0 space-x-4">
                <div className={`${cardClass} flex-1 min-h-0 flex flex-col p-4 overflow-y-auto`}>
                    <PendingCasesTable visas={pendingVisas} />
                </div>
                <div className={`${cardClass} flex flex-col gap-2 p-4 w-3/8 min-h-0 justify-between overflow-y-auto`}>
                    <CaseNumbers data={caseData} />
                    <CasesPerYear stats={stats} />
                </div>
            </div>
        </div>
    )


}