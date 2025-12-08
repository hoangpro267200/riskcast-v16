# app/routes/overview.py
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, JSONResponse
from app.core.templates import templates
from app.memory import memory_system
import importlib.util
from pathlib import Path

# Import LAST_RESULT from app/api.py module file (not from app/api package)
_api_module_path = Path(__file__).parent.parent / "api.py"
_api_spec = importlib.util.spec_from_file_location("_api_module", _api_module_path)
_api_module = importlib.util.module_from_spec(_api_spec)
_api_spec.loader.exec_module(_api_module)
LAST_RESULT = _api_module.LAST_RESULT

# Port database with lat/lon
PORT_DATABASE = {
    'VNSGN': {'name': 'Ho Chi Minh', 'country': 'Vietnam', 'code': 'VNSGN', 'lat': 10.8231, 'lon': 106.6297},
    'SGN': {'name': 'Ho Chi Minh', 'country': 'Vietnam', 'code': 'VNSGN', 'lat': 10.8231, 'lon': 106.6297},
    'CNSHA': {'name': 'Shanghai', 'country': 'China', 'code': 'CNSHA', 'lat': 31.2304, 'lon': 121.4737},
    'SHA': {'name': 'Shanghai', 'country': 'China', 'code': 'CNSHA', 'lat': 31.2304, 'lon': 121.4737},
    'SGSIN': {'name': 'Singapore', 'country': 'Singapore', 'code': 'SGSIN', 'lat': 1.3521, 'lon': 103.8198},
    'SIN': {'name': 'Singapore', 'country': 'Singapore', 'code': 'SGSIN', 'lat': 1.3521, 'lon': 103.8198},
    'HKHKG': {'name': 'Hong Kong', 'country': 'Hong Kong', 'code': 'HKHKG', 'lat': 22.3193, 'lon': 114.1694},
    'HKG': {'name': 'Hong Kong', 'country': 'Hong Kong', 'code': 'HKHKG', 'lat': 22.3193, 'lon': 114.1694},
    'USLAX': {'name': 'Los Angeles', 'country': 'USA', 'code': 'USLAX', 'lat': 33.7701, 'lon': -118.1937},
    'LAX': {'name': 'Los Angeles', 'country': 'USA', 'code': 'USLAX', 'lat': 33.7701, 'lon': -118.1937},
    'USJFK': {'name': 'New York', 'country': 'USA', 'code': 'USJFK', 'lat': 40.6413, 'lon': -73.7781},
    'JFK': {'name': 'New York', 'country': 'USA', 'code': 'USJFK', 'lat': 40.6413, 'lon': -73.7781},
    'CMP': {'name': 'Ho Chi Minh', 'country': 'Vietnam', 'code': 'VNSGN', 'lat': 10.8231, 'lon': 106.6297},
}

def get_port_info(port_code: str):
    """Get port information from database"""
    if not port_code:
        return PORT_DATABASE.get('VNSGN')
    port_code = port_code.upper()
    return PORT_DATABASE.get(port_code, PORT_DATABASE.get('VNSGN'))

def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate great circle distance between two points in kilometers using Haversine formula"""
    import math
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    return R * c

# Create router
router = APIRouter()

@router.get("/overview", response_class=HTMLResponse)
async def overview_page(request: Request):
    """
    Overview page - Global 3D Overview (v34.4 Ultra Vision Pro)
    Redirects to v34.4 route which uses the new __RISKCAST_STATE__ format
    """
    from fastapi.responses import RedirectResponse
    # Redirect to v34.4 route
    return RedirectResponse(url="/overview-v34-4", status_code=307)


@router.get("/global-overview", response_class=HTMLResponse)
async def global_overview_page(request: Request):
    """Global Overview page - Alias for /overview (v32)"""
    # Reuse the same logic as /overview
    return await overview_page(request)


@router.get("/api/shipment/state")
async def get_shipment_state():
    """
    Return complete shipment state for Overview v31.
    This is the primary data source for the frontend.
    
    Returns:
    {
        "cargo": {...},
        "transport": {...},
        "parties": {...},
        "risk": {...},
        "segments": [
            {
                "from": "VNSGN",
                "to": "SGSIN",
                "lat1": 10.8231,
                "lon1": 106.6297,
                "lat2": 1.3521,
                "lon2": 103.8198,
                "distance": 1087
            },
            ...
        ]
    }
    """
    # Get shipment data from memory system
    shipment_data = memory_system.get("latest_shipment") or {}
    
    # If no shipment data, return empty state (not an error)
    # Frontend will use template fallback
    if not shipment_data:
        return JSONResponse({
            "cargo": {},
            "transport": {},
            "parties": {},
            "risk": {},
            "segments": []
        })
    
    # Extract port codes
    pol_code = shipment_data.get("pol_code") or shipment_data.get("origin") or "VNSGN"
    pod_code = shipment_data.get("pod_code") or shipment_data.get("destination") or "CNSHA"
    pol_info = get_port_info(pol_code)
    pod_info = get_port_info(pod_code)
    
    # Get transport mode
    transport_mode = shipment_data.get("transport_mode", "")
    mode = "ocean"
    if transport_mode:
        mode = transport_mode.replace("_fcl", "").replace("_lcl", "").replace("_", "")
    
    # Build segments
    singapore = get_port_info("SGSIN")
    direct_distance = calculate_distance_km(pol_info['lat'], pol_info['lon'], pod_info['lat'], pod_info['lon'])
    
    segments = []
    if direct_distance > 8000:
        seg1_distance = calculate_distance_km(pol_info['lat'], pol_info['lon'], singapore['lat'], singapore['lon'])
        seg2_distance = calculate_distance_km(singapore['lat'], singapore['lon'], pod_info['lat'], pod_info['lon'])
        
        segments = [
            {
                "from": pol_info['code'],
                "to": singapore['code'],
                "lat1": pol_info['lat'],
                "lon1": pol_info['lon'],
                "lat2": singapore['lat'],
                "lon2": singapore['lon'],
                "distance": round(seg1_distance, 1)
            },
            {
                "from": singapore['code'],
                "to": pod_info['code'],
                "lat1": singapore['lat'],
                "lon1": singapore['lon'],
                "lat2": pod_info['lat'],
                "lon2": pod_info['lon'],
                "distance": round(seg2_distance, 1)
            }
        ]
    else:
        segments = [
            {
                "from": pol_info['code'],
                "to": pod_info['code'],
                "lat1": pol_info['lat'],
                "lon1": pol_info['lon'],
                "lat2": pod_info['lat'],
                "lon2": pod_info['lon'],
                "distance": round(direct_distance, 1)
            }
        ]
    
    # Build complete state
    state = {
        "cargo": {
            "type": shipment_data.get("cargo_type", "Electronics") or "Electronics",
            "hsCode": "8471.30",
            "quantity": "2 x 40' HC",
            "weight": "24,000 kg",
            "value": f"${shipment_data.get('cargo_value', 150000):,}" if shipment_data.get('cargo_value') else "$150,000"
        },
        "transport": {
            "mode": mode,
            "pol": f"{pol_info['name']}, {pol_info['country']} ({pol_info['code']})",
            "pod": f"{pod_info['name']}, {pod_info['country']} ({pod_info['code']})",
            "etd": shipment_data.get("etd", "2025-12-10"),
            "eta": shipment_data.get("eta", "2025-12-25")
        },
        "parties": {
            "seller": shipment_data.get("seller", "VN Tech Export Ltd.") or "VN Tech Export Ltd.",
            "buyer": shipment_data.get("buyer", "Shanghai Electronics Co.") or "Shanghai Electronics Co.",
            "incoterms": shipment_data.get("incoterm", "FOB") or "FOB",
            "paymentTerms": "L/C at sight"
        },
        "risk": {
            "score": float(shipment_data.get("risk_score", 7.2)) if shipment_data.get("risk_score") else 7.2,
            "level": shipment_data.get("risk_level", "Medium") or "Medium",
            "factors": [
                {"icon": "🌊", "label": "Weather: Moderate"},
                {"icon": "⚓", "label": "Port Congestion: Low"},
                {"icon": "📋", "label": "Documentation: OK"}
            ]
        },
        "segments": segments
    }
    
    return JSONResponse(state)


@router.get("/api/overview_data")
async def get_overview_data():
    """
    Return latest shipment snapshot for Overview v21.
    
    Try order:
    1. memory_system.get("latest_shipment")
    2. Fallback: demo data
    """
    data = memory_system.get("latest_shipment")
    
    if not data:
        # Safe fallback demo data
        data = {
            "shipment_id": "RC-DEMO",
            "trade_lane_key": "vn_hk",
            "trade_lane_label": "Vietnam → Hong Kong",
            "mode": "ocean_fcl",
            "mode_label": "Sea Freight — FCL",
            "shipment_type_label": "Đường Biển — FCL",
            "pol_code": "CMP",
            "pod_code": "HKHKG",
            "carrier": "Maersk",
            "etd": "2025-12-09",
            "eta": "2025-12-11",
            "transit_days": 2,
            "risk_score": 12,
            "risk_level": "low",
            "reliability_score": 92,
            "weather": {
                "origin": {"code": "CMP", "temp_c": 30, "condition": "Sunny"},
                "destination": {"code": "HKHKG", "temp_c": 28, "condition": "Partly cloudy"}
            }
        }
    
    return JSONResponse(data)

