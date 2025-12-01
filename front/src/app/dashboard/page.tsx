"use client"

import { useState, useEffect } from "react"
import { DashboardData, RenewData } from "@/types/DashboardData"
import { DASHBOARD_PATH, TEST_PATH} from "@/types/API_Paths"
import umbc_logo from '../../../public/umbc_shield.png'
import Image from "next/image"
import UpcomingCasesTable from '@/components/UpcomingCasesTable'
import CaseNumbers from '@/components/CaseNumbers'
import IndividualFocus from '@/components/IndividualFocus'
import CasesPerYear from '@/components/CasesPerYear'
import { deflateRawSync } from "zlib"


export default function Dashboard() {

    /*
    -Turn current dashboard into reporting page based on feedback from Diane
    -Move visa type numbers from reporting page to dashboard and make them more compact (I have ideas for that)
    -Add new ui element on the dashboard for cases per: academic year, calendar year, and reporting year per case types
    -Add export to csv option on reporting page
    -Add reload button on sidebar to manually reload data
    */

    const [data, setData] = useState<DashboardData | null>(null)
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(TEST_PATH)
                if (!res.ok) throw new Error("Failed to fetch")
                const json = await res.json()
                setData(json)
            } catch (err) {
                console.error("Error fetching data:", err)
            }
        }

        fetchData()
    }, [])

    const total_active = data?.total_live

    const backgroundClass: string = "rounded-xl border border-[#464647] bg-[#B6B7B9]"
    const inlineClass: string = "rounded-sm border"

    return (
    
        <div className="flex flex-col w-full h-full gap-4">

            {/* top row */}
            <div className="flex flex-row gap-4 h-5/8">

                {/* left side */}
                <div className="flex flex-col gap-4 w-7/10">

                    {/* top left row */}
                    <div className="flex flex-row gap-4">

                        <div className={`flex w-4/10 p-2 place-items-center @container`}>
                            <Image src={umbc_logo} alt='UMBC Shield Graphic' width={55} height={55}/>
                            <h1 className='pl-5 text-[39px]'>Dashboard Page</h1>
                        </div>

                        <div className={`${backgroundClass} flex flex-col w-6/10 p-3 gap-2 place-items-center`}>

                            <div className={`flex w-full p-2 text-[35px] place-items-center`}>
                                <p className="">Total Active Visas:&nbsp;</p>
                                <p className="underline text-[#c03000] font-bold">{total_active}</p>
                            </div>

                        </div>

                    </div>

                    {/* bottom left row */}
                    <div className={`${backgroundClass} flex flex-col p-3 gap-2 grow place-items-center`}>

                        <div className={`${inlineClass} flex grow w-full place-items-center border`}>
                            {UpcomingCasesTable(data?.renew_visas)}
                        </div>
                    </div> 

                </div>
                
                {/* top right side */}
                <div className={`${backgroundClass} p-4 w-3/10 content-center text-center`}>
                    {CaseNumbers()}
                </div>
            </div>

            {/* bottom row */}
            <div className="flex flex-row gap-4 h-3/8">
                <div className={`${backgroundClass} p-4 w-7/10 content-center text-center`}>
                    {CasesPerYear()}
                </div>
                <div className={`${backgroundClass} p-4 w-3/10 content-center text-center`}>
                    {IndividualFocus()}
                </div>
            </div>
        </div>
        
    )
}