export type VisaData = {
    "last_name": string;
    "first_name": string;
    "case_type": string;
    "expiration_date": string;
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
        "pending_visas": VisaData[]
    }