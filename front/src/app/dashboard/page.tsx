


export default function Dashboard() {

    /*
    -Turn current dashboard into reporting page based on feedback from Diane
    -Move visa type numbers from reporting page to dashboard and make them more compact (I have ideas for that)
    -Add new ui element on the dashboard for cases per: academic year, calendar year, and reporting year per case types
    -Add export to csv option on reporting page
    -Add reload button on sidebar to manually reload data
    */

    const backgroundClass: string = "rounded-xl border bg-[#B6B7B9]"
    const inlineClass: string = "rounded-sm border"

    return (
    
        <div className="flex flex-col w-full h-full gap-4">

            {/* top row */}
            <div className="flex flex-row gap-4 h-5/8">

                {/* left side */}
                <div className="flex flex-col gap-4 w-7/10">

                    {/* top left row */}
                    <div className="flex flex-row gap-4">

                        <div className={`${inlineClass} flex w-4/10 p-2 border text-3xl place-items-center`}>
                            <h1>Welcome to the Dashboard</h1>
                        </div>

                        <div className={`${backgroundClass} flex flex-col w-6/10 p-3 gap-2 place-items-center`}>

                            <div className={`${inlineClass} flex w-full p-2 border text-3xl place-items-center`}>
                                <p className="">Total Active Visas:&nbsp;</p>
                                <p className="underline text-[#c03000] font-bold">5</p>
                            </div>

                        </div>

                    </div>

                    {/* bottom left row */}
                    <div className={`${backgroundClass} flex flex-col p-3 gap-2 grow place-items-center`}>

                        <div className={`${inlineClass} flex grow w-full place-items-center border`}>
                            <p>Upcoming Cases</p>
                        </div>
                    </div> 

                </div>
                
                {/* top right side */}
                <div className={`${backgroundClass} p-4 w-3/10 content-center text-center`}>
                    <p>Case Numbers</p>
                </div>
            </div>

            {/* bottom row */}
            <div className="flex flex-row gap-4 h-3/8">
                <div className={`${backgroundClass} p-4 w-7/10 content-center text-center`}>
                    <p>Cases Per Year</p>
                </div>
                <div className={`${backgroundClass} p-4 w-3/10 content-center text-center`}>
                    <p>Individual Focus</p>
                </div>
            </div>
        </div>
        
    )
}