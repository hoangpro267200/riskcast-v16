# app/main.py
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import os

# Import router API (from app/api/__init__.py)
from app.api import router as api_router
from app.api_ai import router as ai_router

app = FastAPI(
    title="RISKCAST Enterprise AI",
    description="Enterprise Risk Analytics Engine with AI Adviser (Fuzzy AHP + MC + VaR/CVaR + Claude 3.5 Sonnet)",
    version="15.0.0"
)

# ============================
# CORS MIDDLEWARE
# ============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# TEMPLATES PATH — FIX QUAN TRỌNG
# ============================
BASE_DIR = Path(__file__).resolve().parent  # nằm trong /app
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# ============================
# STATIC
# ============================
STATIC_DIR = BASE_DIR / "static"
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# ============================
# HANDLE BROWSER REQUESTS (Ignore 404 for common browser requests)
# ============================
@app.get("/.well-known/{path:path}")
async def well_known_handler(path: str):
    """Handle browser DevTools requests - return 204 No Content to avoid 404 logs"""
    from fastapi.responses import Response
    return Response(status_code=204)

@app.get("/favicon.ico")
async def favicon_handler():
    """Handle favicon requests - return 204 No Content to avoid 404 logs"""
    from fastapi.responses import Response
    return Response(status_code=204)

# ============================
# PAGES
# ============================

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.get("/input", response_class=HTMLResponse)
async def input_page(request: Request):
    """Input page - Form to enter shipment data"""
    return templates.TemplateResponse("input.html", {"request": request})

@app.get("/results", response_class=HTMLResponse)
async def results_page(request: Request):
    """Results page - Display risk analysis results"""
    return templates.TemplateResponse("results.html", {"request": request})

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard_page(request: Request):
    """Dashboard page - Shipment Tracking & Management"""
    return templates.TemplateResponse("dashboard.html", {"request": request})

@app.get("/overview", response_class=HTMLResponse)
async def overview_page(request: Request):
    """Overview page - Summary Overview of all shipment data"""
    return templates.TemplateResponse("overview.html", {"request": request})

@app.get("/summary", response_class=HTMLResponse)
async def summary_page(request: Request):
    """Summary page - Alias for overview"""
    return templates.TemplateResponse("overview.html", {"request": request})

# ============================
# API ROUTES
# ============================
# Include new v1 API router
app.include_router(api_router, prefix="/api", tags=["api"])

# Include AI Adviser router
app.include_router(ai_router, prefix="/api/ai", tags=["AI Adviser"])

# Include legacy router from api.py (for backward compatibility)
# Note: Import directly from file to avoid conflict with module
import importlib.util
api_py_path = Path(__file__).parent / "api.py"
if api_py_path.exists():
    spec = importlib.util.spec_from_file_location("legacy_api", api_py_path)
    legacy_api = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(legacy_api)
    app.include_router(legacy_api.router, prefix="/api", tags=["legacy"])
