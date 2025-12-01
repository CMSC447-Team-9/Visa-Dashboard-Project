import { Timestamp } from "next/dist/server/lib/cache-handlers/types"

export type RenewData = {
    "Last name": string;
    "First name": string;
    "Case type": string;
    "Expiration date": Timestamp;
}

export type DashboardData = {

    total_live: number
    renew_visas: RenewData[]

}