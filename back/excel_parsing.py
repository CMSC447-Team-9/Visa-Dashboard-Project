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
    #returned dataframe has 2 additional columns, "clean exp date" which has a timestamp object and "pending" which is a boolean
    excel_sorted = excel.sort_values(by="Start date", ascending=False)
    today = pd.Timestamp.today().normalize()
    excel_sorted = excel_sorted[excel_sorted["Start date"] < today]
    excel_sorted = excel_sorted.drop_duplicates(subset=["Last name", "First Name"], keep = 'first')
    excel_sorted["clean exp date"] = excel_sorted["Expiration Date"]
    mask = excel_sorted["clean exp date"].map(type) == str
    excel_sorted.loc[mask, "clean exp date"] = (excel_sorted.loc[mask, "clean exp date"].str.extract(r'(\d{1,2}[/]\d{1,2}[/]\d{2,4})')[0])
    excel_sorted["clean exp date"] = pd.to_datetime(excel_sorted["clean exp date"], errors='coerce')
    excel_sorted = excel_sorted[(excel_sorted["clean exp date"].isna()) | (excel_sorted["clean exp date"] >= today)]
    excel_sorted["pending"] = False
    excel_sorted.loc[excel_sorted["Expiration Date"] == "?", "pending"] = True
    return excel_sorted


def visas_to_renew(excel):
    #excel: dataframe of sorted excel sheet containing only current visas
    #returns list of dictionaries containing info on all people whos visas are up for renewal
    today = pd.Timestamp.today().normalize()
    renew_list = []
    for _, row in excel.iterrows():
        if "done" in str(row["Expiration Date"]):
            continue
        if row["pending"]:
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



def pending_visas(excel):
    #params: excel: sorted excel sheet with only current cases
    #returns list of all pending visas
    pending_list = []
    for _, row in excel.iterrows():
        if row["pending"] == True:
            pending_list.append({
                "Last name": row["Last name"],
                "First name": row["First Name"],
                "Case type": row["Case type"],
                "Expiration date": "Unknown",
            })
    return pending_list

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



def get_report_stats(sorted_excel, excel):
    #params: sorted_excel - sorted excel sheet of only current live cases, excel- excel sheet with start dates in datetime and 
    #returns dictionary of statistics
    stats = {"Male" : 0, "Female" : 0, 
            "Unknown Department" : 0, "Unknown Gender" : 0,}
    for _, row in sorted_excel.iterrows():
        unknown_gender = False
        unknown_department = False
        if(pd.notna(row["Gender"])):
            gender = row["Gender"].strip().lower()
            if(gender == "m" or gender == "male"):
                stats["Male"] = stats["Male"] + 1
            elif(gender == "f" or gender == "female"):
                stats["Female"] = stats["Female"] + 1
        else:
            unknown_gender = True
        if(pd.notna(row["Department"])):
            department = row["Department"].strip()
            if department in stats:
                stats[department] = stats[department] + 1
            else:
                stats[department] = 1
        else:
            unknown_department = True

        #if gender or department column was empty in sorted_excel will check the excel for other rows belonging to the person
        if(unknown_department or unknown_gender):
            person_rows = excel[(excel["Last name"] == row["Last name"]) & (excel["First Name"] == row["First Name"])].copy()
            person_rows = person_rows.sort_values("Start date", ascending = False)
            for _, person_row in person_rows.iterrows():
                if(unknown_department):
                    if(pd.notna(person_row["Department"])):
                        unknown_department = False
                        department = person_row["Department"].strip()
                        if department in stats:
                            stats[department] = stats[department] + 1
                        else:
                            stats[department] = 1
                if(unknown_gender):
                    if(pd.notna(person_row["Gender"])):
                        unknown_gender = False
                        gender = person_row["Gender"].strip().lower()
                        if(gender == "m" or gender == "male"):
                            stats["Male"] = stats["Male"] + 1
                        elif(gender == "f" or gender == "female"):
                            stats["Female"] = stats["Female"] + 1
                if not unknown_department and not unknown_gender:
                    break
            if(unknown_department):
                stats["Unknown Department"] = stats["Unknown Department"] + 1
            if(unknown_gender):
                stats["Unknown Gender"] = stats["Unknown Gender"] + 1
    return stats


def get_period_stats(excel):
    #params: excel: sorted excel sheet with only current cases
    #returns dictionary with info about amount of new visa types over different time periods
    stats = {"f-1 calendar" : 0, "f-1 reporting" : 0, "f-1 academic" : 0,
            "j-1 calendar" : 0, "j-1 reporting" : 0, "j-1 academic" : 0,
            "h-1b calendar" : 0, "h-1b reporting" : 0, "h-1b academic" : 0,
            "pr calendar" : 0, "pr reporting" : 0, "pr academic" : 0,}
    today = pd.Timestamp.today()
    academic_start = pd.Timestamp((today.year), 8, 1)
    academic_end = pd.Timestamp((today.year + 1), 5, 30)
    reporting_start = pd.Timestamp(today.year, 7, 1)
    reporting_end = pd.Timestamp(today.year + 1, 6, 30)
    if today.month < 8:
        academic_start = pd.Timestamp((today.year - 1), 8, 1)
        academic_end = pd.Timestamp(today.year, 5, 30)

    if today.month < 7:
        reporting_start = pd.Timestamp(today.year - 1, 7, 1)
        reporting_end = pd.Timestamp(today.year, 6, 30)

    calendar_start = pd.Timestamp(today.year, 1, 1)
    calendar_end = pd.Timestamp(today.year, 12, 31)
    for _, row in excel.iterrows():
        case_string = str(row["Case type"]).strip().lower()
        if(academic_start <= row["Start date"] <= academic_end):
            if case_string.startswith("f-1"):
                stats["f-1 academic"] += 1
            elif case_string.startswith("j-1"):
                stats["j-1 academic"] += 1
            elif case_string.startswith("h-1b"):
                stats["h-1b academic"] += 1
            elif case_string.startswith("permanent"):
                stats["pr academic"] += 1

        if(reporting_start <= row["Start date"] <= reporting_end):
            if case_string.startswith("f-1"):
                stats["f-1 reporting"] += 1
            elif case_string.startswith("j-1"):
                stats["j-1 reporting"] += 1
            elif case_string.startswith("h-1b"):
                stats["h-1b reporting"] += 1
            elif case_string.startswith("permanent"):
                stats["pr reporting"] += 1
            
        if(calendar_start <= row["Start date"] <= calendar_end):
            if case_string.startswith("f-1"):
                stats["f-1 calendar"] += 1
            elif case_string.startswith("j-1"):
                stats["j-1 calendar"] += 1
            elif case_string.startswith("h-1b"):
                stats["h-1b calendar"] += 1
            elif case_string.startswith("permanent"):
                stats["pr calendar"] += 1
    return stats



def get_notes(first_name, last_name, excel):
    #params: first name and last name are self explanatory, excel sheet is unsorted and contains all current and past visas
    #returns concatenation of all current and former general notes based on first and last name as a string
    notes = "\n".join(
    excel[(excel["First Name"] == first_name) & (excel["Last name"] == last_name)]["General notes"].dropna().astype(str)
    )
    return notes


def add_college(excel):
    #params: excel- sorted excel sheet with only current cases
    #returns excel sheet with added "college" column based on department
    excel["department"] = "Unknown"
    dept_to_college = {"africana studies":"CAHSS",
                       "american studies":"CAHSS",
                       "ancient studies":"CAHSS",
                       "asian studies":"CAHSS",
                       "dance":"CAHSS",
                       "economics":"CAHSS",
                       "education":"CAHSS",
                       "emergency and disaster health systems":"CAHSS",
                       "english":"CAHSS",
                       "gender, women's + sexuality studies":"CAHSS",
                       "geography & environmental systems":"CAHSS",
                       "gerontology":"CAHSS",
                       "global studies":"CAHSS",
                       "history":"CAHSS",
                       "judaic studies":"CAHSS",
                       "language, literacy & culture":"CAHSS",
                       "media & communication studies":"CAHSS",
                       "modern languages, linguistics & intercultural communication":"CAHSS",
                       "music":"CAHSS",
                       "philosophy":"CAHSS",
                       "political science":"CAHSS",
                       "psychology":"CAHSS",
                       "public policy":"CAHSS",
                       "sociology, anthropology, and public health":"CAHSS",
                       "theatre":"CAHSS",
                       "visual arts":"CAHSS",
                       "mechanical engineering":"COEIT",
                       "computer science and electrical engineering":"COEIT",
                       "information systems":"COEIT",
                       "chemical, biochemical, and environmental engineering":"COEIT",
                       "i-harp":"COEIT",
                       "biological sciences":"COEIT",
                       "chemistry and biochemistry":"COEIT",
                       "marine biotechnology":"COEIT",
                       "mathematics and statistics":"COEIT",
                       "naval science":"COEIT",
                       "physics":"COEIT",
                       "office of research and creative achievement orca":"Office of Research and Creative Achievement ORCA",
                       "orpc":"Office of Research and Creative Achievement ORCA",
                       "otd":"Office of Research and Creative Achievement ORCA",
                       "esra":"Office of Research and Creative Achievement ORCA",
                       "ord":"Office of Research and Creative Achievement ORCA",
                       "osp":"Office of Research and Creative Achievement ORCA",
                       "ras":"Office of Research and Creative Achievement ORCA",
                       "ocam":"Office of Research and Creative Achievement ORCA",
                       "individualized study program":"None",
                       "retriever integrated health":"None",
                       "budget and finance":"None",}
    excel["college"] = excel["Department"].str.lower().map(dept_to_college).fillna("Unknown")
    return excel

