from fastapi import FastAPI, File, UploadFile, HTTPException
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import excel_parsing
import pandas as pd
from io import BytesIO

app = FastAPI()
app.state.excel: pd.DataFrame | None = None
app.state.current_visa: pd.DataFrame | None = None

@app.post("/api/upload")
async def api_upload(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="File must be .xlsx or .xls")
    
    excel_bytes = await file.read()
    excel_file = BytesIO(excel_bytes)

    df = excel_parsing.get_excel(excel_file)
    app.state.excel = df
    app.state.current_visas = excel_parsing.current_visas(df)

    return {
        "filename": file.filename,
        "rows": len(df),
        "columns": len(df.columns)
    }

@app.get("/api/dashboard")
async def api_dashboard():
    curr_visa = app.state.current_visas
    all_visa = app.state.excel
    f1_count, j1_count, h1b_count, pr_count = excel_parsing.get_case_type_totals(curr_visa)
    total_live_count = excel_parsing.get_total_live_cases(curr_visa)
    renew_visas = excel_parsing.visas_to_renew(curr_visa)
    pending_visas = excel_parsing.pending_visas(all_visa)

    return {
        "case data": {
            "total F-1 cases": f1_count,
            "total J-1 cases": j1_count,
            "total H-1B cases": h1b_count,
            "total Permanent Residency cases": pr_count,
            "total live cases": total_live_count,
        },
        "renew visas": renew_visas,
        "pending visas": pending_visas
    }

@app.get("/api/dashboard/{umbc_email}")
async def api_dashboard_user(umbc_email: str):
    return {"message": f"dashboard endpoint for {umbc_email}"}

@app.get("/api/report")
async def api_report():
    curr_visa = app.state.current_visas
    all_visa = app.state.excel
    report_stats = excel_parsing.get_report_stats(curr_visa, all_visa)
    period_stats = excel_parsing.get_period_stats(curr_visa)
    curr_visa_json = excel_parsing.get_employee_records(curr_visa)
    return {"current visas": curr_visa_json, "department and gender data": report_stats, "period data": period_stats}

@app.post("/api/personal")
async def api_personal(email : str):
    all_visa = app.state.excel
    curr_visa = app.state.excel
    personal_row = app.state.current_visas
    personal_row = curr_visa[curr_visa["Employee's UMBC email"] ==  email]
    personal_data = excel_parsing.get_employee_records(personal_row)
    gen_notes = excel_parsing.get_notes(email, all_visa)
    pr_notes = excel_parsing.get_pr_notes(email, all_visa)
    return {"personal visa row": personal_data, "general notes": gen_notes, "pr notes": pr_notes}

@app.post("/api/logout")
async def api_logout():
    return {"message": "logout endpoint"}