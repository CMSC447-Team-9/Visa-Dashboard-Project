import pandas as pd

#returns excel sheet parsed by pandas
def get_excel():
    excel = pd.read_excel("Case tracking for CS class.xlsx")
    excel["Start date"] = pd.to_datetime(excel["Start date"], errors='coerce')
    return excel

def current_visas(excel):
    #excel: dataframe of full excel sheet
    #returns dataframe of excel sheet with only everyones current visas
    excel_sorted = excel.sort_values(by="Start date", ascending=False)
    today = pd.Timestamp.today().normalize()
    excel_sorted = excel_sorted[excel_sorted["Start date"] < today]
    #excel_sorted = excel_sorted[excel_sorted["Expiration Date"] > today]
    excel_sorted = excel_sorted.drop_duplicates(subset=["Last name", "First Name"], keep = 'first')
    return excel_sorted