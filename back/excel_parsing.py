import pandas as pd

#returns excel sheet parsed by pandas
def get_excel():
    excel = pd.read_excel("Case tracking for CS class.xlsx")
    mask = excel["Start date"].map(type) == str
    excel.loc[mask, "Start date"] = (excel.loc[mask, "Start date"].str.extract(r'(\d{1,2}[/]\d{1,2}[/]\d{2,4})')[0])
    excel["Start date"] = pd.to_datetime(excel["Start date"], errors='coerce')
    return excel

def current_visas(excel):
    #excel: dataframe of full excel sheet
    #returns dataframe of excel sheet with only everyones current visas
    excel_sorted = excel.sort_values(by="Start date", ascending=False)
    today = pd.Timestamp.today().normalize()
    excel_sorted = excel_sorted[excel_sorted["Start date"] < today]
    excel_sorted = excel_sorted.drop_duplicates(subset=["Last name", "First Name"], keep = 'first')
    excel_sorted["clean exp date"] = excel_sorted["Expiration Date"]
    mask = excel_sorted["clean exp date"].map(type) == str
    excel_sorted.loc[mask, "clean exp date"] = (excel_sorted.loc[mask, "clean exp date"].str.extract(r'(\d{1,2}[/]\d{1,2}[/]\d{2,4})')[0])
    excel_sorted["clean exp date"] = pd.to_datetime(excel_sorted["clean exp date"], errors='coerce')
    excel_sorted = excel_sorted[excel_sorted["clean exp date"] >= today]
    return excel_sorted


def visas_to_renew(excel):
    #excel: dataframe of sorted excel sheet containing only current visas
    #returns list of dictionaries containing info on all people whos visas are up for renewal
    today = pd.Timestamp.today().normalize()
    renew_list = []
    for _, row in excel.iterrows():
        if "done" in str(row["Expiration Date"]):
            continue

        case_type = str(row["Case type"])
        if ("H-1B" in case_type) or ("J-1" in case_type):
            if((row["clean exp date"] - today).days <= 180):
                renew_list.append({
                        "Last name": row["Last name"],
                        "First name": row["First Name"],
                        "Case type": row["Case type"],
                        "Expiration date": str((row["clean exp date"].date())),
                    })
            continue
        if ("F-1" in case_type):
            if((row["clean exp date"] - today).days <= 365):
                renew_list.append({
                        "Last name": row["Last name"],
                        "First name": row["First Name"],
                        "Case type": row["Case type"],
                        "Expiration date": str((row["clean exp date"].date())),
                    })

    return renew_list