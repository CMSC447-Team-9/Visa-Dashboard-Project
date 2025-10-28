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
    excel_sorted = excel_sorted[(excel_sorted["clean exp date"].isna()) | (excel_sorted["clean exp date"] >= today)]
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
# must pass in pre-processed DataFrame that only includes all live cases (done by current_visas function)
def get_total_live_cases(filtered_sheet):
    return len(filtered_sheet)


# returns a tuple representing the total for each case type given a pre-processed DataFrame with only active cases
# this function will only work properly if it's given a DataFrame that only includes active cases (done by current_visas function)
def get_case_type_totals(filtered_sheet):
    f1_count = 0 # total F-1 cases
    j1_count = 0 # total J-1 cases
    h1b_count = 0 # total H-1B cases
    pr_count = 0 # total PR cases

    # iterate through all cases in sheet
    for case in filtered_sheet["Case type"]:
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
        elif case_string.startswith("permanent"):
            pr_count += 1

    # return tuple with totals for each case type
    return (f1_count, j1_count, h1b_count, pr_count)


# returns an array of dictionaries representing all employee records
def get_employee_records():
    # load excel sheet into a pandas DataFrame
    df = pd.read_excel("Case tracking for CS class(updated).xlsx")
    employee_records = [] # create array to store dictionaries that representing employee records

    # iterate through all rows in df and create a dictionary for each row
    for _, row in df.iterrows():
        # each row in the sheet creates a dictionary that represents the employee record
        record = {
            "lastName":                 str(row.get("Last name", "")).strip(),
            "firstName":                str(row.get("First Name", "")).strip(),
            "employeeUmbcEmail":        str(row.get("Employee's UMBC email", "")).strip(),
            "personalEmail":            str(row.get("Personal email", "")).strip(),
            "filedBy":                  str(row.get("Filed by", "")).strip(),
            "countryOfBirth":           str(row.get("Country of Birth", "")).strip(),
            "allCitizenships":          str(row.get("All Citizenships", "")).strip(),
            "gender":                   str(row.get("Gender", "")).strip(),
            "caseType":                 str(row.get("Case type", "")).strip(),
            "permanentResidencyNotes":  str(row.get("Permanent residency notes", "")).strip(),
            "dependents":               str(row.get("Dependents", "")).strip(),
            "initialH1bStart":          str(row.get("initial H-1B start", "")).strip(),
            "startDate":                str(row.get("Start date", "")).strip(),
            "expirationDate":           str(row.get("Expiration Date", "")).strip(),
            "prepExtensionDate":        str(row.get("Prep extension date", "")).strip(),
            "maxHPeriod":               str(row.get("Max H period", "")).strip(),
            "documentExpiryI94":        str(row.get("Document Expiry I-94", "")).strip(),
            "generalNotes":             str(row.get("General notes", "")).strip(),
            "socCode":                  str(row.get("soc code", "")).strip(),
            "socCodeDescription":       str(row.get("soc code description", "")).strip(),
            "department":               str(row.get("Department", "")).strip(),
            "employeeTitle":            str(row.get("Employee Title", "")).strip(),
            "departmentAdmin":          str(row.get("Department Admin", "")).strip(),
            "departmentAdvisorPiChair": str(row.get("Department Advisor/PI/chair", "")).strip(),
            "annualSalary":             str(row.get("Annual Salary", "")).strip(),
            "employeeEducationalLevel": str(row.get("Employee Educational  Level", "")).strip(),
            "employeeEducationalField": str(row.get("Employee Educational Field", "")).strip(),
        }
        
        # add employee record dictionary to array of employee records
        employee_records.append(record)

    # return array of all employee records
    return employee_records