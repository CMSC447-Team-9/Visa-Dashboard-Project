import { EmployeeRecord } from "./EmployeeRecord";

/*
This is a filter value template. We can filter based
on multiple values (OR), and range of values.
Empty T[] means NO filter
*/
export type FilterValue<T> =
    | T[]
    | { min?: T; max?: T }

export type RecordFilters = {
    [K in keyof EmployeeRecord]?: FilterValue<EmployeeRecord[K]>
}