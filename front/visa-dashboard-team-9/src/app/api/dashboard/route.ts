import { NextResponse } from "next/server"
import { EmployeeRecord } from "@/app/types/EmployeeRecord"
import { DashboardData } from "@/app/types/DashboardData"
import { testData } from "@/app/data/testEntries"

export async function GET() {
    const dummyData: EmployeeRecord[] = getUniqueEmployeesByMostRecent(testData)
    const visaTypes = {
        h1b: 999,
        j1: 999,
        f1: 999,
        residency: 999
    }
    const data: DashboardData = {
        status: "success",
        timestamp: Date.now().toLocaleString('en-US'),
        active: -999,
        expiring: -999,
        visaTypes: visaTypes,
        entry_count: dummyData.length,
        entries: dummyData,
    }

    return NextResponse.json(data, { status: 200 })
}

function getUniqueEmployeesByMostRecent(records: EmployeeRecord[]): EmployeeRecord[] {
    const map = new Map<string, EmployeeRecord>();

    for (const rec of records) {
        const key = rec.employeeUmbcEmail;
        const existing = map.get(key);

        const recDate = new Date(rec.startDate).getTime();
        const existingDate = existing ? new Date(existing.startDate).getTime() : 0;

        if (!existing || recDate > existingDate) {
            map.set(key, rec);
        }
    }

    return Array.from(map.values());
}