from io import BytesIO
import pandas as pd
import lib.excel_parsing as excel_parsing
from fastapi import FastAPI, File, UploadFile, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
from pathlib import Path
from uuid import uuid4
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

IS_PROD = os.getenv("ENVIRONMENT", "development") == "production"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.state.excel: pd.DataFrame | None = None
app.state.current_visas: pd.DataFrame | None = None


@app.post("/api/upload")
async def api_upload( response: Response, file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.xlsx', '.xls')):
        raise HTTPException(
            status_code=400, detail="File must be .xlsx or .xls")

    excel_bytes = await file.read()
    excel_file = BytesIO(excel_bytes)

    df = excel_parsing.get_excel(excel_file)
    if not (("Last name" in df.columns) or
            ("First Name" in df.columns) or
            ("Employee's UMBC email" in df.columns) or
            ("Personal email" in df.columns) or
            ("Filed by" in df.columns) or
            ("Country of Birth" in df.columns) or
            ("All Citizenships" in df.columns) or
            ("Gender" in df.columns) or
            ("Case type" in df.columns) or
            ("Permanent residency notes" in df.columns) or
            ("Dependents" in df.columns) or
            ("initial H-1B start" in df.columns) or
            ("Start date" in df.columns) or
            ("Expiration Date" in df.columns) or
            ("Prep extension date" in df.columns) or
            ("Max H period" in df.columns) or
            ("Document Expiry I-94" in df.columns) or
            ("General notes" in df.columns) or
            ("soc code" in df.columns) or
            ("soc code description" in df.columns) or
            ("Department" in df.columns) or
            ("Employee Title" in df.columns) or
            ("Department Admin" in df.columns) or
            ("Department Advisor/PI/chair" in df.columns) or
            ("Annual Salary" in df.columns) or
            ("Employee Educational Level" in df.columns) or
            ("Employee Educational Field" in df.columns)):
        raise HTTPException(
            status_code=400, detail="Excel file is missing expected columns")

    app.state.excel = df
    app.state.current_visas = excel_parsing.current_visas(df)
    
    # Generates a session id
    session_id = str(uuid4())
    response.set_cookie(
        key="sessionid",
        value=session_id,
        max_age=60 * 60,   
        path="/",          
        httponly=True,       
        secure=IS_PROD,          
        samesite="lax"       
    )

    return {
        "filename": file.filename,
        "rows": len(df),
        "columns": len(df.columns)
    }


@app.get("/api/dashboard")
async def api_dashboard():
    if app.state.excel is None:
        raise HTTPException(
            status_code=404,
            detail="Visa data not loaded"
        )
    if app.state.current_visas is None:
        raise HTTPException(
            status_code=503,
            detail="Current visa data not processed"
        )

    curr_visa = app.state.current_visas
    all_visa = app.state.excel
    f1_count, j1_count, h1b_count, pr_count = excel_parsing.get_case_type_totals(
        curr_visa)
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
    raise HTTPException(
        status_code=503, detail="This endpoint is not yet implemented."
    )
    return {"message": f"dashboard endpoint for {umbc_email}"}


@app.get("/api/report")
async def api_report():
    curr_visa = app.state.current_visas
    active_count = excel_parsing.get_total_live_cases(curr_visa)
    expiring_count = len(excel_parsing.visas_to_renew(curr_visa))
    case_type_totals = excel_parsing.get_case_type_totals(curr_visa)
    curr_visa_json = excel_parsing.get_employee_records(curr_visa)
    return {
        "status": "success",
        "active": active_count,
        "expiring": expiring_count,
        "visa_types": {
            "f1":case_type_totals[0],
            "j1":case_type_totals[1],
            "h1":case_type_totals[2],
            "residency":case_type_totals[3],
        },
        "entry_count": len(curr_visa_json),
        "entries": curr_visa_json
    }


@app.post("/api/personal")
async def api_personal(email: str):
    all_visa = app.state.excel
    curr_visa = app.state.excel
    personal_row = app.state.current_visas
    personal_row = curr_visa[curr_visa["Employee's UMBC email"] == email]
    personal_data = excel_parsing.get_employee_records(personal_row)
    gen_notes = excel_parsing.get_notes(email, all_visa)
    pr_notes = excel_parsing.get_pr_notes(email, all_visa)
    return {"personal visa row": personal_data, "general notes": gen_notes, "pr notes": pr_notes}


@app.post("/api/logout")
async def api_logout(request: Request, response: Response):
    # Iterate over all cookies sent in the request
    for cookie_name in request.cookies.keys():
        response.delete_cookie(
            key=cookie_name,
            path="/",            
            domain=None,       
            httponly=True,
            samesite="lax"
        )
    return {"message": "Logged out"}
