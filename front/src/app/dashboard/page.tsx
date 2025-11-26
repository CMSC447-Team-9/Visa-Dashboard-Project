export default function Dashboard() {

    /*
    -Turn current dashboard into reporting page based on feedback from Diane
    -Move visa type numbers from reporting page to dashboard and make them more compact (I have ideas for that)
    -Add new ui element on the dashboard for cases per: academic year, calendar year, and reporting year per case types
    -Add result number to reporting page
    -Add export to csv option on reporting page
    -Add reload button on sidebar to manually reload data
    */

    return (
    
        <div className="flex w-full h-full justify-evenly place-content-center">
            <div className="rounded-xl border bg-[#B6B7B9] flex flex-col p-4 w-5/10 h-4/5">
                Upcoming Cases 
            </div>

            <div className="rounded-xl border bg-[#B6B7B9] flex flex-col p-4 w-3/10 h-4/5">
                Case Numbers
            </div>
        </div>
        
    )
}