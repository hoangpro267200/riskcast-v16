# app/api/__init__.py
from fastapi import APIRouter
from .v1.analyze import router as analyze_router

# Create main API router
router = APIRouter()

# Include v1 router
router.include_router(analyze_router, prefix="/v1", tags=["v1"])

