import { INDIVIDUAL_PATH } from "@/types/API_Paths";
import { EmployeeRecord } from "@/types/EmployeeRecord";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: { email: string };
}

interface DashboardResponse {
    "individual_data": EmployeeRecord[];
    "general_notes": string;
    "pr_notes": string;
}

const cardClass: string =
    "rounded-xl border border-[#A6A7A9] bg-[#B6B7B9] shadow-[0_0_10px_5px_rgba(0,0,0,0.15)]";

export default async function DashboardByEmail({ params }: PageProps) {
    const { email } = await params;
    const encodedEmail = encodeURIComponent(email);

    let data: DashboardResponse;
    try {
        const res = await fetch(`${INDIVIDUAL_PATH}${encodedEmail}`);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        data = await res.json();
    } catch (err) {
        console.error(err);
        return <div><h1>Could not fetch data for {email}</h1></div>;
    }

    if (!data || !data["individual_data"] || data["individual_data"].length === 0) {
        return <div>No info found for {email}</div>;
    }

    const employee = data["individual_data"][0];

    return (
        <div className="flex flex-row justify-center w-full h-full p-2 gap-4">
            {/* Left: Dashboard Card (3/4 width) */}
            <div className="w-3/4">
                <div className={`${cardClass} flex flex-col h-full w-full p-4 gap-2`}>
                    {/* Back Button + Title */}
                    <div className="flex items-center gap-2 mb-4 w-full">
                        <Link href="/reports" className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold ml-2">{employee.firstName} {employee.lastName}</h1>
                    </div>

                    {/* Employee Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-200 p-3 rounded shadow"><strong>UMBC Email:</strong> {employee.employeeUmbcEmail}</div>
                        <div className="bg-gray-200 p-3 rounded shadow"><strong>Personal Email:</strong> {employee.personalEmail}</div>
                        <div className="bg-gray-200 p-3 rounded shadow"><strong>Prep Date:</strong> {employee.prepExtensionDate ? new Date(employee.prepExtensionDate).toLocaleDateString() : "N/A"}</div>
                        <div className="bg-gray-200 p-3 rounded shadow"><strong>Visa Expiration Date:</strong> {employee.expirationDate ? new Date(employee.expirationDate).toLocaleDateString() : "N/A"}</div>
                        <div className="bg-gray-200 p-3 rounded shadow"><strong>Country of Birth:</strong> {employee.countryOfBirth}</div>
                        <div className="bg-gray-200 p-3 rounded shadow"><strong>College:</strong> {employee.college}</div>
                        <div className="bg-gray-200 p-3 rounded shadow"><strong>Filed By:</strong> {employee.filedBy}</div>
                        <div className="bg-gray-200 p-3 rounded shadow"><strong>Gender:</strong> {employee.gender}</div>
                    </div>

                    {/* General Notes */}
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">General Notes</h2>
                        <p>{data["general_notes"] || "No general notes"}</p>
                    </div>

                    {/* PR Notes */}
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold mb-2">PR Notes</h2>
                        <p>{data["pr_notes"] || "No PR notes"}</p>
                    </div>
                </div>
            </div>

            {/* Right: Scrollable Table (1/4 width) */}
            <div className={`flex-grow overflow-auto max-h-screen border rounded p-2 min-w-0 ${cardClass}`}>
                <table className="table-auto w-full border-collapse">
                    <tbody>
                        {Object.entries(employee)
                            .filter(([key]) => !["permanentResidencyNotes", "generalNotes", "prNotes"].includes(key))
                            .map(([key, value]) => (
                                <tr key={key} className="hover:bg-gray-100">
                                    <td className="border px-2 py-1 font-semibold break-words">{key}</td>
                                    <td className="border px-2 py-1 break-words">{value ? value.toString() : "N/A"}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
