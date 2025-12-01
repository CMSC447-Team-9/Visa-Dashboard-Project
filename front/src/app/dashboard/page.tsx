import { DashboardData, Stats, VisaData } from "@/types/DashboardData"
import { DASHBOARD_PATH } from "@/types/API_Paths"
import umbc_logo from '../../../public/umbc_shield.png'
import Image from "next/image"
import UpcomingCasesTable from '@/components/DashboardUpcomingCasesTable'
import CaseNumbers from '@/components/DashboardCaseNumbers'
import IndividualFocus from '@/components/DashboardIndividualFocus'
import CasesPerYear from '@/components/DashboardCasesPerYear'
import PendingCasesTable from "@/components/PendingCasesTable"

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
        const res = await fetch(`${DASHBOARD_PATH}`);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        data = await res.json();
    } catch (err) {
        console.error(err);
        return <div><h1>Could not fetch data</h1></div>;
    }
    const renewableVisas: VisaData[] = data.renew_visas
    const pendingVisas: VisaData[] = data.pending_visas
    const caseData = data.case_data
    const totalActive: number = caseData.total_live
    const stats: Stats = data.stats

    return (
        <div className="flex flex-col w-full h-full gap-4">
            {/* top row */}
            <div className="flex flex-row gap-4 flex-1">
                {/* left side */}
                <div className="flex flex-col gap-4 w-7/10">
                    {/* top left row */}
                    <div className="flex flex-row gap-4">
                        <div className={`flex w-4/10 p-2 place-items-center @container`}>
                            <Image src={umbc_logo} alt='UMBC Shield Graphic' width={55} height={55} />
                            <h1 className='pl-5 text-[39px]'>Dashboard Page</h1>
                        </div>
                        <div className={`${cardClass} flex flex-col w-6/10 p-3 gap-2 place-items-center`}>
                            <div className={`flex w-full p-2 text-[35px] place-items-center`}>
                                <p className="">Total Active Visas:&nbsp;</p>
                                <p className="underline text-[#c03000] font-bold">{totalActive}</p>
                            </div>
                        </div>
                    </div>

                    {/* bottom left row */}
                    <div className={`${cardClass} p-3 grow`}>
                        <div className={`flex flex-col grow w-full items-center`}>
                            <UpcomingCasesTable visas={renewableVisas} />
                        </div>
                    </div>
                </div>

                {/* top right side */}
                <div className={`${cardClass} p-3 text-center flex-1`}>
                    <IndividualFocus visas={renewableVisas} />
                </div>
            </div>

            {/* bottom row */}
            <div className="flex flex-row gap-4">
                <div className={`${cardClass} p-4 text-center flex-1`}>
                    <PendingCasesTable visas={pendingVisas} />
                </div>
                <div className={`${cardClass} flex flex-col gap-4 p-4 w-3/10 text-center justify-between`}>
                    <CaseNumbers data={caseData} />
                    <CasesPerYear stats={stats} />
                </div>
            </div>
        </div>

    )
}