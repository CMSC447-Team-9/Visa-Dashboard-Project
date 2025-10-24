import excel_parsing
import pandas as pd
if __name__ == '__main__':
    print("Hello World")
    excel = excel_parsing.get_excel()
    print(excel.to_string)
