import { EmployeeRecord } from "./EmployeeRecord"
export type ReportsData = {
    status: string,
    timestamp: string,
    active: number,
    expiring: number,
    visaTypes: visaTypes,
    entry_count: number,
    entries: EmployeeRecord[]
}

export type visaTypes = Record<string, number>