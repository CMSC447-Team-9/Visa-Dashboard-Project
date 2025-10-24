import pandas as pd

#returns excel sheet parsed by pandas
def get_excel():
    return pd.read_excel("Case tracking for CS class.xlsx")