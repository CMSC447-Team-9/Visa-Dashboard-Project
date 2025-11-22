from fastapi import FastAPI, File, UploadFile, HTTPException
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import excel_parsing
import pandas as pd
from io import BytesIO

app = FastAPI()
app.state.excel: pd.DataFrame | None = None

@app.post("/api/upload")
async def api_upload(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="File must be .xlsx or .xls")
    
    excel_bytes = await file.read()
    excel_file = BytesIO(excel_bytes)

    df = excel_parsing.get_excel(excel_file)
    app.state.excel = df

    return {
        "filename": file.filename,
        "rows": len(df),
        "columns": len(df.columns)
    }

@app.get("/api/dashboard")
async def api_dashboard():
    df = app.state.excel
    f1_count, j1_count, h1b_count, pr_count = excel_parsing.get_case_type_totals(df)
    total_live_count = excel_parsing.get_total_live_cases(df)

    return {
        "total F-1 cases": f1_count,
        "total J-1 cases": j1_count,
        "total H-1B cases": h1b_count,
        "total Permanent Residency cases": pr_count,
        "total live cases": total_live_count,
    }

@app.get("/api/dashboard/{umbc_email}")
async def api_dashboard_user(umbc_email: str):
    return {"message": f"dashboard endpoint for {umbc_email}"}

@app.get("/api/report")
async def api_report():
    return {"message": "report endpoint"}

@app.post("/api/logout")
async def api_logout():
    return {"message": "logout endpoint"}