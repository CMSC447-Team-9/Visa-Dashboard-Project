import IndividualBackButton from "@/components/IndividualBackButton";
import { INDIVIDUAL_PATH } from "@/types/API_Paths";
import { EmployeeRecord, RecordTypes, ColumnLabels } from "@/types/EmployeeRecord";

interface PageProps {
    params: Promise<{ email: string }>
}

interface IndividualData {
    "individual_data": EmployeeRecord[];
    "general_notes": string;
    "pr_notes": string;
}

const cardClass: string = "rounded-xl border border-[#C8C9CB] bg-[#D8D9DB] shadow-[0_0_10px_5px_rgba(0,0,0,0.15)]"


export default async function ReportByEmail({ params }: PageProps) {
    const { email } = await params;
    const encodedEmail = encodeURIComponent(email);

    let data: IndividualData;
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
                    <div className="flex items-center gap-2 my-4 w-full">
                        <IndividualBackButton/>
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
                    <div className="mt-6 ml-2">
                        <h2 className="text-xl font-semibold mb-2">General Notes</h2>
                        <p>{data["general_notes"] || "No general notes"}</p>
                    </div>

                    {/* PR Notes */}
                    <div className="mt-4 ml-2">
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
                            .filter(([key, value]) => !["permanentResidencyNotes", "generalNotes", "prNotes"].includes(key) && value && value !== "NaT" && key in ColumnLabels)
                            .map(([key, value]) => {
                                const label = ColumnLabels[key as keyof EmployeeRecord] ?? key;
                                const type = RecordTypes[key as keyof EmployeeRecord];
                                let displayValue: string;
                                if (type === "timestamp" && value) {
                                    const date = new Date(value as string | number);
                                    displayValue = date.toLocaleDateString();
                                } else {
                                    displayValue = value?.toString() ?? "N/A";
                                }
                                return (
                                    <tr key={key} className="hover:bg-gray-100">
                                        <td className="border px-2 py-1 font-semibold break-words">{label}</td>
                                        <td className="border px-2 py-1 break-words">{displayValue}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
