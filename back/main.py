import excel_parsing
import pandas as pd
if __name__ == '__main__':
    print("Hello World")
    excel = excel_parsing.get_excel()
    sorted_excel = excel_parsing.current_visas(excel)
    print(sorted_excel.to_string)
    #print(excel.columns.tolist)
