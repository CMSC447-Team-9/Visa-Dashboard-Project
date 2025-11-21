import pandas as pd

# returns excel sheet parsed by pandas
def get_excel():
    excel = pd.read_excel("Case tracking for CS class(updated).xlsx")
    mask = excel["Start date"].map(type) == str
    excel.loc[mask, "Start date"] = (excel.loc[mask, "Start date"].str.extract(r'(\d{1,2}[/]\d{1,2}[/]\d{2,4})')[0])
    excel["Start date"] = pd.to_datetime(excel["Start date"], errors='coerce')
    return excel


# returns a DataFrame that contains only the live cases
def current_visas(excel):
    # excel: DataFrame of full excel sheet
    # returns DataFrame of excel sheet with only everyones current visas
    excel_sorted = excel.sort_values(by="Start date", ascending=False)
    today = pd.Timestamp.today().normalize()
    excel_sorted = excel_sorted[excel_sorted["Start date"] < today]
    excel_sorted = excel_sorted.drop_duplicates(subset=["Last name", "First Name"], keep = 'first')
    excel_sorted["clean exp date"] = excel_sorted["Expiration Date"]
    mask = excel_sorted["clean exp date"].map(type) == str
    excel_sorted.loc[mask, "clean exp date"] = (excel_sorted.loc[mask, "clean exp date"].str.extract(r'(\d{1,2}[/]\d{1,2}[/]\d{2,4})')[0])
    excel_sorted["clean exp date"] = pd.to_datetime(excel_sorted["clean exp date"], errors='coerce')
    excel_sorted = excel_sorted[(excel_sorted["clean exp date"].notna()) & (excel_sorted["clean exp date"] >= today)]
    return excel_sorted


# returns list of dictionaries containing necessary info on all people whos visas are close to expiring
def visas_to_renew(excel):
    # excel: DataFrame of sorted excel sheet containing only current visas
    # returns list of dictionaries containing info on all people whos visas are up for renewal
    today = pd.Timestamp.today().normalize()
    renew_list = []
    for _, row in excel.iterrows():
        if "done" in str(row["Expiration Date"]):
            continue
        if pd.isna(row["clean exp date"]):
            renew_list.append({
                "Last name": row["Last name"],
                "First name": row["First Name"],
                "Case type": row["Case type"],
                "Expiration date": "Unknown",
            })
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


# returns total number of live cases
def get_total_live_cases():
    all_cases = get_excel()
    live_cases = current_visas(all_cases)
    return len(live_cases)


# returns a tuple representing the total for each case type
def get_case_type_totals():

    all_cases = get_excel() # all cases
    live_cases = current_visas(all_cases) # only live cases
    
    f1_count = 0 # total F-1 cases
    j1_count = 0 # total J-1 cases
    h1b_count = 0 # total H-1B cases
    pr_count = 0 # total PR cases

    # iterate through all live cases
    for case in live_cases["Case type"]:
        # skip this case if "Case type" field is missing
        if pd.isna(case):
            continue

        # convert case type to string and remove whitespace and uppercase characters
        case_string = str(case).strip().lower()

        # increment counts of respective case types
        if case_string.startswith("f-1"):
            f1_count += 1
        elif case_string.startswith("j-1"):
            j1_count += 1
        elif case_string.startswith("h-1b"):
            h1b_count += 1
        
    # iterate through all cases
    for case in all_cases["Case type"]:
        # skip this case if "Case type" field is missing
        if pd.isna(case):
            continue

        # convert case type to string and remove whitespace and uppercase characters
        case_string = str(case).strip().lower()
        
        # increment count of permanent residency cases
        if case_string.startswith("permanent"):
            pr_count += 1
    

    # return tuple with totals for each case type
    return (f1_count, j1_count, h1b_count, pr_count)


# splits the "Case type" column into two columns to get clean visa types
def split_case_type(df):
    df = df.copy()
    df["Case type extension"] = ""  

    for ind, case in df["Case type"].items():
        if pd.isna(case):
            continue
        original = str(case).strip()
        case_string = original.lower()

        if case_string.startswith("f-1"):
            df.loc[ind, "Case type"] = "F-1"
            df.loc[ind, "Case type extension"] = original[3:].strip()
        elif case_string.startswith("j-1"):
            df.loc[ind, "Case type"] = "J-1"
            df.loc[ind, "Case type extension"] = original[3:].strip()
        elif case_string.startswith("h-1b"):
            df.loc[ind, "Case type"] = "H-1B"
            df.loc[ind, "Case type extension"] = original[4:].strip()
        else:
            df.loc[ind, "Case type"] = str(case).strip()

    case_column = df.pop("Case type extension")       
    ind = df.columns.get_loc("Case type") + 1       
    df.insert(ind, "Case type extension", case_column) 

    return df


# returns the employee spreadsheet data formatted as a JSON string of employee records
def get_employee_records():
    # loads the employee data spreadsheet into a DataFrame
    df = get_excel()
    df = split_case_type(df)

    # renaming the columns of the DataFrame
    renamed_df = df.rename(columns={
        "Last name": "lastName",
        "First Name": "firstName",
        "Employee's UMBC email": "employeeUmbcEmail",
        "Personal email": "personalEmail",
        "Filed by": "filedBy",
        "Country of Birth": "countryOfBirth",
        "All Citizenships": "allCitizenships",
        "Gender": "gender",
        "Case type": "caseType",
        "Case type extension": "caseTypeExtension",
        "Permanent residency notes": "permanentResidencyNotes",
        "Dependents": "dependents",
        "initial H-1B start": "initialH1bStart",
        "Start date": "startDate",
        "Expiration Date": "expirationDate",
        "Prep extension date": "prepExtensionDate",
        "Max H period": "maxHPeriod",
        "Document Expiry I-94": "documentExpiryI94",
        "General notes": "generalNotes",
        "soc code": "socCode",
        "soc code description": "socCodeDescription",
        "Department": "department",
        "Employee Title": "employeeTitle",
        "Department Admin": "departmentAdmin",
        "Department Advisor/PI/chair": "departmentAdvisorPiChair",
        "Annual Salary": "annualSalary",
        "Employee Educational  Level": "employeeEducationalLevel",
        "Employee Educational Field": "employeeEducationalField",
    })

    # clean up the DataFrame to fill empty cells with empty strings
    clean_df = renamed_df.fillna("")

    # return the DataFrame as a JSON string
    return clean_df.to_json(orient="records", force_ascii=False)