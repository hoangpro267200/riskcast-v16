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

# Create router
router = APIRouter()

@router.get("/overview", response_class=HTMLResponse)
async def overview_page(request: Request):
    """Overview page - Global 3D Overview of all shipment data (v31)"""
    # Priority 1: Get shipment data from session (most recent)
    shipment_data = request.session.get("shipment_data", {})
    
    # Priority 2: Get from memory system
    if not shipment_data:
        shipment_data = memory_system.get("latest_shipment") or {}
    
    # Priority 3: Get from LAST_RESULT (legacy)
    if not shipment_data and LAST_RESULT:
        shipment = LAST_RESULT.get('shipment', {})
        if shipment:
            shipment_data = {
                'transport_mode': shipment.get('transport_mode', ''),
                'route': shipment.get('route', ''),
                'eta': shipment.get('eta', ''),
                'etd': shipment.get('etd', ''),
                'cargo_type': shipment.get('cargo_type', ''),
                'cargo_value': shipment.get('cargo_value', 0),
                'pol_code': shipment.get('origin', ''),
                'pod_code': shipment.get('destination', ''),
                'risk_score': LAST_RESULT.get('overall_risk', 7.2),
                'risk_level': LAST_RESULT.get('risk_level', 'Medium')
            }
    
    # Get POL/POD info
    pol_code = shipment_data.get("pol_code") or shipment_data.get("origin") or "VNSGN"
    pod_code = shipment_data.get("pod_code") or shipment_data.get("destination") or "CNSHA"
    pol_info = get_port_info(pol_code)
    pod_info = get_port_info(pod_code)
    
    # Get transport mode
    transport_mode = shipment_data.get("transport_mode", "")
    mode = "ocean"
    if transport_mode:
        mode = transport_mode.replace("_fcl", "").replace("_lcl", "").replace("_", "")
    
    # Build segments (simple 2-segment route: POL -> Singapore -> POD)
    singapore = get_port_info("SGSIN")
    segments = [
        {
            "fromCode": pol_info['code'],
            "toCode": singapore['code'],
            "fromName": pol_info['name'],
            "toName": singapore['name'],
            "fromLat": pol_info['lat'],
            "fromLon": pol_info['lon'],
            "toLat": singapore['lat'],
            "toLon": singapore['lon'],
            "mode": mode
        },
        {
            "fromCode": singapore['code'],
            "toCode": pod_info['code'],
            "fromName": singapore['name'],
            "toName": pod_info['name'],
            "fromLat": singapore['lat'],
            "fromLon": singapore['lon'],
            "toLat": pod_info['lat'],
            "toLon": pod_info['lon'],
            "mode": mode
        }
    ]
    
    # Build overview_state_json for frontend
    overview_state_json = {
        "transport": {
            "mode": mode,
            "pol": pol_info,
            "pod": pod_info,
            "etd": shipment_data.get("etd", "2025-12-10"),
            "eta": shipment_data.get("eta", "2025-12-25")
        },
        "cargo": {
            "type": shipment_data.get("cargo_type", "Electronics") or "Electronics",
            "hsCode": "8471.30",
            "quantity": "2 x 40' HC",
            "weight": "24,000 kg",
            "value": f"${shipment_data.get('cargo_value', 150000):,}" if shipment_data.get('cargo_value') else "$150,000"
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
        "segments": segments,
        "ui": {
            "isNightMode": True,
            "is3DMode": True
        }
    }
    
    return templates.TemplateResponse("overview_v31.html", {
        "request": request,
        "data": shipment_data,  # Pass raw shipment data for JavaScript
        "overview_state_json": overview_state_json  # Pass formatted state for bootstrap
    })


@router.get("/global-overview", response_class=HTMLResponse)
async def global_overview_page(request: Request):
    """Global Overview page - Alias for /overview (v31)"""
    # Reuse the same logic as /overview
    return await overview_page(request)


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

