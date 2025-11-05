from fastapi import FastAPI

app = FastAPI()

@app.post("/api/upload")
async def api_upload():
    return {"message": "upload endpoint"}

@app.get("/api/dashboard")
async def api_dashboard():
    return {"message": "dashboard endpoint"}

@app.get("/api/dashboard/{umbc_email}")
async def api_dashboard_user(umbc_email: str):
    return {"message": f"dashboard endpoint for {umbc_email}"}

@app.get("/api/report")
async def api_report():
    return {"message": "report endpoint"}

@app.post("/api/logout")
async def api_logout():
    return {"message": "logout endpoint"}