export const BACKEND = process.env.BACKEND || "http://localhost:8000"
export const NEXT_PUBLIC_BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8000"
export const UPLOAD_PATH: string = `${NEXT_PUBLIC_BACKEND}/api/upload`
export const REPORTS_PATH: string = `${NEXT_PUBLIC_BACKEND}/api/report`
export const LOGOUT_PATH: string = `${NEXT_PUBLIC_BACKEND}/api/logout`
export const DASHBOARD_PATH: string = `${BACKEND}/api/dashboard`
export const TEST_PATH: string = `${BACKEND}/api/test`
export const INDIVIDUAL_PATH: string = `${BACKEND}/api/report/`
