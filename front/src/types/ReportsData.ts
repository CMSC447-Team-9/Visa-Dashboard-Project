import { EmployeeRecord } from "./EmployeeRecord"
export type ReportsData = {
    status: string,
    entry_count: number,
    entries: EmployeeRecord[]
}

export type visaTypes = Record<string, number>