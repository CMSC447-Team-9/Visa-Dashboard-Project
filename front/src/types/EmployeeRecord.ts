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

export const ColumnLabels: Record<keyof EmployeeRecord, string> = {
  lastName: "Last Name",
  firstName: "First Name",
  employeeUmbcEmail: "UMBC Email",
  personalEmail: "Personal Email",
  filedBy: "Filed By",
  countryOfBirth: "Country of Birth",
  allCitizenships: "Citizenships",
  gender: "Gender",
  caseType: "Case Type",
  caseTypeExtension: "Case Type Extension",
  permanentResidencyNotes: "Permanent Residency Notes",
  dependents: "Number of Dependents",
  initialH1bStart: "Initial H-1B Start Date",
  startDate: "Start Date",
  expirationDate: "Expiration Date",
  prepExtensionDate: "Preparation Date",
  maxHPeriod: "Maximum H Period",
  documentExpiryI94: "I-94 Document Expiry",
  generalNotes: "General Notes",
  socCode: "SOC Code",
  socCodeDescription: "SOC Code Description",
  department: "Department",
  employeeTitle: "Job Title",
  departmentAdmin: "Department Admin",
  departmentAdvisorPiChair: "Department Advisor / PI / Chair",
  annualSalary: "Annual Salary",
  employeeEducationalLevel: "Education Level",
  employeeEducationalField: "Field of Study",
  college: "College"
}