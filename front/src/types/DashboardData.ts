export type VisaData = {
    "last_name": string,
    "first_name": string,
    "case_type": string,
    "expiration_date": string,
    "umbc_email": string
}

export type Stats = {
    "f-1_calendar": number,
    "f-1_reporting": number,
    "f-1_academic": number,
    "j-1_calendar": number,
    "j-1_reporting": number,
    "j-1_academic": number,
    "h-1b_calendar": number,
    "h-1b_reporting": number,
    "h-1b_academic": number,
    "pr_calendar": number,
    "pr_reporting": number,
    "pr_academic": number
}

export type DashboardData = {
    "case_data": {
        "total_F-1": number,
        "total_J-1": number,
        "total_H-1B": number,
        "total_Residency": number,
        "total_live": number,
    },
    "renew_visas": VisaData[],
    "pending_visas": VisaData[],
    "stats": Stats
}