from fastapi import FastAPI
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import excel_parsing

app = FastAPI()

@app.post("/api/upload")
async def api_upload():
    return {"message": "upload endpoint"}

@app.get("/api/dashboard")
async def api_dashboard():
    f1_count, j1_count, h1b_count, pr_count = excel_parsing.get_case_type_totals()
    total_live_count = excel_parsing.get_total_live_cases()

    return {
        "total F-1 cases": f1_count,
        "total J-1 cases": j1_count,
        "total H-1B cases": h1b_count,
        "total Permanent Residency cases": pr_count,
        "total_live_cases": total_live_count,
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