import { Timestamp } from "next/dist/server/lib/cache-handlers/types"

export type EmployeeRecord = {
  lastName: string
  firstName: string
  employeeUmbcEmail: string
  personalEmail: string
  filedBy: string
  countryOfBirth: string
  allCitizenships: string
  gender: string
  caseType: string
  caseTypeExtension: string
  permanentResidencyNotes: string
  dependents: number
  initialH1bStart: Timestamp
  startDate: Timestamp
  expirationDate: Timestamp
  prepExtensionDate: Timestamp
  maxHPeriod: Timestamp
  documentExpiryI94: Timestamp
  generalNotes: string
  socCode: string
  socCodeDescription: string
  department: string
  employeeTitle: string
  departmentAdmin: string
  departmentAdvisorPiChair: string
  annualSalary: number
  employeeEducationalLevel: string
  employeeEducationalField: string
  college: string
}

export const RecordTypes: Record<keyof EmployeeRecord, "string" | "number" | "timestamp"> = {
  lastName: "string",
  firstName: "string",
  employeeUmbcEmail: "string",
  personalEmail: "string",
  filedBy: "string",
  countryOfBirth: "string",
  allCitizenships: "string",
  gender: "string",
  caseType: "string",
  caseTypeExtension: "string",
  permanentResidencyNotes: "string",
  dependents: "number",
  initialH1bStart: "timestamp",
  startDate: "timestamp",
  expirationDate: "timestamp",
  prepExtensionDate: "timestamp",
  maxHPeriod: "timestamp",
  documentExpiryI94: "timestamp",
  generalNotes: "string",
  socCode: "string",
  socCodeDescription: "string",
  department: "string",
  employeeTitle: "string",
  departmentAdmin: "string",
  departmentAdvisorPiChair: "string",
  annualSalary: "number",
  employeeEducationalLevel: "string",
  employeeEducationalField: "string",
  college: "string"
}
