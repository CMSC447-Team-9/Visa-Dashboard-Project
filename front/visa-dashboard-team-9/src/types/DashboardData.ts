import { EmployeeRecord } from "./EmployeeRecord"
export type DashboardData = {
    status: string,
    timestamp: string,
    active: number,
    expiring: number,
    visaTypes: visaTypes,
    entry_count: number,
    entries: EmployeeRecord[]
}

export type visaTypes = Record<string, number>