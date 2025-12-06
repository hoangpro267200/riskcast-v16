"""
RISKCAST Security - Security Headers Middleware
Adds security headers to all responses
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import os

# CSP Policy - Content Security Policy configuration
# Allows: Google Fonts, Phosphor Icons from unpkg.com, Plotly, Chart.js, Google Translate, Cesium, Leaflet, and necessary inline scripts/styles

# Build CSP directives as lists for cleaner management
script_src = [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://unpkg.com",
    "https://cdn.jsdelivr.net",
    "https://cdn.plot.ly",
    "https://translate.google.com",
    "https://translate.googleapis.com",
    "https://cesium.com",
    "https://*.cesium.com"
]

style_src = [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "https://unpkg.com",
    "https://cdn.jsdelivr.net",
    "https://www.gstatic.com",
    "https://cesium.com",
    "https://*.cesium.com"
]

img_src = [
    "'self'",
    "data:",
    "https://unpkg.com",
    "https://fonts.gstatic.com",
    "https://cdn.plot.ly",
    "https://www.gstatic.com",
    "https://cesium.com",
    "https://*.cesium.com",
    "https://a.basemaps.cartocdn.com",
    "https://b.basemaps.cartocdn.com",
    "https://c.basemaps.cartocdn.com",
    "https://*.cartocdn.com",
    "https://*.carto.com"
]

csp = {
    "default-src": "'self'",
    "img-src": " ".join(img_src),
    "style-src": " ".join(style_src),
    "script-src": " ".join(script_src),
    "font-src": "'self' data: https://fonts.gstatic.com https://unpkg.com https://cdn.jsdelivr.net https://cesium.com https://*.cesium.com",
    "connect-src": "'self' https://fonts.googleapis.com https://unpkg.com https://cdn.plot.ly https://cdn.jsdelivr.net https://translate.google.com https://translate.googleapis.com https://cesium.com https://*.cesium.com https://api.cesium.com https://a.basemaps.cartocdn.com https://b.basemaps.cartocdn.com https://c.basemaps.cartocdn.com https://*.cartocdn.com https://*.carto.com",
    "worker-src": "'self' blob: https://cesium.com https://*.cesium.com",
}

# Build CSP policy string from dictionary
CSP_POLICY = os.getenv(
    "CSP_POLICY",
    "; ".join([f"{k} {v}" for k, v in csp.items()])
)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware to add security headers to all responses"""
    
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = CSP_POLICY
        
        # HSTS (only for HTTPS)
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        # Permissions Policy (formerly Feature Policy)
        response.headers["Permissions-Policy"] = (
            "geolocation=(), microphone=(), camera=(), "
            "payment=(), usb=(), magnetometer=(), gyroscope=()"
        )
        
        return response


