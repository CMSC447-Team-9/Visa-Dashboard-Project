import { RenewData } from "@/types/DashboardData"

export default function UpcomingCasesTable(renew_visas : RenewData[] | undefined){

    if (!renew_visas){
        renew_visas = [{"Last name": "Test", "First name": "Test", "Case type": "Test", "Expiration date": -1}]
    }

    const ColumnLabels = {

        lastName: "Last Name"

    }

    return(

        <div>
            <p>Upcoming Cases <br/> {renew_visas[0]["Last name"]}, {renew_visas[0]["First name"]}, {renew_visas[0]["Case type"]}, {renew_visas[0]["Expiration date"]}</p>

            <table>
                <thead>
                    <tr>
                        <th scope="col" className="px-8"> Last Name </th>
                        <th scope="col" className="px-8"> First Name </th>
                        <th scope="col" className="px-8"> Case Type </th>
                        <th scope="col" className="px-8"> Expiration Date </th>
                    </tr>
                </thead>

                <tbody>

                    <tr>
                        
                        <th scope="row"> Sniv </th>
                        <td className="text-center border px-2"> Vinny </td>
                        <td className="text-center border px-2"> {renew_visas[0]["Case type"]} </td>
                        <td className="text-center border px-2"> 1015-12-31 </td>
                        
                    </tr>

                </tbody>

            </table>
        </div>
    )

}