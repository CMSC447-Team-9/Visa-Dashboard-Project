import { EmployeeRecord } from "./EmployeeRecord"
export type ReportsData = {
    status: string,
    active: number,
    expiring: number,
    visa_types: visaTypes,
    entry_count: number,
    entries: EmployeeRecord[]
}

export type visaTypes = Record<string, number>