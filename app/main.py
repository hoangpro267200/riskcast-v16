# app/main.py
"""
RISKCAST Enterprise AI - FastAPI Application
Main entry point for the RISKCAST backend server
"""
import multiprocessing
import os
from pathlib import Path

# Windows multiprocessing fix - MUST be at top level
multiprocessing.freeze_support()

# Load .env file FIRST before importing anything else
from dotenv import load_dotenv

root_dir = Path(__file__).resolve().parent.parent
env_file = root_dir / ".env"
if env_file.exists():
    load_dotenv(env_file)
    print(f"[INFO] Loaded .env from: {env_file}")

# FastAPI imports
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, FileResponse, RedirectResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

# Application routers
from app.api import router as api_router
from app.api_ai import router as ai_router
from app.routes.overview import router as overview_router
from app.routes.update_shipment_route_v33 import router as update_shipment_router
from app.routes.ai_endpoints_v33 import router as ai_endpoints_router
from app.routes.overview_v34_4 import router as overview_v34_4_router

# Core modules
from app.core import build_helper
from app.core.templates import templates
from app.middleware.cache_headers import CacheHeadersMiddleware

app = FastAPI(
    title="RISKCAST Enterprise AI",
    description="Enterprise Risk Analytics Engine with AI Adviser (Fuzzy AHP + MC + VaR/CVaR + Claude 3.5 Sonnet)",
    version="19.0.0"
)

# ============================
# MIDDLEWARE (Order matters - first added is outermost)
# ============================
# Error Handler (outermost - catches all errors)
from app.middleware.error_handler import ErrorHandlerMiddleware
app.add_middleware(ErrorHandlerMiddleware)

# Security Headers Middleware
from app.middleware.security_headers import SecurityHeadersMiddleware
app.add_middleware(SecurityHeadersMiddleware)

# CORS Middleware (restricted origins)
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:8000,http://127.0.0.1:8000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    expose_headers=["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
)

# Cache Headers Middleware (for production assets)
app.add_middleware(CacheHeadersMiddleware)

# Session Middleware (for storing shipment data between pages)
from starlette.middleware.sessions import SessionMiddleware
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SESSION_SECRET_KEY", "riskcast-session-secret-key-change-in-production"))

# ============================
# TEMPLATES PATH - Use shared instance
# ============================
BASE_DIR = Path(__file__).resolve().parent  # nằm trong /app

# ============================
# TEMPLATE CONTEXT (Build Helper)
# ============================
def get_template_context():
    """Get global template context variables"""
    from app.core import build_helper
    return {
        "cdn_url": build_helper.get_cdn_url(),
        "build_version": build_helper.get_build_version(),
        "get_js_bundle": build_helper.get_js_bundle,
        "get_css_bundle": build_helper.get_css_bundle,
        "is_production": os.getenv("ENVIRONMENT", "development") == "production"
    }

# ============================
# STATIC FILES
# ============================
STATIC_DIR = BASE_DIR / "static"
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# ============================
# DIST (PRODUCTION BUNDLES)
# ============================
DIST_DIR = BASE_DIR.parent / "dist"
if DIST_DIR.exists():
    app.mount("/dist", StaticFiles(directory=str(DIST_DIR)), name="dist")

# ============================
# HANDLE BROWSER REQUESTS (Ignore 404 for common browser requests)
# ============================
@app.get("/.well-known/{path:path}")
async def well_known_handler(path: str):
    """Handle browser DevTools requests - return 204 No Content to avoid 404 logs"""
    return Response(status_code=204)

@app.get("/favicon.ico")
async def favicon_handler():
    """Handle favicon requests - return 204 No Content to avoid 404 logs"""
    return Response(status_code=204)

# ============================
# PAGES
# ============================

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    context = {"request": request}
    context.update(get_template_context())
    return templates.TemplateResponse("home.html", context)

@app.get("/input")
async def input_redirect():
    return RedirectResponse(url="/input_v20")

@app.get("/input_v19", response_class=HTMLResponse)
async def input_v19(request: Request):
    """Input page v19 - VisionOS Edition"""
    context = {"request": request}
    context.update(get_template_context())
    return templates.TemplateResponse("input/input_v19.html", context)

@app.get("/input_v20", response_class=HTMLResponse)
async def input_v20(request: Request):
    """Input page v20 - Premium VisionOS Edition with Luxurious Glow"""
    context = {"request": request}
    context.update(get_template_context())
    return templates.TemplateResponse("input/input_v20.html", context)

@app.get("/results", response_class=HTMLResponse)
async def results_page(request: Request):
    """Results page - Display risk analysis results"""
    context = {"request": request}
    context.update(get_template_context())
    return templates.TemplateResponse("results.html", context)

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard_page(request: Request):
    """Dashboard page - Shipment Tracking & Management"""
    context = {"request": request}
    context.update(get_template_context())
    return templates.TemplateResponse("dashboard.html", context)

@app.get("/summary", response_class=HTMLResponse)
async def summary_page(request: Request):
    """Summary page - Alias for overview"""
    context = {"request": request}
    context.update(get_template_context())
    return templates.TemplateResponse("pages/overview.html", context)

# ============================
# API ROUTES
# ============================
# Include new v1 API router
app.include_router(api_router, prefix="/api", tags=["api"])

# Include AI Adviser router
app.include_router(ai_router, prefix="/api/ai", tags=["AI Adviser"])

# Include Overview router
app.include_router(overview_router)

# Include Overview v33 routes (FutureOS Edition)
app.include_router(update_shipment_router)  # PATCH /api/update_shipment
app.include_router(ai_endpoints_router)  # POST /api/ai/*

# Include Overview v34.4 routes (Ultra Vision Pro)
app.include_router(overview_v34_4_router)  # GET /overview-v34-4
import importlib.util
api_py_path = Path(__file__).parent / "api.py"
if api_py_path.exists():
    spec = importlib.util.spec_from_file_location("legacy_api", api_py_path)
    if spec is not None and spec.loader is not None:
        legacy_api = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(legacy_api)
        app.include_router(legacy_api.router, prefix="/api", tags=["legacy"])
