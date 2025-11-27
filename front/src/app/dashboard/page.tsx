export default function Dashboard() {

    /*
    -Turn current dashboard into reporting page based on feedback from Diane
    -Move visa type numbers from reporting page to dashboard and make them more compact (I have ideas for that)
    -Add new ui element on the dashboard for cases per: academic year, calendar year, and reporting year per case types
    -Add export to csv option on reporting page
    -Add reload button on sidebar to manually reload data
    */

    const backgroundClass: string = "rounded-xl border bg-[#B6B7B9]"

    return (
    
        <div className="flex flex-col w-full h-full gap-4">

            <div className="flex flex-row gap-4 h-full">
                <div className={`${backgroundClass} p-4 grow content-center text-center`}>
                    <p>Upcoming Cases</p>
                </div> 

                <div className={`${backgroundClass} p-4 w-3/10 content-center text-center`}>
                    <p>Case Numbers</p>
                </div>
            </div>

            <div className="flex flex-row gap-4 h-4/5">
                <div className={`${backgroundClass} p-4 grow content-center text-center`}>
                    <p>Cases Per Year</p>
                </div>
                <div className={`${backgroundClass} p-4 w-3/10 content-center text-center`}>
                    <p>Individual Focus</p>
                </div>
            </div>
        </div>
        
    )
}