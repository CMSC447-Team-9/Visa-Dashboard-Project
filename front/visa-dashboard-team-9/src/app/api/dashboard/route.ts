import { NextResponse } from "next/server"
import { EmployeeRecord } from "@/app/types/EmployeeRecord"
import { DashboardData } from "@/app/types/DashboardData"

export async function GET() {
    const dummyData: EmployeeRecord[] = []
    const visaTypes = {
        h1b: 1,
        j1: 2,
        f1: 3,
        residency: 4
    }
    const data: DashboardData = {
        status: "success",
        timestamp: Date.now().toLocaleString('en-US'),
        active: 2,
        expiring: 3,
        visaTypes: visaTypes,
        entry_count: dummyData.length,
        entries: dummyData,
    }

    return NextResponse.json(data, { status: 200 })
}
