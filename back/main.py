import excel_parsing
import pandas as pd
if __name__ == '__main__':
    excel = excel_parsing.get_excel()
    sorted_excel = excel_parsing.current_visas(excel)
    renew_list = excel_parsing.visas_to_renew(sorted_excel)
    stat_list = excel_parsing.get_report_stats(sorted_excel, excel)
    pending_list = excel_parsing.pending_visas(sorted_excel)
    notes = excel_parsing.get_notes("Sally","Ensen",excel)
    sorted_excel = excel_parsing.add_college(sorted_excel)
    print(sorted_excel[["college","Department"]])
    with open("parsed_sheet_data.txt",'w') as f:
        f.write("First name,Last name,Case type,Expiration date\n")
        for record in renew_list:
            f.write(
                f"{record['First name']},{record['Last name']},"
                f"{record['Case type']},{record['Expiration date']}\n"
            )
        f.write('\n')
        for stat in stat_list:
            f.write(f"{stat},{stat_list[stat]}\n")


    
    

